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
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { useEffect } from "react";
import moment from "moment";

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
          setValue && setValue(e.target.value);
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
  ...props
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
            height: !props?.multiline && (h || 30),
            borderRadius: 5,
          },
        }}
        variant="outlined"
        fullWidth
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          if (setValue) {
            setValue(e.target.value);
          }

          e.preventDefault();
        }}
        {...props}
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
  startValue,
  endValue,
  setValue,
  w,
  textValue,
  ...props
}) {
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
      <Row
        id="date-input"
        sx={{
          width: "100%",
          borderBottom: "1px solid #0D1D41",
        }}
      >
        {/* value={value?.startDate} value={value?.endDate}  */}
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
            }}
            inputProps={{ style: { textAlign: "center" } }}
            fullWidth
            placeholder={"YYYY-DD-MM"}
            value={startValue}
            onClick={() => {
              document.querySelector(".rdrCalendarWrapper").style.position =
                "absolute";
              document.querySelector(".rdrCalendarWrapper").style.display =
                "inline-flex";
              document.querySelector(".rdrCalendarWrapper").style.zIndex = 1;
              document.querySelector(".rdrCalendarWrapper").style.top = "75px";
              document.querySelector(".rdrCalendarWrapper").style.left =
                "-27px";
            }}
          />
        </Box>
        <Box
          sx={{
            width: w,
          }}
        >
          <Input
            sx={{
              "& input::placeholder": {
                fontSize: "10px",
                color: "#909090 !important",
                fontWeight: "bold",
              },
            }}
            value={endValue}
            inputProps={{ style: { textAlign: "center" } }}
            fullWidth
            placeholder={"YYYY-DD-MM"}
            onClick={() => {
              document.querySelector(".rdrCalendarWrapper").style.position =
                "absolute";
              document.querySelector(".rdrCalendarWrapper").style.display =
                "inline-flex";
              document.querySelector(".rdrCalendarWrapper").style.zIndex = 1;
              document.querySelector(".rdrCalendarWrapper").style.top = "75px";
              document.querySelector(".rdrCalendarWrapper").style.left =
                "-27px";
            }}
          />
        </Box>
        <DateRange
          rangeColors={["#0D1D41"]}
          showSelectionPreview={false}
          showDateDisplay={false}
          editableDateInputs={false}
          onChange={(item) => {
            setValue([item.selection]);
          }}
          moveRangeOnFirstSelection={true}
          ranges={value}
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
          if (setValue) {
            setValue(e.target.value);
            e.preventDefault();
          }
        }}
        {...props}
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
