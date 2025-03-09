using DataLayer.connections;
using Domain.models;

namespace BusinessLayer.Logic
{
    public class SessionBll(string connectionString) : SessionDal(connectionString)
    {
        public void Create(Session session) {
            Save(session);
            session.ModuleList = session.Modules?.Split(",").Select(s => s.Trim()).ToList();
        }
    }
}