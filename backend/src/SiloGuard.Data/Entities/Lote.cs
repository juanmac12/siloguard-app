namespace SiloGuard.Data.Entities;

// Un Lote es un ciclo de almacenamiento de grano en un silo (de "iniciar" a "finalizar").
// Al finalizarlo se computa su "pasaporte de calidad" (score + promedios) a partir de las
// lecturas de sensores registradas durante la ventana [StartAt, EndAt].
public class Lote
{
    public int Id { get; set; }

    public int SiloId { get; set; }
    public Silo Silo { get; set; } = null!;

    // Codigo legible del pasaporte, ej. "SG-2026-000A" (se genera al iniciar).
    public string Codigo { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;

    // Snapshot del silo al momento de iniciar (el silo puede cambiar de grano/tonelaje despues).
    public string Grain { get; set; } = string.Empty;
    public decimal Tons { get; set; }

    public DateTime StartAt { get; set; }
    public DateTime? EndAt { get; set; }

    // "monitoring" | "finalized"
    public string Status { get; set; } = "monitoring";

    // Pasaporte: valores del snapshot inicial, recalculados al finalizar sobre las lecturas.
    public int Score { get; set; }
    public int AlertsResolved { get; set; }
    public decimal AvgCo2 { get; set; }
    public decimal AvgTemp { get; set; }
    public decimal AvgHum { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ICollection<LoteDestinatario> Destinatarios { get; set; } = new List<LoteDestinatario>();
}
