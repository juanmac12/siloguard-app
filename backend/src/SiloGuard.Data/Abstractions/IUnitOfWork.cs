namespace SiloGuard.Data.Abstractions;

// Interfaces de repositorio + unit of work: viven en SiloGuard.Data (junto a sus
// implementaciones concretas) para que SiloGuard.Business pueda consumirlas via la
// referencia de proyecto que ya tiene a Data, sin que Data dependa de Business
// (evita la referencia circular). Business nunca importa Microsoft.EntityFrameworkCore
// ni ve el DbContext directamente: solo conoce estas abstracciones.
public interface IUnitOfWork
{
    Task SaveChangesAsync(CancellationToken ct = default);
    Task BeginTransactionAsync(CancellationToken ct = default);
    Task CommitAsync(CancellationToken ct = default);
    Task RollbackAsync(CancellationToken ct = default);
}
