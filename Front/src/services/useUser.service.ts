import { ResponseApi, ResponseApiSave } from "@domain/models/Response.model";
import { User } from "@domain/models/User.model";
import { useAxios } from "@hooks/useAxios.hook";

export const useUserService = () => {
  const { instance } = useAxios();

  const getAll = (page: number) => instance.get<ResponseApi<User>>(`user/${page}`);

  const save = (data: User) => instance.post<ResponseApiSave>('user', data);

  const edit = (data: User) => instance.put<ResponseApiSave>('user', data);

  const remove = (userId: string) => instance.delete<ResponseApiSave>(`user/${userId}`);

  return {
    getAll,
    save,
    edit,
    remove
  }
}