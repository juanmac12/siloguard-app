namespace SiloGuard.Api.DTOs.Perfil;

public class PreferenciasResponse
{
    public bool Advertencias { get; set; }
    public bool SilencioNocturno { get; set; }
    public string? SilencioDesde { get; set; }
    public string? SilencioHasta { get; set; }
}
