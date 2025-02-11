using Domain.helpers;

namespace Domain.models
{
    public class Session : Output
    {
        public Guid? SessionId { get; set; }
        public Guid? UserId { get; set; }
        public DateTime? Created { get; set; }
    }
}