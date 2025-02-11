using Domain.models;
using SqlHandlerConnection;

namespace DataLayer.connections
{
    public class ProfileDal (string connectionString) : HandlerConnection<Profile>(connectionString)
    {
        
    }
}