# Build de la API SiloGuard (SiloGuard.Api + sus referencias a Business y Data).
# Contexto de build: backend/ (ej. Railway con "Root Directory" = backend).

# ---- Etapa 1: build ----
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copiar solo los .csproj primero para cachear el restore en capas separadas.
COPY src/SiloGuard.Api/SiloGuard.Api.csproj src/SiloGuard.Api/
COPY src/SiloGuard.Business/SiloGuard.Business.csproj src/SiloGuard.Business/
COPY src/SiloGuard.Data/SiloGuard.Data.csproj src/SiloGuard.Data/
RUN dotnet restore src/SiloGuard.Api/SiloGuard.Api.csproj

# Ahora sí el resto del código y publish.
COPY src/ src/
RUN dotnet publish src/SiloGuard.Api/SiloGuard.Api.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

# ---- Etapa 2: runtime ----
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "SiloGuard.Api.dll"]
