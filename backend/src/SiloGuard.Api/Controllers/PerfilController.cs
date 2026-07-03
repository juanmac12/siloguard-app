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

    public PerfilController(IPerfilService perfilService) => _perfilService = perfilService;

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
