import Image from "next/image";
import { Container, Typography, Button } from "@mui/material";
import Row from "./Row";

export default function RowLabel({ title, label, width, sx, children }) {
  return (
    <Row
      alignItems="center"
      justifyContent="start"
      sx={{
        width: "100%",
        gap: "47px",
        borderBottom: "1px solid #000000",
        pb: 1,
        ...sx,
      }}
      mt={2.2}
    >
      <Typography variant="h4" align="left" sx={{ minWidth: "45px" }}>
        {label}
      </Typography>

      {children}
    </Row>
  );
}
