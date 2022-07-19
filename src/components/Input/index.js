import dynamic from "next/dynamic";
import {
  Button,
  Box,
  Typography,
  Select,
  Input,
  MenuItem,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import Image from "next/image";
import Column from "../Box/Column";
import { forwardRef } from "react";
import Row from "../Box/Row";
import "react-daterange-picker/dist/css/react-calendar.css";

const DateRangePicker = dynamic(() => import("react-daterange-picker"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

export default function UnderLineInput({
  title,
  placeholder,
  value,
  setValue,
  w,
  xs_w,
  ...props
}) {
  return (
    <Box
      sx={{
        width: w,
        borderBottom: "1px solid #0D1D41",
      }}
    >
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
        {...props}
      />
    </Box>
  );
}

export function OutLineInput({
  title,
  placeholder,
  value,
  setValue,
  sx,
  w,
  h,
}) {
  return (
    <Box sx={{ ...sx, width: w }}>
      <TextField
        sx={{
          "& input::placeholder": {
            fontSize: "10px",
            color: "#909090 !important",
            fontWeight: "bold",
            paddingLeft: 0,
          },
        }}
        InputProps={{
          style: {
            height: h || 30,
            borderRadius: 5,
            paddingLeft: 0,
          },
        }}
        variant="outlined"
        fullWidth
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          e.preventDefault();
        }}
        props="true"
      />
    </Box>
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

export function DateInput({
  title,
  placeholder,
  value,
  setValue,
  w,
  textValue,
  ...props
}) {
  const [hide, setHide] = useState(true);
  return (
    <Column
      justifyContent="start"
      alignItems="start"
      sx={{
        width: w || "100%",
        position: "relative",
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <Box
        sx={{
          width: "100%",
          borderBottom: "1px solid #0D1D41",
        }}
      >
        <Input
          sx={{
            "& input::placeholder": {
              fontSize: "10px",
              color: "#909090 !important",
              fontWeight: "bold",
              textAlign: "center",
            },
          }}
          inputProps={{
            style: {
              textAlign: "center",
            },
          }}
          disabled
          fullWidth
          placeholder={"YYYY-MM-DD  ~  YYYY-MM-DD"}
          value={textValue}
          onClick={() => setHide(!hide)}
        />
      </Box>

      <Row
        alignItems={"center"}
        justifyContent={"center"}
        sx={{
          width: "100%",
          top: "52px",
          display: hide ? "none" : "flex",
          position: "absolute",
          background: "#FFFFFF",
          boxShadow:
            "rgb(0 0 0 / 20%) 0px 5px 5px -3px, rgb(0 0 0 / 14%) 0px 8px 10px 1px, rgb(0 0 0 / 12%) 0px 3px 14px 2px;",
        }}
      >
        <DateRangePicker
          singleDateRange
          onSelect={(e) => setValue(e)}
          // value={value}
          locale={"ko"}
        />
      </Row>
    </Column>
  );
}

export function LabelUnderLineInput({
  title,
  placeholder,
  value,
  setValue,
  w,
  sx,
  xs_w,
  ...props
}) {
  return (
    <Column
      justifyContent="start"
      alignItems="start"
      sx={{
        width: w,
        borderBottom: "1px solid #0D1D41",
        ...sx,
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
        props="true"
      />
    </Column>
  );
}

export function LabelOutLineInput({
  title,
  placeholder,
  value,
  setValue,
  w,
  sx,
  xs_w,
  ...props
}) {
  return (
    <Column
      justifyContent="start"
      alignItems="start"
      sx={{
        width: w,
        borderBottom: "1px solid #0D1D41",
        ...sx,
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <TextField
        sx={{
          "& input::placeholder": {
            fontSize: "10px",
            color: "#909090 !important",
            fontWeight: "bold",
            height: 30,
          },

          pl: "12px",
        }}
        inputProps={{
          style: {
            height: 30,
            paddingLeft: "12px",
          },
        }}
        variant="outlined"
        fullWidth
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          e.preventDefault();
        }}
        props="true"
      />

      {/* <Input
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
        props="true"
      /> */}
    </Column>
  );
}
