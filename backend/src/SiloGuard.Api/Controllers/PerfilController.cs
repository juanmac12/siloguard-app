using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SiloGuard.Api.DTOs.Perfil;
using SiloGuard.Api.Extensions;
using SiloGuard.Business.Dtos.Perfil;
using SiloGuard.Business.Services;
using SiloGuard.Data.Entities;

namespace SiloGuard.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/perfil")]
public class PerfilController : ControllerBase
{
    private readonly IPerfilService _perfilService;
    private readonly IPreferenciasService _preferenciasService;

    public PerfilController(IPerfilService perfilService, IPreferenciasService preferenciasService)
    {
        _perfilService = perfilService;
        _preferenciasService = preferenciasService;
    }

    [HttpGet]
    public async Task<ActionResult<PerfilResponse>> Get(CancellationToken ct)
    {
        var user = await _perfilService.GetAsync(User.GetUserId(), ct);
        return Ok(Map(user));
    }

    [HttpPut]
    public async Task<ActionResult<PerfilResponse>> Update([FromBody] PerfilUpdateRequest request, CancellationToken ct)
    {
        var user = await _perfilService.UpdateAsync(User.GetUserId(), request, ct);
        return Ok(Map(user));
    }

    [HttpPut("password")]
    public async Task<IActionResult> CambiarPassword([FromBody] CambiarPasswordRequest request, CancellationToken ct)
    {
        await _perfilService.CambiarPasswordAsync(User.GetUserId(), request, ct);
        return NoContent();
    }

    [HttpGet("notificaciones")]
    public async Task<ActionResult<PreferenciasResponse>> Preferencias(CancellationToken ct)
    {
        var prefs = await _preferenciasService.GetAsync(User.GetUserId(), ct);
        return Ok(MapPrefs(prefs));
    }

    [HttpPut("notificaciones")]
    public async Task<ActionResult<PreferenciasResponse>> UpdatePreferencias(
        [FromBody] PreferenciasUpdateRequest request, CancellationToken ct)
    {
        var prefs = await _preferenciasService.UpdateAsync(User.GetUserId(), request, ct);
        return Ok(MapPrefs(prefs));
    }

    private static PreferenciasResponse MapPrefs(PreferenciasNotificacion p) => new()
    {
        Advertencias = p.Advertencias,
        SilencioNocturno = p.SilencioNocturno,
        SilencioDesde = p.SilencioDesde,
        SilencioHasta = p.SilencioHasta,
    };

    private static PerfilResponse Map(User u) => new()
    {
        Id = u.Id,
        Name = u.Name,
        Email = u.Email,
        Phone = u.Phone,
        FarmName = u.FarmName,
        FarmLoc = u.FarmLoc,
        FarmHa = u.FarmHa,
    };
}
