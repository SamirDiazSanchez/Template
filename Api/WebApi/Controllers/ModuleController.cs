using System.Security.Claims;
using BusinessLayer.Logic;
using Domain.helpers;
using Domain.models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ModuleController : ControllerBase
    {
        private readonly ModuleBll moduleBll = new (Global.ConnectionString!);
        
        [HttpGet("list")]
        public IEnumerable<Module>? GetList() {
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out Guid userId);
            return moduleBll.GetByUserId(userId);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public IActionResult GetAll() {
            Module request = new ();
            List<Module>? result = moduleBll.GetList(request);
            return Ok(new { Result = result, Rows = request.Rows });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult Create([FromBody] Module module) {
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out Guid userId);
            module.UserCreated = userId;
            
            moduleBll.Save(module);

            if (module.Code != null) return Ok();
            return BadRequest(module.GetOutput());
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public IActionResult Update([FromBody] Module module) {
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out Guid userId);
            module.UserUpdated = userId;
            
            moduleBll.Update(module);

            if (module.Code != null) return Ok();
            return BadRequest(module.GetOutput());
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{moduleId}")]
        public IActionResult Delete(Guid moduleId) {
            _ = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out Guid userId);
            Module module = new () { UserUpdated = userId, ModuleId = moduleId };
            
            moduleBll.Delete(module);

            if (module.Code != null) return Ok();
            return BadRequest(module.GetOutput());
        }
    }
}