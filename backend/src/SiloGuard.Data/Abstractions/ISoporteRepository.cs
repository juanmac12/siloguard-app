using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Abstractions;

public interface ISoporteRepository
{
    Task<List<Tecnico>> ListTecnicosActivosAsync(CancellationToken ct = default);
    Task<Tecnico?> GetTecnicoAsync(int id, CancellationToken ct = default);
    Task AddConsultaAsync(ConsultaSoporte consulta, CancellationToken ct = default);
    Task<List<ConsultaSoporte>> ListConsultasByUserAsync(int userId, CancellationToken ct = default);
}
