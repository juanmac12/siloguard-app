using SiloGuard.Business.Dtos.Perfil;
using SiloGuard.Data.Abstractions;
using SiloGuard.Data.Entities;

namespace SiloGuard.Business.Services;

public class PreferenciasService : IPreferenciasService
{
    private readonly IPreferenciasRepository _prefs;
    private readonly IUnitOfWork _uow;

    public PreferenciasService(IPreferenciasRepository prefs, IUnitOfWork uow)
    {
        _prefs = prefs;
        _uow = uow;
    }

    public async Task<PreferenciasNotificacion> GetAsync(int userId, CancellationToken ct = default)
    {
        var existing = await _prefs.GetByUserAsync(userId, ct);
        if (existing is not null) return existing;

        // Primer acceso: se materializan los defaults (advertencias on, sin silencio).
        var created = new PreferenciasNotificacion { UserId = userId, Advertencias = true };
        await _prefs.AddAsync(created, ct);
        await _uow.SaveChangesAsync(ct);
        return created;
    }

    public async Task<PreferenciasNotificacion> UpdateAsync(int userId, PreferenciasUpdateRequest request, CancellationToken ct = default)
    {
        var prefs = await GetAsync(userId, ct);

        prefs.Advertencias = request.Advertencias;
        prefs.SilencioNocturno = request.SilencioNocturno;
        prefs.SilencioDesde = request.SilencioNocturno ? request.SilencioDesde : null;
        prefs.SilencioHasta = request.SilencioNocturno ? request.SilencioHasta : null;

        await _uow.SaveChangesAsync(ct);
        return prefs;
    }
}
