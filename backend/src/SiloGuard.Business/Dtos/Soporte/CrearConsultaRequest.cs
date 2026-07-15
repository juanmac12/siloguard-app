namespace SiloGuard.Business.Dtos.Soporte;

public class CrearConsultaRequest
{
    // Si no se especifica, se asigna el primer tecnico activo disponible.
    public int? TecnicoId { get; set; }
    public string Mensaje { get; set; } = string.Empty;
}
