using DataLayer.connections;

namespace BusinessLayer.Logic
{
    public class ModuleBll(string connectionString) : ModuleDal(connectionString)
    {
        
    }
}