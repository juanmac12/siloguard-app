namespace SiloGuard.Data.Entities;

// Consulta escrita enviada a un tecnico desde el detalle de una alerta
// (formulario "fuera de horario" de la pantalla Contactar tecnico).
public class ConsultaSoporte
{
    public int Id { get; set; }

    public int AlertaId { get; set; }
    public Alert Alerta { get; set; } = null!;

    public int TecnicoId { get; set; }
    public Tecnico Tecnico { get; set; } = null!;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public string Mensaje { get; set; } = string.Empty;

    // "enviada" | "respondida"
    public string Estado { get; set; } = "enviada";

    public DateTime CreatedAt { get; set; }
}
