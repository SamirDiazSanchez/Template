using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.helpers
{
    public class Output : Control
    {
        public int? Code { get; set; } = null;
        public string? Message { get; set; } = null;
        public Guid? Id { get; set; } = null;
        public Output GetOutput() => new Output
        {
            Code = this.Code,
            Message = this.Message,
            Id = this.Id
        };
    }
}