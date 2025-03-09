using System.ComponentModel.DataAnnotations;
using Domain.helpers;

namespace Domain.models
{
    public class User : Output
    {
        public Guid? UserId { get; set; }
        [RegularExpression(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", ErrorMessage = "Invalid character")]
        public string? Email { get; set; }
        [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "Invalid character")]
        public string? FullName { get; set; }
        [RegularExpression(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", ErrorMessage = "Invalid character")]
        public string? UserName { get; set; }
        public Guid? ProfileId { get; set; }
        public string? ProfileName { get; set; }
        public string? Password { get; set; }
    }
}