using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SiloGuard.Api.DTOs.Alertas;
using SiloGuard.Api.Extensions;
using SiloGuard.Business.Dtos.Alertas;
using SiloGuard.Business.Services;
using SiloGuard.Data.Entities;

namespace SiloGuard.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/alertas")]
public class AlertasController : ControllerBase
{
    private readonly IAlertaService _alertaService;

    public AlertasController(IAlertaService alertaService) => _alertaService = alertaService;

    [HttpGet]
    public async Task<ActionResult<List<AlertaResponse>>> List(
        [FromQuery] string? status, [FromQuery] string? variant, CancellationToken ct)
    {
        var alerts = await _alertaService.ListAsync(User.GetUserId(), status, variant, ct);
        return Ok(alerts.Select(Map).ToList());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AlertaResponse>> Get(int id, CancellationToken ct)
    {
        var alert = await _alertaService.GetAsync(User.GetUserId(), id, ct);
        return Ok(Map(alert));
    }

    [HttpPatch("{id:int}/resolver")]
    public async Task<ActionResult<AlertaResponse>> Resolver(int id, [FromBody] ResolverAlertaRequest request, CancellationToken ct)
    {
        var alert = await _alertaService.ResolverAsync(User.GetUserId(), id, request, ct);
        return Ok(Map(alert));
    }

    private static AlertaResponse Map(Alert a) => new()
    {
        Id = a.Id,
        SiloId = a.SiloId,
        SiloName = a.Silo?.Name ?? string.Empty,
        Sensor = a.Sensor,
        Value = a.Value,
        Unit = a.Unit,
        Threshold = a.Threshold,
        Variant = a.Variant,
        Title = a.Title,
        Description = a.Description,
        Estimate = a.Estimate,
        Action = a.Action,
        Status = a.Status,
        ResolutionNote = a.ResolutionNote,
        ResolutionReason = a.ResolutionReason,
        CreatedAt = a.CreatedAt,
        ResolvedAt = a.ResolvedAt,
    };
}
