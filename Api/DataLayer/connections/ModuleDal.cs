using Domain.models;
using SqlHandlerConnection;

namespace DataLayer.connections
{
    public class ModuleDal(string connectionString) : HandlerConnection<Module>(connectionString)
    {
        public List<Module>? GetByUserId(Guid userId) => GetList(new { UserId = userId }); 
    }
}