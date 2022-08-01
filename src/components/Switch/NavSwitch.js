import {
  Container,
  Typography,
  Select,
  MenuItem,
  Checkbox,
  Box,
  Switch,
} from "@mui/material";
import { styled } from "@mui/system";
import Row from "../Box/Row";

// TODO
// on off 텍스트 넣기

const NavSwitch = styled((props) => (
  <Row sx={{ position: "relative" }}>
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
    <Typography
      sx={{ position: "absolute", left: "42px", top: "1px", zIndex: 1 }}
      color={props.checked ? "primary.white" : "primary.gray"}
      variant="h5"
    >
      {props.checked ? "ON" : "OFF"}
    </Typography>
  </Row>
))(({ theme, checked }) => ({
  width: 49,
  height: 20,
  padding: 0,
  borderRadius: "15px",
  position: "relative",
  "& .MuiSwitch-switchBase": {
    width: 10,
    height: 7,
    padding: 0,
    margin: 6,
    color: checked ? "#FFFFFF" : "#909090",
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#FFFFFF",
      right: "1px",
      "& + .MuiSwitch-track": {
        backgroundColor: "#0D1D41",
        border: "1px solid white",
        opacity: 1,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#F8C4C6",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: "white",
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 15,
    height: 15,
  },
  "& .MuiSwitch-track": {
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

export default NavSwitch;
