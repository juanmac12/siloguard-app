using SiloGuard.Business.Dtos.Alertas;
using SiloGuard.Business.Exceptions;
using SiloGuard.Business.Sanitization;
using SiloGuard.Data.Abstractions;
using SiloGuard.Data.Entities;

namespace SiloGuard.Business.Services;

public class AlertaService : IAlertaService
{
    private readonly IAlertaRepository _alertas;
    private readonly IUnitOfWork _uow;
    private readonly IInputSanitizer _sanitizer;

    public AlertaService(IAlertaRepository alertas, IUnitOfWork uow, IInputSanitizer sanitizer)
    {
        _alertas = alertas;
        _uow = uow;
        _sanitizer = sanitizer;
    }

    public Task<List<Alert>> ListAsync(int userId, string? status, string? variant, CancellationToken ct = default) =>
        _alertas.ListByUserAsync(userId, status, variant, ct);

    public async Task<Alert> GetAsync(int userId, int alertId, CancellationToken ct = default) =>
        await _alertas.GetByIdForUserAsync(alertId, userId, ct)
            ?? throw new NotFoundException("No se encontró la alerta.");

    public async Task<Alert> ResolverAsync(int userId, int alertId, ResolverAlertaRequest request, CancellationToken ct = default)
    {
        var alert = await _alertas.GetByIdForUserAsync(alertId, userId, ct)
            ?? throw new NotFoundException("No se encontró la alerta.");

        if (alert.Status == "resolved")
            throw new ConflictException("Esta alerta ya fue resuelta.");

        alert.Status = "resolved";
        alert.Variant = "resolved";
        alert.ResolutionNote = _sanitizer.Sanitize(request.ResolutionNote) ?? "Resuelta.";
        alert.ResolutionReason = _sanitizer.Sanitize(request.ResolutionReason);
        alert.ResolvedAt = DateTime.UtcNow;

        await _uow.SaveChangesAsync(ct);
        return alert;
    }
}
