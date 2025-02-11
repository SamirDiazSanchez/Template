
using System.ComponentModel.DataAnnotations;
using Domain.helpers;

namespace Domain.models
{
    public class Profile : Output
    {
        public Guid? ProfileId { get; set; }
        [RegularExpression(@"^[a-zA-Z0-9\s.-]+$", ErrorMessage = "Invalid character")]
        public string? ProfileName { get; set; }
        public List<Module>? Modules { get; set; }
        public string? ModuleIds { get; set; }
        public bool? IsActive { get; set; }
    }
}