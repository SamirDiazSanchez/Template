"use client";
import { useContext } from "react";
import { Store } from "../provider/Context.provider";
import { PaletteMode } from "@mui/material";

export const useContextProvider = () => {
  const {
    data, setData,
    themeColor, setThemeColor,
    mode, setMode
  } = useContext(Store);

  const get = (key: string) => data[key];

  const set = (key: string, value: any) => setData({ ...data, [key]: value });

  const changeColor = (color: string) => setThemeColor(color ?? 'blue');

  const remove = (key: string) => {
    const { [key]: _, ...newData } = data;
    setData(newData);
  }

  const changeMode = (mode: PaletteMode) => setMode(mode);

  const clear = () => setData({});

  return {
    get,
    set,
    remove,
    clear,
    changeColor,
    changeMode,
    themeColor,
    mode
  }
}