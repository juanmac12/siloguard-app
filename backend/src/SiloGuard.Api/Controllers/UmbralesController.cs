using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SiloGuard.Api.DTOs.Silos;
using SiloGuard.Api.Extensions;
using SiloGuard.Business.Dtos.Silos;
using SiloGuard.Business.Services;
using SiloGuard.Data.Entities;

namespace SiloGuard.Api.Controllers;

// ABM cabecera-detalle: el maestro es el Silo, el detalle son sus 3 umbrales
// (uno por variable). PUT reemplaza el detalle completo en una transaccion;
// DELETE restaura los valores recomendados (borra la personalizacion).
[ApiController]
[Authorize]
[Route("api/silos/{siloId:int}/umbrales")]
public class UmbralesController : ControllerBase
{
    private readonly IUmbralService _umbralService;

    public UmbralesController(IUmbralService umbralService) => _umbralService = umbralService;

    [HttpGet]
    public async Task<ActionResult<UmbralesResponse>> Get(int siloId, CancellationToken ct)
    {
        var (items, isCustom) = await _umbralService.GetAsync(User.GetUserId(), siloId, ct);
        return Ok(Map(siloId, items, isCustom));
    }

    [HttpPut]
    public async Task<ActionResult<UmbralesResponse>> Update(
        int siloId, [FromBody] UmbralesUpdateRequest request, CancellationToken ct)
    {
        var items = await _umbralService.UpdateAsync(User.GetUserId(), siloId, request, ct);
        return Ok(Map(siloId, items, isCustom: true));
    }

    // Restaurar valores recomendados = eliminar el detalle personalizado.
    [HttpDelete]
    public async Task<IActionResult> Restore(int siloId, CancellationToken ct)
    {
        await _umbralService.RestoreAsync(User.GetUserId(), siloId, ct);
        return NoContent();
    }

    private static UmbralesResponse Map(int siloId, List<Umbral> items, bool isCustom) => new()
    {
        SiloId = siloId,
        IsCustom = isCustom,
        Items = items.Select(u => new UmbralItemResponse
        {
            Variable = u.Variable,
            Warn = u.Warn,
            Crit = u.Crit,
        }).ToList(),
    };
}
