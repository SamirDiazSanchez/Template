using DataLayer.connections;
using Domain.models;

namespace BusinessLayer.Logic
{
    public class ProfileBll(string connectionString) : ProfileDal(connectionString)
    {
        
    }
}