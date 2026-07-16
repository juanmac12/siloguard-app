using SiloGuard.Business.Dtos.Silos;
using SiloGuard.Data.Entities;

namespace SiloGuard.Business.Services;

public interface IUmbralService
{
    /// Umbrales efectivos del silo: los personalizados si existen, o los recomendados.
    Task<(List<Umbral> Items, bool IsCustom)> GetAsync(int userId, int siloId, CancellationToken ct = default);

    /// Reemplaza los 3 umbrales del silo en una transaccion (maestro-detalle).
    Task<List<Umbral>> UpdateAsync(int userId, int siloId, UmbralesUpdateRequest request, CancellationToken ct = default);

    /// Borra los umbrales personalizados -> el silo vuelve a los recomendados.
    Task RestoreAsync(int userId, int siloId, CancellationToken ct = default);
}
