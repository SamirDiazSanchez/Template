using Domain.models;
using SqlHandlerConnection;

namespace DataLayer.connections
{
    public class UserDal (string connectionString) : HandlerConnection<User>(connectionString)
    {
        
    }
}