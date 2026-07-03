namespace SiloGuard.Business.Dtos.Silos;

public class SiloUpdateRequest
{
    public string Name { get; set; } = string.Empty;
    public string Grain { get; set; } = string.Empty;
    public decimal Tons { get; set; }
    public string Acopio { get; set; } = string.Empty;
    public string Storage { get; set; } = string.Empty;
}
