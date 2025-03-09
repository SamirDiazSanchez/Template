using WebApi;

using JwtHandler;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

Settings.SetParameters();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
{
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (string.IsNullOrEmpty(context.Token) && context.Request.Cookies.TryGetValue("accessToken", out var token)) context.Token = token;

            return Task.CompletedTask;
        }
    };

    options.TokenValidationParameters = Handler.AccessValidationParameters();
})
.AddJwtBearer("RefreshToken", options =>
{
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (string.IsNullOrEmpty(context.Token) && context.Request.Cookies.TryGetValue("refreshToken", out var token)) context.Token = token;

            return Task.CompletedTask;
        }
    };
    options.TokenValidationParameters = Handler.RefreshValidationParameters();
});


// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = $"{Settings.ProjectName}_Swagger_Collection",
        Version = "1.0"
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "CorsPolicy",
        policy => policy.WithOrigins(Settings.CorsPolicy)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

var app = builder.Build();

app.UseCors("CorsPolicy");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseAuthorization();

app.MapControllers();

app.Run();
