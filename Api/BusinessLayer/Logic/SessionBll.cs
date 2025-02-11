using DataLayer.connections;

namespace BusinessLayer.Logic
{
    public class SessionBll(string connectionString) : SessionDal(connectionString)
    {
    }
}