using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SiloGuard.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUmbralesPasaporteCompartidoYSoporte : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Destinatarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nombre = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Tipo = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Contacto = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Destinatarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PreferenciasNotificaciones",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    Advertencias = table.Column<bool>(type: "boolean", nullable: false),
                    SilencioNocturno = table.Column<bool>(type: "boolean", nullable: false),
                    SilencioDesde = table.Column<string>(type: "character varying(5)", maxLength: 5, nullable: true),
                    SilencioHasta = table.Column<string>(type: "character varying(5)", maxLength: 5, nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PreferenciasNotificaciones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PreferenciasNotificaciones_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tecnicos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nombre = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Telefono = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Horario = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Activo = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tecnicos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Umbrales",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SiloId = table.Column<int>(type: "integer", nullable: false),
                    Variable = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Warn = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    Crit = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Umbrales", x => x.Id);
                    table.CheckConstraint("CK_Umbral_Warn_Positive", "\"Warn\" > 0");
                    table.CheckConstraint("CK_Umbral_WarnLtCrit", "\"Warn\" < \"Crit\"");
                    table.ForeignKey(
                        name: "FK_Umbrales_Silos_SiloId",
                        column: x => x.SiloId,
                        principalTable: "Silos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LoteDestinatarios",
                columns: table => new
                {
                    LoteId = table.Column<int>(type: "integer", nullable: false),
                    DestinatarioId = table.Column<int>(type: "integer", nullable: false),
                    CompartidoAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoteDestinatarios", x => new { x.LoteId, x.DestinatarioId });
                    table.ForeignKey(
                        name: "FK_LoteDestinatarios_Destinatarios_DestinatarioId",
                        column: x => x.DestinatarioId,
                        principalTable: "Destinatarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LoteDestinatarios_Lotes_LoteId",
                        column: x => x.LoteId,
                        principalTable: "Lotes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ConsultasSoporte",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AlertaId = table.Column<int>(type: "integer", nullable: false),
                    TecnicoId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    Mensaje = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Estado = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConsultasSoporte", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConsultasSoporte_Alerts_AlertaId",
                        column: x => x.AlertaId,
                        principalTable: "Alerts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ConsultasSoporte_Tecnicos_TecnicoId",
                        column: x => x.TecnicoId,
                        principalTable: "Tecnicos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ConsultasSoporte_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ConsultasSoporte_AlertaId",
                table: "ConsultasSoporte",
                column: "AlertaId");

            migrationBuilder.CreateIndex(
                name: "IX_ConsultasSoporte_TecnicoId",
                table: "ConsultasSoporte",
                column: "TecnicoId");

            migrationBuilder.CreateIndex(
                name: "IX_ConsultasSoporte_UserId",
                table: "ConsultasSoporte",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_LoteDestinatarios_DestinatarioId",
                table: "LoteDestinatarios",
                column: "DestinatarioId");

            migrationBuilder.CreateIndex(
                name: "IX_PreferenciasNotificaciones_UserId",
                table: "PreferenciasNotificaciones",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Umbrales_SiloId_Variable",
                table: "Umbrales",
                columns: new[] { "SiloId", "Variable" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ConsultasSoporte");

            migrationBuilder.DropTable(
                name: "LoteDestinatarios");

            migrationBuilder.DropTable(
                name: "PreferenciasNotificaciones");

            migrationBuilder.DropTable(
                name: "Umbrales");

            migrationBuilder.DropTable(
                name: "Tecnicos");

            migrationBuilder.DropTable(
                name: "Destinatarios");
        }
    }
}
