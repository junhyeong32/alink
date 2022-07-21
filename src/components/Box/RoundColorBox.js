import Image from "next/image";
import { Box, Button } from "@mui/material";

export default function RoundColorBox({
  background,
  wrap,
  children,
  sx,
  w,
  fc,
  fs,
  ...props
}) {
  return (
    <Box
      sx={{
        width: w,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "5px",
        height: "20px",
        background: background,
        color: fc || "#FFFFFF",
        p: "7px",
        whiteSpace: "nowrap",
        fontSize: fs,
        fontWeight: 700,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
