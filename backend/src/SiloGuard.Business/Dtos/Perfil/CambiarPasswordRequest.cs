namespace SiloGuard.Business.Dtos.Perfil;

public class CambiarPasswordRequest
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
