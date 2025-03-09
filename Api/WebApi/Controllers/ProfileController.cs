using System.Security.Claims;
using BusinessLayer.Logic;
using Domain.models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly ProfileBll profileBll = new(Settings.ConnectionString!);

        [HttpGet("list")]
        public IActionResult GetList() {
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out Guid sessionId);
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out Guid userId);

            Profile request = new () { IsActive = true, UserCreated = userId, SessionId = sessionId };
            List<Profile>? profileList = profileBll.GetList(request);

            if (request.Code == null) return Ok(profileList);
            else if (request.Code == 2) return Forbid();
            else return BadRequest(request.GetOutput());
        }

        [HttpGet]
        public IActionResult Get(int page, string? filter = null) {
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out Guid sessionId);
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out Guid userId);

            Profile request = new () { Page = page, Filter = filter, SessionId = sessionId, UserCreated = userId };
            List<Profile>? profileList = profileBll.GetAll(request);

            if (request.Code == null) return Ok(new { Result = profileList, Rows = request.Rows });
            else if (request.Code == 2) return Forbid();
            else return BadRequest(request.GetOutput());
        }
        
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult Post([FromBody] Profile profile)
        {
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out Guid userId);
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out Guid sessionId);
            profile.SessionId = sessionId;
            profile.UserCreated = userId;
            profileBll.Save(profile);

            if (profile.Code == null) return Ok();
            else if (profile.Code == 2) return Forbid();
            else return BadRequest(profile.GetOutput());
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public IActionResult Put([FromBody] Profile profile)
        {
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out Guid userId);
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out Guid sessionId);
            profile.SessionId = sessionId;
            profile.UserUpdated = userId;
            profileBll.Update(profile);

            if (profile.Code == null) return Ok();
            else if (profile.Code == 2) return Forbid();
            else return BadRequest(profile.GetOutput());
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{profileId}")]
        public IActionResult Delete(Guid profileId)
        {
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out Guid userId);
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.Sid), out Guid sessionId);

            Profile profile = new() { UserUpdated = userId, ProfileId = profileId, SessionId = sessionId };
            profileBll.Delete(profile);

            if (profile.Code == null) return Ok();
            else if (profile.Code == 2) return Forbid();
            else return BadRequest(profile.GetOutput());
        }

    }
}