import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import { typography } from "../theme/typography";
import { container } from "./components/container";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4158D9",
      white: "#ffffff",
      black: "#000000",
      lightBlack: "#595959",
      gray: "#909090",
      blue: "#665BEB",
      weather_gray: "#919191",
      skyblue: "#60B0BE",
      purple: "#635073",
    },
    secondary: {
      main: "#ffffff",
    },
    third: {
      main: "#F8C4C6",
    },
    gray: {
      main: "#C4D2D9",
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
    skyblue: { main: "#60B0BE" },
    error: {
      main: red.A400,
    },
  },
  typography: typography,
  components: container,
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
