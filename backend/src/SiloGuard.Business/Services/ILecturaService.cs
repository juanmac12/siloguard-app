using SiloGuard.Business.Dtos.Common;
using SiloGuard.Business.Dtos.Lecturas;
using SiloGuard.Data.Entities;

namespace SiloGuard.Business.Services;

public interface ILecturaService
{
    Task<PagedResult<SensorReading>> GetPagedAsync(
        int userId, int siloId, string range, int page, int pageSize, CancellationToken ct = default);

    Task<SensorReading> AddAsync(
        int userId, int siloId, LecturaCreateRequest request, CancellationToken ct = default);
}
