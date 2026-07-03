namespace SiloGuard.Api.DTOs.Perfil;

public class PerfilResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string FarmName { get; set; } = string.Empty;
    public string? FarmLoc { get; set; }
    public decimal? FarmHa { get; set; }
}
