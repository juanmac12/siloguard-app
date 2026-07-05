namespace SiloGuard.Data.Entities;

public class Silo
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public string Grain { get; set; } = string.Empty;
    public decimal Tons { get; set; }
    public string Acopio { get; set; } = string.Empty;
    public string Storage { get; set; } = string.Empty;

    // "ok" | "warn" | "critical" — recalculado por SiloService al registrar una lectura nueva.
    public string Status { get; set; } = "ok";

    // Modelo de lectura desnormalizado: evita un join contra SensorReadings para pintar el Dashboard.
    public decimal LastCo2 { get; set; }
    public decimal LastTemp { get; set; }
    public decimal LastHum { get; set; }
    public DateTime? LastReadingAt { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ICollection<SensorReading> Readings { get; set; } = new List<SensorReading>();
    public ICollection<Alert> Alerts { get; set; } = new List<Alert>();
    public ICollection<Lote> Lotes { get; set; } = new List<Lote>();
}
