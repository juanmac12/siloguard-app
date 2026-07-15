namespace SiloGuard.Api.DTOs.Silos;

public class UmbralesResponse
{
    public int SiloId { get; set; }

    // false = el silo usa los valores recomendados (sin personalizacion guardada).
    public bool IsCustom { get; set; }
    public List<UmbralItemResponse> Items { get; set; } = new();
}

public class UmbralItemResponse
{
    public string Variable { get; set; } = string.Empty;
    public decimal Warn { get; set; }
    public decimal Crit { get; set; }
}
