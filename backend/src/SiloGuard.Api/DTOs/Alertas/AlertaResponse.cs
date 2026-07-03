namespace SiloGuard.Api.DTOs.Alertas;

public class AlertaResponse
{
    public int Id { get; set; }
    public int SiloId { get; set; }
    public string SiloName { get; set; } = string.Empty;
    public string Sensor { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public string Threshold { get; set; } = string.Empty;
    public string Variant { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Estimate { get; set; }
    public string? Action { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? ResolutionNote { get; set; }
    public string? ResolutionReason { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
}
