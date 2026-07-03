using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SiloGuard.Api.DTOs.Common;
using SiloGuard.Api.DTOs.Lecturas;
using SiloGuard.Api.DTOs.Silos;
using SiloGuard.Api.Extensions;
using SiloGuard.Business.Dtos.Silos;
using SiloGuard.Business.Services;
using SiloGuard.Data.Entities;

namespace SiloGuard.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/silos")]
public class SilosController : ControllerBase
{
    private readonly ISiloService _siloService;
    private readonly ILecturaService _lecturaService;

    public SilosController(ISiloService siloService, ILecturaService lecturaService)
    {
        _siloService = siloService;
        _lecturaService = lecturaService;
    }

    [HttpGet]
    public async Task<ActionResult<List<SiloResponse>>> List(CancellationToken ct)
    {
        var silos = await _siloService.ListAsync(User.GetUserId(), ct);
        return Ok(silos.Select(Map).ToList());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<SiloResponse>> Get(int id, CancellationToken ct)
    {
        var silo = await _siloService.GetAsync(User.GetUserId(), id, ct);
        return Ok(Map(silo));
    }

    [HttpPost]
    public async Task<ActionResult<SiloResponse>> Create([FromBody] SiloCreateRequest request, CancellationToken ct)
    {
        var silo = await _siloService.CreateAsync(User.GetUserId(), request, ct);
        return CreatedAtAction(nameof(Get), new { id = silo.Id }, Map(silo));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<SiloResponse>> Update(int id, [FromBody] SiloUpdateRequest request, CancellationToken ct)
    {
        var silo = await _siloService.UpdateAsync(User.GetUserId(), id, request, ct);
        return Ok(Map(silo));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await _siloService.DeleteAsync(User.GetUserId(), id, ct);
        return NoContent();
    }

    [HttpGet("{id:int}/lecturas")]
    public async Task<ActionResult<PagedResponse<LecturaResponse>>> Lecturas(
        int id, [FromQuery] string range = "24h", [FromQuery] int page = 1, [FromQuery] int pageSize = 50, CancellationToken ct = default)
    {
        var result = await _lecturaService.GetPagedAsync(User.GetUserId(), id, range, page, pageSize, ct);
        return Ok(new PagedResponse<LecturaResponse>
        {
            Items = result.Items.Select(r => new LecturaResponse
            {
                Timestamp = r.Timestamp,
                Co2 = r.Co2,
                Temp = r.Temp,
                Hum = r.Hum,
            }).ToList(),
            Page = result.Page,
            PageSize = result.PageSize,
            TotalCount = result.TotalCount,
            TotalPages = result.TotalPages,
        });
    }

    private static SiloResponse Map(Silo s) => new()
    {
        Id = s.Id,
        Name = s.Name,
        Grain = s.Grain,
        Tons = s.Tons,
        Acopio = s.Acopio,
        Storage = s.Storage,
        Status = s.Status,
        LastCo2 = s.LastCo2,
        LastTemp = s.LastTemp,
        LastHum = s.LastHum,
        LastReadingAt = s.LastReadingAt,
    };
}
