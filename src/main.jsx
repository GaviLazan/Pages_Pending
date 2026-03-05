import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    primary: {
      main: "#507993",
    },
    secondary: {
      main: "#D4B99E",
    },
    success: {
      main: "#7AAC6C",
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
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
