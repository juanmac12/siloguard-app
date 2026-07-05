using SiloGuard.Data.Entities;

namespace SiloGuard.Business.Services;

public interface ILoteService
{
    Task<List<Lote>> ListAsync(int userId, CancellationToken ct = default);
    Task<Lote> GetAsync(int userId, int loteId, CancellationToken ct = default);
    Task<Lote> IniciarAsync(int userId, int siloId, CancellationToken ct = default);
    Task<Lote> FinalizarAsync(int userId, int loteId, CancellationToken ct = default);
}
