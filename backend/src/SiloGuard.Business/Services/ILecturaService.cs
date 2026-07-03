using SiloGuard.Business.Dtos.Common;
using SiloGuard.Data.Entities;

namespace SiloGuard.Business.Services;

public interface ILecturaService
{
    Task<PagedResult<SensorReading>> GetPagedAsync(
        int userId, int siloId, string range, int page, int pageSize, CancellationToken ct = default);
}
