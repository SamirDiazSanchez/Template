import { Profile } from "./Profile.model"

export type User = {
  userId: string,
  fullName: string,
  email: string,
  profileId: string,
  profileName: string,
  profile: Profile,
  isActive: boolean
}