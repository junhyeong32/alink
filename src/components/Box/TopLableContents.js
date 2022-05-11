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
import Image from "next/image";
import DateRangePicker from "@mui/lab/DateRangePicker";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Column from "./Column";
import Row from "./Row";
import { forwardRef } from "react";

export default function TopLabelContents({
  title,
  placeholder,
  children,
  value,
  setValue,
  ...props
}) {
  return (
    <Column
      justifyContent="start"
      alignItems="start"
      sx={{
        width: "100%%",
        borderBottom: "1px solid #0D1D41",
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <Row>{children}</Row>
    </Column>
  );
}
