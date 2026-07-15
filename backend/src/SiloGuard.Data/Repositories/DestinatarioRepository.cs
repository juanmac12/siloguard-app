using Microsoft.EntityFrameworkCore;
using SiloGuard.Data.Abstractions;
using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Repositories;

public class DestinatarioRepository : IDestinatarioRepository
{
    private readonly SiloGuardDbContext _db;

    public DestinatarioRepository(SiloGuardDbContext db) => _db = db;

    public Task<List<Destinatario>> ListAsync(CancellationToken ct = default) =>
        _db.Destinatarios.OrderBy(d => d.Nombre).ToListAsync(ct);

    public Task<List<Destinatario>> GetByIdsAsync(IEnumerable<int> ids, CancellationToken ct = default) =>
        _db.Destinatarios.Where(d => ids.Contains(d.Id)).ToListAsync(ct);

    public Task<List<LoteDestinatario>> ListSharesByLoteAsync(int loteId, CancellationToken ct = default) =>
        _db.LoteDestinatarios
            .Include(ld => ld.Destinatario)
            .Where(ld => ld.LoteId == loteId)
            .OrderByDescending(ld => ld.CompartidoAt)
            .ToListAsync(ct);

    public async Task AddSharesAsync(IEnumerable<LoteDestinatario> shares, CancellationToken ct = default) =>
        await _db.LoteDestinatarios.AddRangeAsync(shares, ct);
}
