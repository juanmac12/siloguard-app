using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SiloGuard.Api.DTOs.Lotes;
using SiloGuard.Api.Extensions;
using SiloGuard.Business.Services;
using SiloGuard.Data.Entities;

namespace SiloGuard.Api.Controllers;

[ApiController]
[Authorize]
[Route("api")]
public class LotesController : ControllerBase
{
    private readonly ILoteService _loteService;

    public LotesController(ILoteService loteService)
    {
        _loteService = loteService;
    }

    [HttpGet("lotes")]
    public async Task<ActionResult<List<LoteResponse>>> List(CancellationToken ct)
    {
        var lotes = await _loteService.ListAsync(User.GetUserId(), ct);
        return Ok(lotes.Select(Map).ToList());
    }

    [HttpGet("lotes/{id:int}")]
    public async Task<ActionResult<LoteResponse>> Get(int id, CancellationToken ct)
    {
        var lote = await _loteService.GetAsync(User.GetUserId(), id, ct);
        return Ok(Map(lote));
    }

    // Inicia un lote nuevo en el silo (cabecera del pasaporte). 409 si el silo ya tiene uno activo.
    [HttpPost("silos/{siloId:int}/lotes")]
    public async Task<ActionResult<LoteResponse>> Iniciar(int siloId, CancellationToken ct)
    {
        var lote = await _loteService.IniciarAsync(User.GetUserId(), siloId, ct);
        return CreatedAtAction(nameof(Get), new { id = lote.Id }, Map(lote));
    }

    // Finaliza el lote: computa el pasaporte (score + promedios) sobre las lecturas de la ventana.
    [HttpPost("lotes/{id:int}/finalizar")]
    public async Task<ActionResult<LoteResponse>> Finalizar(int id, CancellationToken ct)
    {
        var lote = await _loteService.FinalizarAsync(User.GetUserId(), id, ct);
        return Ok(Map(lote));
    }

    private static LoteResponse Map(Lote l) => new()
    {
        Id = l.Id,
        Codigo = l.Codigo,
        SiloId = l.SiloId,
        SiloName = l.Silo?.Name ?? string.Empty,
        Name = l.Name,
        Grain = l.Grain,
        Tons = l.Tons,
        StartAt = l.StartAt,
        EndAt = l.EndAt,
        Days = (int)((l.EndAt ?? DateTime.UtcNow) - l.StartAt).TotalDays,
        Status = l.Status,
        Score = l.Score,
        AlertsResolved = l.AlertsResolved,
        AvgCo2 = l.AvgCo2,
        AvgTemp = l.AvgTemp,
        AvgHum = l.AvgHum,
    };
}
