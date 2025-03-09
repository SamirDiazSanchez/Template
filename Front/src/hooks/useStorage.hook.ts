import { useCrypto } from "./useCyrpto.hook";

export const useStorage = (session?: boolean) => {

  const {
    decrypt,
    encrypt
  } = useCrypto();
  const stringify = (value: any): string => JSON.stringify(value);

  const parse = (value: string): any => {
    try {
      return JSON.parse(value);
    }
    catch (ex) {
      return value;
    }
  }

  const set = async (key: string, value: any) => {
    if (typeof value !== "string") value = stringify(value);

    if (session) {
      let _key: string = await encrypt(key) as string;
      let _value: string = await encrypt(value) as string;
      sessionStorage.setItem(_key, _value);
    }
    else localStorage.setItem(key, value);
  }

  const get = async (key: string) => {
    if (key) {
      if (session) {
        let _key: string = await encrypt(key) as string;
        let result: string = await decrypt(sessionStorage.getItem(_key)) as string;
        return parse(result);
      }
      else return parse(localStorage.getItem(key));
    }
  }

  const remove = (key: string) => {
    if (session) sessionStorage.removeItem(key);
    else localStorage.removeItem(key);
  }

  const clear = () => {
    if (session) sessionStorage.clear();
    else localStorage.clear();
  }

  return {
    set,
    get,
    remove,
    clear
  }
}