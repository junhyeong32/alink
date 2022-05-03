import Image from "next/image";
import { Container, Typography, Button } from "@mui/material";
import Row from "./Row";

export default function RowLabel({ title, label, width, sx }) {
  return (
    <Row
      sx={{
        alignItems: "flex-start",
        gap: "47px",
        ...sx,
      }}
      mt={2.2}
    >
      <Typography variant="h6" align="left" sx={{ minWidth: "45px" }}>
        {title}
      </Typography>

      <Typography
        variant="small"
        align="left"
        sx={{
          paddingBottom: "2px",
          borderBottom: "1px solid #0D1D41",
          width: width,
        }}
      >
        {label}
      </Typography>
    </Row>
  );
}
