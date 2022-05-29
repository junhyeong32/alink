import Image from "next/image";
import { Container, Typography, Button } from "@mui/material";
import Row from "./Row";

export default function RowLabel({
  title,
  label,
  label_w,
  fs,
  w,
  sx,
  children,
  columnGap,
}) {
  return (
    <Row
      alignItems="center"
      justifyContent="start"
      wrap="norwap"
      sx={{
        maxWidth: w,
        width: "100%",
        columnGap: columnGap || "47px",
        borderBottom: "1px solid #000000",
        pb: 1,
        ...sx,
      }}
    >
      <Typography
        variant={fs || "normal"}
        align="left"
        sx={{ minWidth: label_w || "45px", whiteSpace: "nowrap" }}
      >
        {label}
      </Typography>

      {children}
    </Row>
  );
}
