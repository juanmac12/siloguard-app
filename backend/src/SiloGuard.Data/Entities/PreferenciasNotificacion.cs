namespace SiloGuard.Data.Entities;

// Preferencias de notificaciones por usuario (pantalla Notificaciones del perfil).
// Relacion 1-1 con User (FK unica). Las alertas criticas son siempre obligatorias,
// por eso no hay columna para desactivarlas.
public class PreferenciasNotificacion
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public bool Advertencias { get; set; } = true;
    public bool SilencioNocturno { get; set; }

    // Rango horario "HH:mm" (solo aplica si SilencioNocturno esta activo).
    public string? SilencioDesde { get; set; }
    public string? SilencioHasta { get; set; }

    public DateTime UpdatedAt { get; set; }
}
