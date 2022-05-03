import { Divider, Typography } from "@mui/material";
export default function CustomDivider({ width, mt }) {
  return (
    <Typography component="div">
      <Divider
        sx={{
          width: width,
          border: "1px solid #000000",
          mt: mt,
        }}
      />
    </Typography>
  );
}
