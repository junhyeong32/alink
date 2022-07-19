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
import Column from "./Box/Column";
import { forwardRef } from "react";

export default function InformationInput({
  title,
  placeholder,
  value,
  setValue,
  ...props
}) {
  return (
    <Column
      justifyContent="start"
      alignItems="start"
      sx={{
        width: "25%",
        borderBottom: "1px solid #0D1D41",
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <Input
        sx={{
          "& input::placeholder": {
            fontSize: "10px",
            color: "#909090 !important",
            fontWeight: "bold",
          },
          pl: "12px",
        }}
        fullWidth
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          e.preventDefault();
        }}
      />
    </Column>
  );
}

export function InformationSelectInput({
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
        width: "25%",
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

const RenderInput = forwardRef((props, ref) => {
  return (
    <Input
      ref={ref}
      sx={{
        width: "100%",
        // minWidth: 180,
        borderBottom: "1px solid black",
        textAlign: "center !important",
        "& input::placeholder": {
          fontSize: "10px",
          color: "#909090 !important",
          fontWeight: "bold",
          textAlign: "center",
        },
      }}
      type="text"
      inputformat="yyyy-MM-dd"
      inputRef={props.inputRef}
      inputProps={{
        ...props.inputProps,
        placeholder: "YYYY-MM-DD",
        style: { textAlign: "center" },
      }}
      {...props}
      value={props.value}
      onClick={props.onClick}
      onChange={props.onChange}
      onBlur={props.onBlur}
    />
  );
});

RenderInput.displayName = "RenderInput";

export function InformationDateInput({
  title,
  placeholder,
  value,
  setValue,
  ...props
}) {
  return (
    <Column
      justifyContent="start"
      alignItems="start"
      sx={{
        width: "25%",
        ".css-17vdz66": {
          width: "100% !important",
        },
        // borderBottom: "1px solid #0D1D41",
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <RenderInput
        id="date"
        type="date"
        defaultValue="2017-05-24"
        sx={{ width: 220 }}
      />
      {/* <LocalizationProvider  der className="date" dateAdapter={AdapterDateFns}>
        <DateRangePicker
          calendars={2}
          value={value}
          className="date"
          endText={<Image src="/logo.png" width={15} height={15} alt="" />}
          mask=""
          sx={{
            width: "100%",
            ".css-17vdz66": {
              width: "100% !important",
            },
          }}
          inputFormat="yyyy-MM-dd"
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(startProps, endProps) => (
            <React.Fragment>
              <RenderInput
                endText={
                  <Image src="/logo.png" width={15} height={15} alt="" />
                }
                variant="standard"
                {...startProps}
              />
              <RenderInput variant="standard" {...endProps} />
            </React.Fragment>
          )}
        />
      </LocalizationProvider> */}
    </Column>
  );
}
