using SiloGuard.Business.Dtos.Soporte;
using SiloGuard.Business.Exceptions;
using SiloGuard.Business.Sanitization;
using SiloGuard.Data.Abstractions;
using SiloGuard.Data.Entities;

namespace SiloGuard.Business.Services;

public class SoporteService : ISoporteService
{
    private readonly ISoporteRepository _soporte;
    private readonly IAlertaRepository _alertas;
    private readonly IUnitOfWork _uow;
    private readonly IInputSanitizer _sanitizer;

    public SoporteService(ISoporteRepository soporte, IAlertaRepository alertas, IUnitOfWork uow, IInputSanitizer sanitizer)
    {
        _soporte = soporte;
        _alertas = alertas;
        _uow = uow;
        _sanitizer = sanitizer;
    }

    public Task<List<Tecnico>> ListTecnicosAsync(CancellationToken ct = default) =>
        _soporte.ListTecnicosActivosAsync(ct);

    public async Task<ConsultaSoporte> CrearConsultaAsync(int userId, int alertaId, CrearConsultaRequest request, CancellationToken ct = default)
    {
        // Ownership: la alerta debe pertenecer a un silo del usuario.
        var alerta = await _alertas.GetByIdForUserAsync(alertaId, userId, ct)
            ?? throw new NotFoundException("No se encontró la alerta.");

        Tecnico tecnico;
        if (request.TecnicoId.HasValue)
        {
            tecnico = await _soporte.GetTecnicoAsync(request.TecnicoId.Value, ct)
                ?? throw new NotFoundException("No se encontró el técnico.");
            if (!tecnico.Activo)
                throw new ConflictException("El técnico seleccionado no está disponible.");
        }
        else
        {
            var activos = await _soporte.ListTecnicosActivosAsync(ct);
            tecnico = activos.FirstOrDefault()
                ?? throw new ConflictException("No hay técnicos disponibles en este momento.");
        }

        var consulta = new ConsultaSoporte
        {
            AlertaId = alerta.Id,
            TecnicoId = tecnico.Id,
            Tecnico = tecnico,
            UserId = userId,
            Mensaje = _sanitizer.Sanitize(request.Mensaje) ?? string.Empty,
            Estado = "enviada",
            CreatedAt = DateTime.UtcNow,
        };

        await _soporte.AddConsultaAsync(consulta, ct);
        await _uow.SaveChangesAsync(ct);
        return consulta;
    }

    public Task<List<ConsultaSoporte>> ListMisConsultasAsync(int userId, CancellationToken ct = default) =>
        _soporte.ListConsultasByUserAsync(userId, ct);
}
