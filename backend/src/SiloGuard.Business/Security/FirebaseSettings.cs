namespace SiloGuard.Business.Security;

public class FirebaseSettings
{
    // Uso local (dev): ruta a un archivo service-account.json en disco.
    public string CredentialsPath { get; set; } = string.Empty;

    // Uso en hosting sin filesystem persistente (Railway, etc.): el contenido completo
    // del service-account.json pegado en una variable de entorno (Firebase__CredentialsJson).
    // Tiene prioridad sobre CredentialsPath cuando ambos están presentes.
    public string CredentialsJson { get; set; } = string.Empty;

    // Emails que no requieren email_verified en Firebase (p.ej. el usuario seed de la demo,
    // que se crea directo en la base y nunca pasó por el registro con Firebase).
    public string[] VerificationBypassEmails { get; set; } = [];
}
