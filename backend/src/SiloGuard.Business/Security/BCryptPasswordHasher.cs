namespace SiloGuard.Business.Security;

// BCrypt genera y guarda un salt distinto por password dentro del propio hash
// (formato "$2a$<cost>$<salt><hash>") — es la "estrategia equivalente" a hash+salt
// que acepta la rubrica (Parte 1.3), evitando manejar una columna de salt aparte.
public class BCryptPasswordHasher : IPasswordHasher
{
    public string Hash(string password) => BCrypt.Net.BCrypt.HashPassword(password);

    public bool Verify(string password, string hash) => BCrypt.Net.BCrypt.Verify(password, hash);
}
