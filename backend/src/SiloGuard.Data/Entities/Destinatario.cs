namespace SiloGuard.Data.Entities;

// Banco / acopio / comprador con el que se puede compartir un Pasaporte de Calidad.
// Participa de la relacion N-N Lotes <-> Destinatarios via LoteDestinatario.
public class Destinatario
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;

    // "banco" | "acopio" | "comprador"
    public string Tipo { get; set; } = string.Empty;
    public string? Contacto { get; set; }

    public ICollection<LoteDestinatario> LotesCompartidos { get; set; } = new List<LoteDestinatario>();
}
