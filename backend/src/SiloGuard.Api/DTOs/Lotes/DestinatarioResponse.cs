namespace SiloGuard.Api.DTOs.Lotes;

public class DestinatarioResponse
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public string? Contacto { get; set; }
}

public class LoteCompartidoResponse
{
    public int DestinatarioId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public DateTime CompartidoAt { get; set; }
}
