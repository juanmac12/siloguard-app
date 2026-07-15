namespace SiloGuard.Data.Entities;

// Umbral de alerta configurable por silo y por variable (temp | hum | co2).
// Detalle del maestro Silo: se guardan 3 filas por silo (una por variable) y se
// reemplazan en bloque dentro de una transaccion (ABM cabecera-detalle, Parte 4.2).
public class Umbral
{
    public int Id { get; set; }

    public int SiloId { get; set; }
    public Silo Silo { get; set; } = null!;

    // "temp" | "hum" | "co2"
    public string Variable { get; set; } = string.Empty;

    // Valor a partir del cual el estado pasa a "warn" / "critical".
    public decimal Warn { get; set; }
    public decimal Crit { get; set; }

    public DateTime UpdatedAt { get; set; }
}
