import Image from "next/image";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import Row from "./Row";
import Column from "./Column";

export default function MemoBox({ w, time, text }) {
  return (
    <Column
      sx={{
        border: "1px solid black",
        borderRadius: "5px",
        p: "0 8px 8px 8px",
        width: w || {
          lg: "33%",
          md: "33%",
          sm: "33%",
          xs: "100%",
        },
      }}
    >
      <Typography variant="h6">{time}</Typography>
      <Box sx={{ background: "#E6E6E6", p: 0.5, mt: 0.5, minHeight: 80 }}>
        <Typography variant="h5" color="primary.gray">
          {text}
        </Typography>
      </Box>
    </Column>
  );
}
