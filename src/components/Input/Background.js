import {
  Button,
  Box,
  Typography,
  Select,
  Input,
  MenuItem,
  TextField,
} from "@mui/material";
import React from "react";
import Column from "../Box/Column";

export default function BackgroundInput({
  title,
  placeholder,
  value,
  onKeyDown,
  sx,
  w,
  h,
  type,
  background,
  rows,
  multiline,
  endAdornment,
  onKeyPress,
  ...props
}) {
  return (
    <Input
      sx={{
        // padding: "17px 16px 15px 16px",
        "& input::placeholder": {
          fontSize: "12px",
          color: "#89929E !important",
          fontWeight: 400,
        },
        "&::before": {
          borderBottom: "none !important",
        },
        "&:after": {
          borderBottom: "none !important",
        },
        borderBottom: "none !important",
        p: "0 5px 0 12px",
        background: background || "#E6E6E6",
        fontSize: "12px",
        width: w,
        height: h || 56,
        borderRadius: "6px",
      }}
      placeholder={placeholder}
      value={value}
      fullWidth
      props="true"
      type={type}
      rows={rows}
      multiline={multiline}
      endAdornment={endAdornment}
      {...props}
    />
  );
}
