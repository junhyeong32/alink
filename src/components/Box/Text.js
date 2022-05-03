import Image from "next/image";
import { Container, Typography, Button } from "@mui/material";
import Column from "./Column";

export default function TextBox({ title, width, heigth, variant, sx }) {
  return (
    <Column
      alignItems="start"
      sx={{
        width: width || "calc(100% - 32px)",
        height: 29,
        borderBottom: "1px solid #0D1D41",
        ...sx,
      }}
    >
      <Typography variant="h5">{title}</Typography>
    </Column>
  );
}
