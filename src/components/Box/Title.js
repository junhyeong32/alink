import Image from "next/image";
import { Container, Typography, Button, Box } from "@mui/material";
import Column from "./Column";

export default function Title({ title, width, heigth, variant, sx }) {
  return (
    <Column alignItems="center">
      <Typography variant="h1" color="primary">
        {title}
      </Typography>
      <Box
        sx={{
          width: "70px",
          height: " 70px",
          margin: " 10px",
          border: " 3px solid transparent",
          borderRadius: "50%",
          backgroundImage:
            "linear-gradient(#fff, #fff),linearGradient(to right, red 0%,  orange 100%)",
          backgroundOrigin: "border-box",
          backgroundClip: "content-box, border-box",
        }}
      />
    </Column>
  );
}
