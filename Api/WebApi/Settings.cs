using System.Text.Json;
using JwtHandler;
using JwtHandler.Models;

namespace WebApi
{
    public static class Settings
    {
        public static string? ConnectionString { get; set; }
        public static string ProjectName { get; set; } = "Api_Template";
        public static string[] CorsPolicy { get; set; } = [];

        public static string? GoogleClientId { get; set; }

        public static void SetParameters() {
            string? environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{environment}.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();

            string smtpUser = Encryptor.Crypter.Decrypt(configuration["Smtp:user"]!);
            string password = Encryptor.Crypter.Decrypt(configuration["Smtp:password"]!);
            string domain = configuration["Smtp:domain"]!;
            string addressFrom = configuration["Smtp:addressFrom"]!;

            GoogleClientId = configuration["Google:ClientId"];
            
            SendMailHandler.Handler.Setconfiguration(
                smtpUser,
                password,
                domain,
                addressFrom
            );
            
            ProjectName = configuration["ProjectName"] ?? "Api_Template";
            CorsPolicy = configuration.GetSection("CorsPolicy").Get<string[]>()!;
            string encryptedConnectionString = configuration.GetConnectionString("DefaultConnection")!;
            string enctyptedJwt = configuration["Jwt"]!;
            string jwt = Encryptor.Crypter.Decrypt(enctyptedJwt);
            JwtSettings settings = JsonSerializer.Deserialize<JwtSettings>(jwt)!;
            Handler.SetSettings(settings);
            
            ConnectionString = Encryptor.Crypter.Decrypt(encryptedConnectionString);
        }
    }
}