
using DataLayer.connections;
using Domain.models;
using Encryptor;

namespace BusinessLayer.Logic
{
    public class UserBll(string connectionString) : UserDal(connectionString)
    {
        public User? GetByUserNameAndPassword(string userName, string password) {
            string encryptedPassword = Crypter.Encrypt(password);
            return this.GetOne(new { UserName = userName, Password = encryptedPassword });
        }

        public User? GetById(Guid userId) => GetOne(new { UserId = userId });
    }
}