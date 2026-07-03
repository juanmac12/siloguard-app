namespace SiloGuard.Api.DTOs.Admin;

public class UsuarioAdminResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FarmName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
