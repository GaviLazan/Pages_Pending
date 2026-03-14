import { useState, useEffect } from "react";
import App from "./App.jsx";
import {
  extendTheme,
  CssVarsProvider,
  useColorScheme,
} from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CssBaseline from "@mui/material/CssBaseline";

const theme = extendTheme({
  colorSchemeSelector: "data-color-scheme",
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none" },
      },
    },
  },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#507993" },
        secondary: { main: "#D4B99E", contrastText: "#ffffff" },
        success: { main: "#7AAC6C", contrastText: "#ffffff" },
        info: { main: "#F2CA50" },
        warning: { main: "#F29325" },
        error: { main: "#c62828" },
        background: { default: "#fffbf5" },
      },
    },
    dark: {
      palette: {
        primary: { main: "#6BAFC9" },
        secondary: { main: "#C4A882", contrastText: "#ffffff" },
        success: { main: "#7ebd70" },
        info: { main: "#FFD966" },
        warning: { main: "#FFB347" },
        error: { main: "#FF6B6B" },
        background: { default: "#1c1c28", paper: "#212130" },
      },
    },
  },
  typography: {
    h3: { fontWeight: 500 },
    button: { fontWeight: 600 },
    body1: { fontWeight: 400 },
  },
});

function ColorSchemeSync({ darkMode }) {
  const { setMode } = useColorScheme();
  useEffect(() => {
    setMode(darkMode ? "dark" : "light");
  }, [darkMode, setMode]);
  return null;
}

export default function Root() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <CssVarsProvider theme={theme}>
      <ColorSchemeSync darkMode={darkMode} />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
        <CssBaseline />
        <App darkMode={darkMode} setDarkMode={setDarkMode} />
      </LocalizationProvider>
    </CssVarsProvider>
  );
}
