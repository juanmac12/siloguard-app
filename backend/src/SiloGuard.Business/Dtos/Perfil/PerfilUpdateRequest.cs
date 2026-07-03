namespace SiloGuard.Business.Dtos.Perfil;

public class PerfilUpdateRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string FarmName { get; set; } = string.Empty;
    public string? FarmLoc { get; set; }
    public decimal? FarmHa { get; set; }
}
