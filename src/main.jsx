import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CssBaseline from "@mui/material/CssBaseline";
import "dayjs/locale/en-gb";

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#507993",
    },
    secondary: {
      main: "#D4B99E",
      contrastText: "#ffffff",
    },
    success: {
      main: "#7AAC6C",
      contrastText: "#ffffff",
    },
    background: {
      default: "#FFF5F3",
    },
    info: {
      main: "#F2CA50",
    },
    warning: {
      main: "#F29325",
    },
  },
  typography: {
    h3: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
    },
    body1: {
      fontWeight: 400,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
        <CssBaseline />
        <App />
      </LocalizationProvider>
    </ThemeProvider>
  </StrictMode>,
);
