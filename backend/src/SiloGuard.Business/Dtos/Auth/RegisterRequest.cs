namespace SiloGuard.Business.Dtos.Auth;

public class RegisterRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string FarmName { get; set; } = string.Empty;
    public string? FarmLoc { get; set; }
    public decimal? FarmHa { get; set; }
}
