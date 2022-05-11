import {
  Container,
  Typography,
  Button,
  Select,
  MenuItem,
  Checkbox,
  Box,
} from "@mui/material";

export default function CustomButton({
  w,
  h,
  borderRadius,
  variant,
  color,
  bgColor,
  action,
  text,
  fs,
}) {
  console.log(action);
  return (
    <Button
      variant={variant}
      color={bgColor}
      sx={{
        borderRadius: borderRadius || "5px",
        width: w,
        height: h,
      }}
      onClick={action}
    >
      <Typography variant={fs} color={color}>
        {text}
      </Typography>
    </Button>
  );
}
