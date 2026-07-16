namespace SiloGuard.Business.Dtos.Lotes;

public class CompartirLoteRequest
{
    public List<int> DestinatarioIds { get; set; } = new();
}
