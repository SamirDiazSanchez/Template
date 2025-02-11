using Domain.models;
using SqlHandlerConnection;

namespace DataLayer.connections
{
    public class SessionDal(string connectionString) : HandlerConnection<Session>(connectionString)
    {
    }
}