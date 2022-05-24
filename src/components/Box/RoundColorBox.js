import Image from "next/image";
import { Box, Button } from "@mui/material";

export default function RoundColorBox({
  background,
  wrap,
  children,
  sx,
  ...props
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "5px",
        height: "20px",
        background: background,
        color: "#FFFFFF",
        p: "7px",
        whiteSpace: "nowrap",
        ...sx,
      }}
      props
    >
      {children}
    </Box>
  );
}
