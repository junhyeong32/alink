import Image from "next/image";
import { Container, Typography, Button, Box } from "@mui/material";
import Column from "./Column";

export default function BackgroundTextBox({ w, h, text, background, sx }) {
  return (
    <Box
      sx={{
        width: w || "100%",
        height: h,
        background: background || "##0D1D41",
        p: 1,
        
        ...sx,
      }}
    >
      <Typography variant="small" color="primary.gray">
        {text}
      </Typography>
    </Box>
  );
}
