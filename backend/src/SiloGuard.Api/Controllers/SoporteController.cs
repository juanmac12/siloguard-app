using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SiloGuard.Api.DTOs.Soporte;
using SiloGuard.Api.Extensions;
using SiloGuard.Business.Dtos.Soporte;
using SiloGuard.Business.Services;
using SiloGuard.Data.Entities;

namespace SiloGuard.Api.Controllers;

// Contacto con tecnico: catalogo de tecnicos + consultas escritas desde una alerta.
[ApiController]
[Authorize]
[Route("api")]
public class SoporteController : ControllerBase
{
    private readonly ISoporteService _soporteService;

    public SoporteController(ISoporteService soporteService) => _soporteService = soporteService;

    [HttpGet("tecnicos")]
    public async Task<ActionResult<List<TecnicoResponse>>> Tecnicos(CancellationToken ct)
    {
        var tecnicos = await _soporteService.ListTecnicosAsync(ct);
        return Ok(tecnicos.Select(t => new TecnicoResponse
        {
            Id = t.Id,
            Nombre = t.Nombre,
            Telefono = t.Telefono,
            Horario = t.Horario,
        }).ToList());
    }

    [HttpPost("alertas/{alertaId:int}/consultas")]
    public async Task<ActionResult<ConsultaResponse>> CrearConsulta(
        int alertaId, [FromBody] CrearConsultaRequest request, CancellationToken ct)
    {
        var consulta = await _soporteService.CrearConsultaAsync(User.GetUserId(), alertaId, request, ct);
        return CreatedAtAction(nameof(MisConsultas), null, Map(consulta));
    }

    [HttpGet("consultas")]
    public async Task<ActionResult<List<ConsultaResponse>>> MisConsultas(CancellationToken ct)
    {
        var consultas = await _soporteService.ListMisConsultasAsync(User.GetUserId(), ct);
        return Ok(consultas.Select(Map).ToList());
    }

    private static ConsultaResponse Map(ConsultaSoporte c) => new()
    {
        Id = c.Id,
        AlertaId = c.AlertaId,
        AlertaTitulo = c.Alerta?.Title ?? string.Empty,
        TecnicoId = c.TecnicoId,
        TecnicoNombre = c.Tecnico?.Nombre ?? string.Empty,
        Mensaje = c.Mensaje,
        Estado = c.Estado,
        CreatedAt = c.CreatedAt,
    };
}
