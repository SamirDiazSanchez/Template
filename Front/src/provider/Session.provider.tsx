"use client";
import { Route } from "@domain/types/Route.model";
import { createContext, useEffect, useMemo, useState } from "react";

interface ContextSession {
  modules: Route[],
  userName: string,
  profile: string,
  setModules: (modules: Route[]) => void
  setUserName: (userName: string) => void
  setProfile: (profile: string) => void
}

export const SessionStore = createContext<ContextSession | null>(null);

export const SessionProvider = ({ children }) => {
  const [modules, setModules] = useState<Route[]>([]);
  const [userName, setUserName] = useState<string>();
  const [profile, setProfile] = useState<string>();

  const value = useMemo(() => ({
    modules, setModules,
    userName, setUserName,
    profile, setProfile
  }), [modules, userName, profile]);

  return (
    <SessionStore.Provider value={value} >
      { children }
    </SessionStore.Provider>
  )
}