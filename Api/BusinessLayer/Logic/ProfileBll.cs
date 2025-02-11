using DataLayer.connections;
using Domain.models;

namespace BusinessLayer.Logic
{
    public class ProfileBll(string connectionString) : ProfileDal(connectionString)
    {
        public void Create(Profile profile) {
            if (profile.Modules != null ) {
                string moduleIds = string.Join(",", profile.Modules?.Select(m => m.ModuleId)!);
                profile.ModuleIds = moduleIds;
                this.Save(profile);
            }
        }

        public void Edit(Profile profile) {
            if (profile.Modules != null ) {
                string moduleIds = string.Join(",", profile.Modules?.Select(m => m.ModuleId)!);
                profile.ModuleIds = moduleIds;
                this.Update(profile);
            }
        }

        public List<Profile> GetAll(Profile request) {
            (List<Profile> profiles, List<Module> modules) = this.GetList<Module>(request);
            foreach(Profile profile in profiles) {
                List<Module> moduleList = [.. modules.Where(m => m.ProfileId == profile.ProfileId)];
                profile.Modules = moduleList;
            }
            return profiles;
        }
    }
}