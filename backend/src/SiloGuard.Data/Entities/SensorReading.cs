namespace SiloGuard.Data.Entities;

public class SensorReading
{
    public int Id { get; set; }

    public int SiloId { get; set; }
    public Silo Silo { get; set; } = null!;

    public DateTime Timestamp { get; set; }
    public decimal Co2 { get; set; }
    public decimal Temp { get; set; }
    public decimal Hum { get; set; }
}
