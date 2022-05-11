import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import { typography } from "../theme/typography";
import { button } from "../theme/components/button";
import { fiiled_input } from "../theme/components/input";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0D1D41",
      white: "#ffffff",
      black: "#000000",
      lightBlack: "#595959",
      gray: "#909090",
      blue: "#665BEB",
    },
    secondary: {
      main: "#ffffff",
    },
    third: {
      main: "#F8C4C6",
    },
    progress_second: {
      main: "#E2E2E2",
    },
    gray: {
      main: "#909090",
    },
    dark_gray: {
      main: "#909090",
    },
    white: {
      main: "#ffffff",
    },
    red: { main: "#C14327" },
    excel: {
      main: "#20744A",
    },
    black: {
      main: "#000000",
    },
    green: {
      main: "#17A214",
    },
    error: {
      main: red.A400,
    },
  },
  typography: typography,
  components: {
    MuiButton: button,
    MuiFilledInput: fiiled_input,
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: "unset",
        },
      },
    },
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 460,
      md: 900,
      lg: 1280,
      xl: 30000,
    },
  },
});

export default theme;
