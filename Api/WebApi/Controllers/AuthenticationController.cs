using System.Security.Claims;
using BusinessLayer.Logic;
using Domain.models;
using JwtHandler;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Google.Apis.Auth;
using Domain.helpers;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly SessionBll sessionBll = new(Settings.ConnectionString!);
        private readonly UserBll userBll = new(Settings.ConnectionString!);
        private readonly CookieOptions cookieOptions = new()
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddMinutes(15)
        };

        [HttpPost]
        public async Task<IActionResult> AuthenticateAsync([FromBody] GoogleAuthRequest request)
        {
            if (string.IsNullOrEmpty(request.Credential)) return BadRequest(new { Message = "Invalid parameter" });
            try {
                GoogleJsonWebSignature.ValidationSettings settings = new() { Audience = [Settings.GoogleClientId] };
                GoogleJsonWebSignature.Payload payload = await GoogleJsonWebSignature.ValidateAsync(request.Credential, settings);
            
                string email = payload.Email;
                object Audience = payload.Audience;

                Session session = new () { Email = email };

                sessionBll.Create(session);

                if (session.Code != null) return BadRequest(new { Message = session.Message });

                if (!session.UserId.HasValue || !session.Id.HasValue) return BadRequest(new { Message = "Something goes wrong" });

                string accessToken = Handler.GenerateAccessToken(session.UserId.Value, session.Id.Value, session.ProfileName!);
                string refreshToken = Handler.GenerateRefreshToken(session.UserId.Value, session.Id.Value, session.ProfileName!);
                Response.Cookies.Append("accessToken", accessToken!, cookieOptions);
                Response.Cookies.Append("refreshToken", refreshToken!, cookieOptions);
                return Ok(new { Name = session.FullName, Profile = session.ProfileName, ModuleList = session.ModuleList });
            }
            catch (Exception ex) {
                return BadRequest(ex);
            }
            
        }

        [Authorize(AuthenticationSchemes = "RefreshToken")]
        [HttpGet("refresh")]
        public IActionResult Refresh()
        {
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out Guid userId);
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out Guid sessionId);

            User _user = new ()
            {
                UserId = userId,
                SessionId = sessionId,
                UserCreated = userId
            };

            User? user = userBll.GetById(_user);

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
            
            Session session = new () {  SessionId = sessionId };
            sessionBll.Delete(session);

            Response.Cookies.Delete("accessToken");
            Response.Cookies.Delete("refreshToken");

            Output response = session.GetOutput();
            if (response.Code != null) return BadRequest(response);
            return Ok();
        }
    }
}