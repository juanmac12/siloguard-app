namespace SiloGuard.Api.DTOs.Silos;

public class SiloResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Grain { get; set; } = string.Empty;
    public decimal Tons { get; set; }
    public string Acopio { get; set; } = string.Empty;
    public string Storage { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal LastCo2 { get; set; }
    public decimal LastTemp { get; set; }
    public decimal LastHum { get; set; }
    public DateTime? LastReadingAt { get; set; }
}
