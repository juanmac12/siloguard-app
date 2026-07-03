namespace SiloGuard.Data.Entities;

public class Alert
{
    public int Id { get; set; }

    public int SiloId { get; set; }
    public Silo Silo { get; set; } = null!;

    // "temp" | "humidity" | "co2"
    public string Sensor { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public string Threshold { get; set; } = string.Empty;

    // "critical" | "warning" | "resolved"
    public string Variant { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Estimate { get; set; }
    public string? Action { get; set; }

    // "active" | "resolved"
    public string Status { get; set; } = "active";
    public string? ResolutionNote { get; set; }
    public string? ResolutionReason { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
}
