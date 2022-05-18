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
      red: "#F50909",
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
    light_gray: {
      main: "#E6E6E6",
    },
    dark_gray: {
      main: "#909090",
    },
    white: {
      main: "#ffffff",
    },
    red: { main: "#C14327" },
    orange: { main: "#FF5432" },
    excel: {
      main: "#20744A",
    },
    skyblue: {
      main: "#52809A",
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
      sm: 650,
      md: 900,
      lg: 1280,
      xl: 30000,
    },
  },
});

export default theme;
