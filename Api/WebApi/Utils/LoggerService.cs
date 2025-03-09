
namespace WebApi.Utils
{
   public class FileLogger : ILogger
    {
        private readonly string _filePath;
        private static object _lock = new object();

        public FileLogger(string filePath)
        {
            _filePath = filePath;
        }

        IDisposable? ILogger.BeginScope<TState>(TState state)
        {
            return null;
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            return true;
        }

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
        {
            if (formatter != null)
            {
                lock (_lock)
                {
                    string? directory = Path.GetDirectoryName(_filePath);
                    if (directory != null && !Directory.Exists(directory)) _ = Directory.CreateDirectory(directory);
                    if (!File.Exists(_filePath)) using (File.Create(_filePath)) { }
                    
                    File.AppendAllText(_filePath, formatter(state, exception) + Environment.NewLine);
                }
            }
        }
    }

    public class FileLoggerProvider(string filePath) : ILoggerProvider
    {
        private readonly string _filePath = filePath;

        public ILogger CreateLogger(string categoryName)
        {
            return new FileLogger(_filePath);
        }

        public void Dispose()
        {
        }
    }

    public static class LoggerService
    {
        private static readonly ILogger _logger;

        static LoggerService()
        {
            var loggerFactory = LoggerFactory.Create(builder =>
            {
                builder.ClearProviders();
                builder.AddConsole();
                builder.AddProvider(new FileLoggerProvider("Logs/log"));
                builder.AddFilter("LoggerService", LogLevel.Information);
            });

            _logger = loggerFactory.CreateLogger("LoggerService");
        }

        public static void LogInformation(string message) => _logger.LogInformation($"[information {DateTime.Now}] {message}");

        public static void LogWarning(string message) => _logger.LogWarning($"[Warning {DateTime.Now}] {message}");

        public static void LogError(string message) => _logger.LogError($"[Error {DateTime.Now}] {message}");

    }
}