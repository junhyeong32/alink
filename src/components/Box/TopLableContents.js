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
import Column from "./Column";
import Row from "./Row";
import { forwardRef } from "react";

export default function TopLabelContents({
  title,
  placeholder,
  children,
  value,
  setValue,
  sx,
  ...props
}) {
  return (
    <Column
      justifyContent="start"
      alignItems="start"
      sx={{
        width: "100%%",
        borderBottom: "1px solid #0D1D41",
        ...sx,
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <Row>{children}</Row>
    </Column>
  );
}
