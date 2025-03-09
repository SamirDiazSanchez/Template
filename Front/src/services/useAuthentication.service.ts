import { useAxios } from "@hooks/useAxios.hook";
import { Authentication } from "@domain/models/Authentication.model";
import { ResponseApi } from "@domain/models/Response.model";

export const useAuthenticationService = () => {
  const { instance } = useAxios();

  const SignIn = (data: Authentication) => instance.post<Authentication>('authentication', data);

  const LogOut = () => instance.get<ResponseApi<Authentication>>('authentication/logout');

  return {
    SignIn,
    LogOut
  }
}