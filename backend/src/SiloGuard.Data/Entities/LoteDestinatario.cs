namespace SiloGuard.Data.Entities;

// Tabla intermedia de la relacion N-N entre Lotes y Destinatarios: registra con quien
// se compartio cada pasaporte y cuando (segunda N-N del modelo junto a UserRoles).
public class LoteDestinatario
{
    public int LoteId { get; set; }
    public Lote Lote { get; set; } = null!;

    public int DestinatarioId { get; set; }
    public Destinatario Destinatario { get; set; } = null!;

    public DateTime CompartidoAt { get; set; }
}
