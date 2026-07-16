using SiloGuard.Business.Dtos.Soporte;
using SiloGuard.Data.Entities;

namespace SiloGuard.Business.Services;

public interface ISoporteService
{
    Task<List<Tecnico>> ListTecnicosAsync(CancellationToken ct = default);
    Task<ConsultaSoporte> CrearConsultaAsync(int userId, int alertaId, CrearConsultaRequest request, CancellationToken ct = default);
    Task<List<ConsultaSoporte>> ListMisConsultasAsync(int userId, CancellationToken ct = default);
}
