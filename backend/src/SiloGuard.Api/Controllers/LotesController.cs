using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SiloGuard.Api.DTOs.Lotes;
using SiloGuard.Api.Extensions;
using SiloGuard.Business.Dtos.Lotes;
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

    // Catalogo de bancos/acopios/compradores con los que se puede compartir un pasaporte.
    [HttpGet("destinatarios")]
    public async Task<ActionResult<List<DestinatarioResponse>>> Destinatarios(CancellationToken ct)
    {
        var destinatarios = await _loteService.ListDestinatariosCatalogoAsync(ct);
        return Ok(destinatarios.Select(d => new DestinatarioResponse
        {
            Id = d.Id,
            Nombre = d.Nombre,
            Tipo = d.Tipo,
            Contacto = d.Contacto,
        }).ToList());
    }

    // Con quien ya se compartio este pasaporte.
    [HttpGet("lotes/{id:int}/destinatarios")]
    public async Task<ActionResult<List<LoteCompartidoResponse>>> DestinatariosDeLote(int id, CancellationToken ct)
    {
        var shares = await _loteService.ListDestinatariosDeLoteAsync(User.GetUserId(), id, ct);
        return Ok(shares.Select(MapShare).ToList());
    }

    // Comparte el pasaporte con uno o mas destinatarios (alta N-N transaccional, idempotente).
    [HttpPost("lotes/{id:int}/compartir")]
    public async Task<ActionResult<List<LoteCompartidoResponse>>> Compartir(
        int id, [FromBody] CompartirLoteRequest request, CancellationToken ct)
    {
        var shares = await _loteService.CompartirAsync(User.GetUserId(), id, request, ct);
        return Ok(shares.Select(MapShare).ToList());
    }

    private static LoteCompartidoResponse MapShare(LoteDestinatario ld) => new()
    {
        DestinatarioId = ld.DestinatarioId,
        Nombre = ld.Destinatario?.Nombre ?? string.Empty,
        Tipo = ld.Destinatario?.Tipo ?? string.Empty,
        CompartidoAt = ld.CompartidoAt,
    };

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
