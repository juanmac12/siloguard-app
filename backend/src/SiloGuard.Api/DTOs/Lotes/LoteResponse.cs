namespace SiloGuard.Api.DTOs.Lotes;

public class LoteResponse
{
    public int Id { get; set; }
    public string Codigo { get; set; } = string.Empty;
    public int SiloId { get; set; }
    public string SiloName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Grain { get; set; } = string.Empty;
    public decimal Tons { get; set; }
    public DateTime StartAt { get; set; }
    public DateTime? EndAt { get; set; }
    public int Days { get; set; }
    public string Status { get; set; } = string.Empty;
    public int Score { get; set; }
    public int AlertsResolved { get; set; }
    public decimal AvgCo2 { get; set; }
    public decimal AvgTemp { get; set; }
    public decimal AvgHum { get; set; }
}
