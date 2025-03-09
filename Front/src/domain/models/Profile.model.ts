import { Route } from "@domain/types/Route.model"

export type Profile = {
  profileId?: string,
  profileName?: string,
  moduleList?: Route[],
  isActive?: boolean,
  modules?: string
}