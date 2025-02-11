using System.Security.Claims;
using BusinessLayer.Logic;
using Domain.helpers;
using Domain.models;
using JwtHandler;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly SessionBll sessionBll = new(Global.ConnectionString!);
        private readonly UserBll userBll = new(Global.ConnectionString!);
        private readonly CookieOptions cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddMinutes(6)
        };

        [HttpPost]
        public IActionResult Authenticate([FromBody] Authentication authenticacion) {
            if (string.IsNullOrEmpty(authenticacion.UserName) || string.IsNullOrEmpty(authenticacion.Password)) return Unauthorized();

            User? user = userBll.GetByUserNameAndPassword(authenticacion.UserName, authenticacion.Password);

            if (user ==  null) return Unauthorized();

            Session session = new () { UserId = user.UserId };
            sessionBll.Save(session);

            if (session.Code != null) return BadRequest(session.Message);

            if (!user.UserId.HasValue || !session.Id.HasValue) return Unauthorized();

            string accessToken = Handler.GenerateAccessToken(user.UserId.Value, session.Id.Value, user.ProfileName!);
            string refreshToken = Handler.GenerateRefreshToken(user.UserId.Value, session.Id.Value, user.ProfileName!);
            Response.Cookies.Append("accessToken", accessToken!, cookieOptions);
            Response.Cookies.Append("refreshToken", refreshToken!, cookieOptions);
            return Ok();
        }

        [Authorize(AuthenticationSchemes = "RefreshToken")]
        [HttpGet("refresh")]
        public IActionResult Refresh()
        {
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out Guid userId);
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out Guid sessionId);

            User? user = userBll.GetById(userId);

            if (user == null) {
                sessionBll.Delete(new { SessionId = sessionId });
                Response.Cookies.Delete("accessToken");
                Response.Cookies.Delete("refreshToken");
                return Unauthorized();
            }

            string accessToken = Handler.GenerateAccessToken(userId, sessionId, User.FindFirstValue(ClaimTypes.Role)!);
            string refreshToken = Handler.GenerateRefreshToken(userId, sessionId, User.FindFirstValue(ClaimTypes.Role)!);
            Response.Cookies.Append("accessToken", accessToken!, cookieOptions);
            Response.Cookies.Append("refreshToken", refreshToken!, cookieOptions);

            return Ok();
        }

        [Authorize(AuthenticationSchemes = "RefreshToken")]
        [HttpGet("logout")]
        public IActionResult Logout()
        {
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out Guid sessionId);

            sessionBll.Delete(new { SessionId = sessionId });
            Response.Cookies.Delete("accessToken");
            Response.Cookies.Delete("refreshToken");
            return Ok();
        }

        [HttpPost("logout/user")]
        public IActionResult UserLogout([FromBody] Authentication authentication) {
            sessionBll.Delete(new { UserName = authentication.UserName });
            Response.Cookies.Delete("accessToken");
            Response.Cookies.Delete("refreshToken");
            return Ok();
        }
    }
}