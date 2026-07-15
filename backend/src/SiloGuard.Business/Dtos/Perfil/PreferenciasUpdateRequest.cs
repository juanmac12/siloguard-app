namespace SiloGuard.Business.Dtos.Perfil;

public class PreferenciasUpdateRequest
{
    public bool Advertencias { get; set; } = true;
    public bool SilencioNocturno { get; set; }
    public string? SilencioDesde { get; set; }
    public string? SilencioHasta { get; set; }
}
