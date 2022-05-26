import Image from "next/image";
import { Container, Typography, Button, Box } from "@mui/material";
import Column from "./Column";

export default function DisableBox({ w, h, text, sx }) {
  return (
    <Box
      sx={{
        width: w || "100%",
        height: h,
        background: "#E6E6E6",
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
