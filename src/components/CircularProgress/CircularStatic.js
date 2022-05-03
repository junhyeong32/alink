import * as React from "react";
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Column from "../Box/Column";
import Row from "../Box/Row";
import { useState } from "react";
import { numberFormat } from "../../utility/math";
import {
  CircularProgressbar,
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function CircularStatic({ text, value }) {
  const [action, setAction] = useState(false);
  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        cursor: "pointer",
        width: "215px",
      }}
      onMouseEnter={() => setAction(true)}
      onMouseLeave={() => setAction(false)}
    >
      <CircularProgressbarWithChildren
        value={Math.round((value?.done / value?.total) * 100 || 0)}
        strokeWidth={6}
        styles={buildStyles({
          strokeLinecap: "butt",
          pathColor: "#0D1D41",
          rotation: 0.51,
          trailColor: "#C1C5C8",
        })}
      >
        {!action ? (
          <>
            <Typography variant="fs50" component="div">
              {`${Math.round((value?.done / value?.total) * 100 || 0)}%` || 0}
            </Typography>
            <Typography variant="fs20" color="primary.gray" mt={1}>
              {text}
            </Typography>
          </>
        ) : (
          <>
            <Row
              justifyContent="between"
              alignItems="start"
              sx={{ width: "50%" }}
            >
              <Typography variant="normal">전체</Typography>
              <Typography variant="normal">
                {numberFormat(value?.total)}
              </Typography>
            </Row>
            <Row
              justifyContent="between"
              alignItems="start"
              sx={{ width: "50%" }}
            >
              <Typography variant="normal">완료</Typography>
              <Typography variant="normal">
                {numberFormat(value?.done)}
              </Typography>
            </Row>
            <Row
              justifyContent="between"
              alignItems="start"
              sx={{ width: "50%" }}
            >
              <Typography variant="normal">미완료</Typography>
              <Typography variant="normal">
                {numberFormat(value?.pending)}
              </Typography>
            </Row>
          </>
        )}
      </CircularProgressbarWithChildren>
    </Box>
  );
}
