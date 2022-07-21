import Image from "next/image";
import { Container, Typography, Button, Box } from "@mui/material";
import Row from "./Row";

export default function BackgroundTextBox({ w, h, text, background, sx }) {
  return (
    <Row
      alignItems={"center"}
      justifyContent={"center"}
      sx={{
        width: w || "100%",
        height: h,
        background: background || "##0D1D41",
        p: 1,
        whiteSpace: "nowrap",
        ...sx,
      }}
    >
      <Typography variant="small" color="primary.gray">
        {text}
      </Typography>
    </Row>
  );
}
