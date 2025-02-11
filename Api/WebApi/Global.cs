using System.Text.Json;
using JwtHandler;
using JwtHandler.Models;

namespace WebApi
{
    public static class Global
    {
        public static string? ConnectionString { get; set; }
        public static string ProjectName { get; set; } = "WebApiTemplate";

        public static void SetParameters(IConfiguration configuration) {
            string jwt = Encryptor.Crypter.Decrypt(configuration["Jwt"]!);
            JwtSettings settings = JsonSerializer.Deserialize<JwtSettings>(jwt)!;
            Handler.SetSettings(settings);
            
            ConnectionString = Encryptor.Crypter.Decrypt(configuration.GetConnectionString("DefaultConnection")!);
        }
    }
}