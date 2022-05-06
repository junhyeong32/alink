import Image from "next/image";
import { Container, Typography, Button } from "@mui/material";
import Row from "./Row";

export default function TextBox({
  title,
  subtitle,
  width,
  heigth,
  variant,
  sx,
}) {
  return (
    <Row
      alignItems="start"
      justifyContent="between"
      sx={{
        width: width || "calc(100% - 32px)",
        height: 29,
        borderBottom: "1px solid #0D1D41",
        ...sx,
      }}
    >
      <Typography variant="h5">{title}</Typography>
      <Typography variant="h5">{subtitle}</Typography>
    </Row>
  );
}
