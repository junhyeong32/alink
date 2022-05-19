import Image from "next/image";
import { Container, Typography, Button } from "@mui/material";
import Row from "./Row";

export default function RowLabel({ title, label, fs, width, sx, children }) {
  return (
    <Row
      alignItems="center"
      justifyContent="start"
      wrap="norwap"
      sx={{
        width: "100%",
        columnGap: "47px",
        borderBottom: "1px solid #000000",
        pb: 1,
        ...sx,
      }}
    >
      <Typography
        variant={fs || "normal"}
        align="left"
        sx={{ minWidth: "45px" }}
      >
        {label}
      </Typography>

      {children}
    </Row>
  );
}
