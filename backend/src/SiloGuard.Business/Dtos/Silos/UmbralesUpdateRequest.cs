namespace SiloGuard.Business.Dtos.Silos;

public class UmbralesUpdateRequest
{
    public List<UmbralItem> Items { get; set; } = new();
}

public class UmbralItem
{
    // "temp" | "hum" | "co2"
    public string Variable { get; set; } = string.Empty;
    public decimal Warn { get; set; }
    public decimal Crit { get; set; }
}
