namespace SiloGuard.Api.DTOs.Soporte;

public class TecnicoResponse
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Horario { get; set; } = string.Empty;
}

public class ConsultaResponse
{
    public int Id { get; set; }
    public int AlertaId { get; set; }
    public string AlertaTitulo { get; set; } = string.Empty;
    public int TecnicoId { get; set; }
    public string TecnicoNombre { get; set; } = string.Empty;
    public string Mensaje { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
