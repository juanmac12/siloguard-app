namespace SiloGuard.Data.Entities;

// Tecnico/agronomo de contacto para alertas (pantalla "Contactar tecnico").
public class Tecnico
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Horario { get; set; } = string.Empty;
    public bool Activo { get; set; } = true;

    public ICollection<ConsultaSoporte> Consultas { get; set; } = new List<ConsultaSoporte>();
}
