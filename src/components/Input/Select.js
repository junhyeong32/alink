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

export default function InformationSelectInput({
  title,
  placeholder,
  value,
  setValue,
  menuItems,
  ...props
}) {
  return (
    <Column
      justifyContent="start"
      alignItems="start"
      sx={{
        width: "33%",
        borderBottom: "1px solid #0D1D41",
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <Select
        variant="standard"
        fullWidth
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        sx={{ pl: "12px" }}
      >
        {Object.entries(menuItems).map(([value, data], key) => (
          <MenuItem value={value} key={key}>
            {data}
          </MenuItem>
        ))}
      </Select>
    </Column>
  );
}
