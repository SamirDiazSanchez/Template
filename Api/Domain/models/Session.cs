using System.ComponentModel.DataAnnotations;
using Domain.helpers;

namespace Domain.models
{
    public class Session : Output
    {
        [RegularExpression(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", ErrorMessage = "Invalid character")]
        public string? Email { get; set; }
        public string? ProfileName { get; set; }
        public Guid? UserId { get; set; }
        public DateTime? Created { get; set; }
        public string? FullName { get; set; }
        public string? Modules { get; set; }
        public List<string>? ModuleList { get; set; }
    }
}