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
        private readonly ProfileBll profileBll = new(Global.ConnectionString!);

        [HttpGet("list")]
        public IEnumerable<Profile>? GetList() {
            Profile request = new () { IsActive = true };
            return profileBll.GetList(request);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public IActionResult Get(int page, string? filter = null) {
            Profile request = new () { Page = page, Filter = filter };
            List<Profile>? profileList = profileBll.GetAll(request);
            return Ok(new { Result = profileList, Rows = request.Rows });
        }
        
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult Post([FromBody] Profile profile)
        {
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out Guid userId);
            profile.UserCreated = userId;
            profileBll.Create(profile);

            if (profile.Code == null) return Ok();

            return BadRequest(profile.GetOutput());
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public IActionResult Put([FromBody] Profile profile)
        {
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out Guid userId);
            profile.UserUpdated = userId;
            profileBll.Edit(profile);

            if (profile.Code == null) return Ok();

            return BadRequest(profile.GetOutput());
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{profileId}")]
        public IActionResult Delete(Guid profileId)
        {
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out Guid userId);

            Profile profile = new Profile() { UserUpdated = userId, ProfileId = profileId };
            profileBll.Delete(profile);

            if (profile.Code == null) return Ok();

            return BadRequest(profile.GetOutput());
        }

    }
}