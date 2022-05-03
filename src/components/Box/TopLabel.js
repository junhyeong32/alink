import Image from "next/image";
import { Container, Typography, Button } from "@mui/material";
import Column from "./Column";

export default function TopLabelBox({ label, contents, width, sx }) {
  return (
    <Column
      alignItems={"stat"}
      sx={{
        width: "100%",
        borderBottom: "1px solid #0D1D41",
        ...sx,
      }}
    >
      <Typography variant="h6" align="left">
        {label}
      </Typography>

      <Typography
        variant="normal"
        sx={{
          padding: "6px 12px 0 0",
          height: "29px",
          mt: 1,
          background: "#FFFFFF",
          border: "1px solid #EFEFEF",
          paddingLeft: "12px",
        }}
      >
        {contents}
      </Typography>
    </Column>
  );
}
