using System.Security.Claims;
using BusinessLayer.Logic;
using Domain.models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserBll userBll = new(Settings.ConnectionString!);

        [HttpGet("{page}")]
        public IActionResult Get(int page)
        {
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out Guid sessionId);
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out Guid userId);

            User user = new() { Page = page, SessionId = sessionId, UserCreated = userId };
            List<User>? users = userBll.GetList(user);
            if (user.Code == null) return Ok(new { Result = users, Rows = user.Rows });
            else if (user.Code == 2) return Forbid();
            else return BadRequest(user.GetOutput());
        }

        [HttpPost]
        public IActionResult Create([FromBody] User user)
        {
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out Guid userId);
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out Guid sessionId);
            user.SessionId = sessionId;
            user.UserCreated = userId;

            userBll.Save(user);
            if (user.Code == null) return Ok();
            else if (user.Code == 2) return Forbid();
            else return BadRequest(user.GetOutput());
        }

        [HttpPut]
        public IActionResult Update([FromBody] User user)
        {
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out Guid userId);
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out Guid sessionId);
            user.SessionId = sessionId;
            user.UserUpdated = userId;
            
            userBll.Update(user);
            if (user.Code == null) return Ok();
            else if (user.Code == 2) return Forbid();
            else return BadRequest(user.GetOutput());
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out Guid userId);
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out Guid sessionId);
            
            User user = new() { UserId = id, UserUpdated = userId, SessionId = sessionId };
            userBll.Delete(user);
            if (user.Code == null) return Ok();
            else if (user.Code == 2) return Forbid();
            else return BadRequest(user.GetOutput());
        }
    }
}