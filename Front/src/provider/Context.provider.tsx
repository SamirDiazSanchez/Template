"use client";
import { CssBaseline } from "@mui/material";
import { createTheme, PaletteMode, ThemeProvider } from "@mui/material/styles";
import { createContext, useEffect, useMemo, useState } from "react";
import { ColorThemes } from "@utils/ColorThemes";
import { useStorage } from "@hooks/useStorage.hook";
import { LoadingComponent } from "@components/auth/Loading.component";

interface Data {
  data: any;
  themeColor: string;
  mode: PaletteMode,
  setData: (data: any) => void
  setThemeColor: (color: string) => void,
  setMode: (mode: PaletteMode) => void
}

export const Store = createContext<Data | null>(null);

export const ContextProvider = ({ children }) => {
  const [data, setData] = useState({});
  const [themeColor, setThemeColor] = useState<string>('blue');
  const [mode, setMode] = useState<PaletteMode>('light');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {
    get
  } = useStorage();

  useEffect(() => {
    const fetchData = async () => {
      setMode(await get('mode') ?? 'light');
      setThemeColor(await get('color') ?? 'blue');
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }

    fetchData();
  }, []);

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: mode,
        primary: {
          main: ColorThemes[themeColor]['primary']['main'],
          light: ColorThemes[themeColor]['primary']['light'],
          dark: ColorThemes[themeColor]['primary']['dark'],
          contrastText: ColorThemes[themeColor]['primary']['contrastText']
        },
        secondary: {
          main: ColorThemes[themeColor]['secondary']['main'],
          light: ColorThemes[themeColor]['secondary']['light'],
          dark: ColorThemes[themeColor]['secondary']['dark'],
          contrastText: ColorThemes[themeColor]['secondary']['contrastText']
        }
      }
    });
  }, [themeColor, mode]);

  const value = useMemo(() => ({
    data, setData,
    themeColor, setThemeColor,
    mode, setMode
  }), [data, mode, themeColor]);

  return (
    <>
      {
        isLoading && <LoadingComponent />
      }
      {
        !isLoading &&
        <Store.Provider value={value} >
          <ThemeProvider theme={theme}>
            <CssBaseline />
            { children }    
          </ThemeProvider>
        </Store.Provider>
      }
    </>
  )
}