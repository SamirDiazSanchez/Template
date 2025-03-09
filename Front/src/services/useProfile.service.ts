import { Profile } from "@domain/models/Profile.model";
import { ResponseApi, ResponseApiSave } from "@domain/models/Response.model";
import { useAxios } from "@hooks/useAxios.hook"

export const useProfileService = () => {
  const { instance } = useAxios();

  const getAll = (page: number) => instance.get<ResponseApi<Profile>>(`profile?page=${page}`);

  const getList = () => instance.get<Profile[]>('profile/list');

  const save = (data: Profile) => instance.post<ResponseApiSave>('profile', data);

  const edit = (data: Profile) => instance.put<ResponseApiSave>('profile', data);

  const remove = (profileId: string) => instance.delete<ResponseApiSave>(`profile/${profileId}`);

  return {
    getAll,
    save,
    edit,
    getList,
    remove
  }
}