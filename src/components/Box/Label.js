import Image from "next/image";
import { Container, Typography, Button } from "@mui/material";
import Column from "./Column";

export default function Label({ title, label, width, sx }) {
  return (
    <Column
      sx={{
        width: width,
        alignItems: "flex-start",
        borderBottom: "1px solid #0D1D41",
        ...sx,
      }}
      mt={2.2}
    >
      <Typography variant="h6" align="left">
        {title}
      </Typography>

      <Typography
        variant="normal"
        sx={{ paddingLeft: 1.2, paddingBottom: "6px" }}
      >
        {label}
      </Typography>
    </Column>
  );
}
