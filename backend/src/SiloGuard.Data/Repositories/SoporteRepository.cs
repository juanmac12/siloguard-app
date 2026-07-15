using Microsoft.EntityFrameworkCore;
using SiloGuard.Data.Abstractions;
using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Repositories;

public class SoporteRepository : ISoporteRepository
{
    private readonly SiloGuardDbContext _db;

    public SoporteRepository(SiloGuardDbContext db) => _db = db;

    public Task<List<Tecnico>> ListTecnicosActivosAsync(CancellationToken ct = default) =>
        _db.Tecnicos.Where(t => t.Activo).OrderBy(t => t.Nombre).ToListAsync(ct);

    public Task<Tecnico?> GetTecnicoAsync(int id, CancellationToken ct = default) =>
        _db.Tecnicos.FirstOrDefaultAsync(t => t.Id == id, ct);

    public async Task AddConsultaAsync(ConsultaSoporte consulta, CancellationToken ct = default) =>
        await _db.ConsultasSoporte.AddAsync(consulta, ct);

    public Task<List<ConsultaSoporte>> ListConsultasByUserAsync(int userId, CancellationToken ct = default) =>
        _db.ConsultasSoporte
            .Include(c => c.Tecnico)
            .Include(c => c.Alerta)
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync(ct);
}
