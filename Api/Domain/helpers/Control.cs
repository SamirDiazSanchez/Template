namespace Domain.helpers
{
    public class Control
    {
        public int? Page { get; set; }
        public int? Rows { get; set; }
        public Guid? UserCreated { get; set; }
        public Guid? UserUpdated { get; set; }
        public string? Filter { get; set; }
        public Guid? SessionId { get; set; }
        public bool? IsActive { get; set; }
    }
}