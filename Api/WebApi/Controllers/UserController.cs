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
        private readonly UserBll userBll = new UserBll(Global.ConnectionString!);

        [HttpGet("{page}")]
        public IActionResult Get(int page)
        {
            User user = new User { Page = page };
            List<User>? users = userBll.GetList(user);

            return Ok(new { Result = users, Rows = user.Rows });
        }

        [HttpPost]
        public IActionResult Create([FromBody] User user)
        {
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out Guid userId);
            user.UserCreated = userId;
            userBll.Save(user);
            if (user.Code == null) return Ok();

            return BadRequest(user.GetOutput());
        }

        [HttpPut]
        public IActionResult Update([FromBody] User user)
        {
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out Guid userId);
            user.UserUpdated = userId;
            userBll.Save(user);
            if (user.Code == null) return Ok();

            return BadRequest(user.GetOutput());
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out Guid userId);
            User user = new User { UserId = id, UserUpdated = userId };
            userBll.Delete(user);
            if (user.Code == null) return Ok();

            return BadRequest(user.GetOutput());
        }
    }
}