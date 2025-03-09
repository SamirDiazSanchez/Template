using DataLayer.connections;
using Domain.models;

namespace BusinessLayer.Logic
{
    public class ProfileBll(string connectionString) : ProfileDal(connectionString)
    {
        public List<Profile> GetAll(Profile request) => GetList(request);
    }
}