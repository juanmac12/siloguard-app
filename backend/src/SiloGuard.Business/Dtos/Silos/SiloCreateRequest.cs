namespace SiloGuard.Business.Dtos.Silos;

public class SiloCreateRequest
{
    public string Name { get; set; } = string.Empty;
    public string Grain { get; set; } = string.Empty;
    public decimal Tons { get; set; }
    public string Acopio { get; set; } = string.Empty;
    public string Storage { get; set; } = string.Empty;

    // Lectura inicial del dispositivo — se inserta junto con el Silo en la misma
    // transaccion (maestro-detalle, rubrica Parte 4). Si un valor esta fuera del
    // rango permitido, el INSERT falla y el Silo tambien se revierte (rollback).
    public decimal InitialTemp { get; set; }
    public decimal InitialHum { get; set; }
    public decimal InitialCo2 { get; set; }
}
