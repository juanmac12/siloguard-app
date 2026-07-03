namespace SiloGuard.Data.Entities;

// Poblada automaticamente desde SiloGuardDbContext.SaveChangesAsync (bonus de auditoria, Parte 1.5 de la rubrica).
public class AuditLog
{
    public int Id { get; set; }
    public string EntityName { get; set; } = string.Empty;
    public string EntityId { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty; // Added | Modified | Deleted
    public int? UserId { get; set; }
    public DateTime Timestamp { get; set; }
    public string? Details { get; set; }
}
