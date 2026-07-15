using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Abstractions;

public interface IDestinatarioRepository
{
    Task<List<Destinatario>> ListAsync(CancellationToken ct = default);
    Task<List<Destinatario>> GetByIdsAsync(IEnumerable<int> ids, CancellationToken ct = default);
    Task<List<LoteDestinatario>> ListSharesByLoteAsync(int loteId, CancellationToken ct = default);
    Task AddSharesAsync(IEnumerable<LoteDestinatario> shares, CancellationToken ct = default);
}
