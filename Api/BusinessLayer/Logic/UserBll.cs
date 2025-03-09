
using DataLayer.connections;
using Domain.models;

namespace BusinessLayer.Logic
{
    public class UserBll(string connectionString) : UserDal(connectionString)
    {
        public User? GetById(User user) => GetOne(user);

        public User? GetByEmail(User user) => GetOne(user);
    }
}