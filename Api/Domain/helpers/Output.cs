namespace Domain.helpers
{
    public class Output : Control
    {
        public int? Code { get; set; } = null;
        public string? Message { get; set; } = null;
        public Guid? Id { get; set; } = null;
        public Output GetOutput() => new()
        {
            Code = this.Code,
            Message = this.Message,
            Id = this.Id
        };
    }
}