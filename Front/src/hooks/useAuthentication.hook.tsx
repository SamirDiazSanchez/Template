import { Authentication } from "@domain/models/Authentication.model";
import { SessionStore } from "@provider/Session.provider";
import { useAuthenticationService } from "@services/useAuthentication.service";
import { useContext, useEffect } from "react";
import { useStorage } from "./useStorage.hook";
import { RouteList } from "@utils/RouteList";

export const useAuthentication = () => {
  const {
    modules, setModules,
    userName, setUserName,
    profile, setProfile
  } = useContext(SessionStore);

  const {
    get,
    set,
    clear
  } = useStorage(true);

  const {
    SignIn,
    LogOut
  } = useAuthenticationService();

  const Authenticate = (authentication: Authentication) => new Promise<boolean>((res, rej) => {
    SignIn(authentication)
      .then(({data}) => {
        const _moduleList = RouteList.filter((module) => data.moduleList.includes(module.name));
        set('userName', data.name);
        setUserName(data.name);
        set('profile', data.profile);
        setProfile(data.profile);
        set('modules', _moduleList);
        setModules(_moduleList);
        set('isAuthenticated', true);
        res(true);
      })
      .catch(ex => rej(ex));
  });

  const SignOut = () => LogOut()
    .then(() => {})
    .catch((ex) => console.error(ex))
    .finally(() => {
      clear();
      setUserName(null);
      setModules([]);
      setProfile(null);
    });

  useEffect(() => {
    const fetchData = async () => {
      setUserName(await get('userName'));
      setModules(await get('modules') ?? []);
      setProfile(await get('profile'));
    }

    fetchData();
  }, [])

  return {
    Authenticate,
    modules,
    SignOut,
    userName,
    profile
  }
}