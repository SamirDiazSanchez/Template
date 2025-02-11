
using Domain.helpers;

namespace Domain.models
{
    public class Module : Output
    {
        public Guid? ModuleId { get; set; }
        public string? ModuleName { get; set; }
        public Guid? ProfileId { get; set; }
    }
}