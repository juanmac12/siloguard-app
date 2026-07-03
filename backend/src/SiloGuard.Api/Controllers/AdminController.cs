using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SiloGuard.Api.DTOs.Admin;
using SiloGuard.Business.Services;
using SiloGuard.Data.Entities;

namespace SiloGuard.Api.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly IUsuarioAdminService _usuarioAdminService;

    public AdminController(IUsuarioAdminService usuarioAdminService) => _usuarioAdminService = usuarioAdminService;

    [HttpGet("usuarios")]
    public async Task<ActionResult<List<UsuarioAdminResponse>>> Usuarios(CancellationToken ct)
    {
        var users = await _usuarioAdminService.ListUsuariosAsync(ct);
        return Ok(users.Select(u => new UsuarioAdminResponse
        {
            Id = u.Id,
            Name = u.Name,
            Email = u.Email,
            FarmName = u.FarmName,
            CreatedAt = u.CreatedAt,
        }).ToList());
    }
}
