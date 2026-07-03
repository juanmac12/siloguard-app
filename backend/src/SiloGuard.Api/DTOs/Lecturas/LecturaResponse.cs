namespace SiloGuard.Api.DTOs.Lecturas;

public class LecturaResponse
{
    public DateTime Timestamp { get; set; }
    public decimal Co2 { get; set; }
    public decimal Temp { get; set; }
    public decimal Hum { get; set; }
}
