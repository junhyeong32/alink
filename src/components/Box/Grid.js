import Image from "next/image";
import { Box, Grid } from "@mui/material";

const _justifyContent = {
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
  center: "center",
  start: "flex-start",
  end: "flex-end",
};

const _alignItems = {
  center: "center",
  start: "flex-start",
  end: "flex-end",
};

const _itemCount = {
  1: "1fr",
  2: "1fr 1fr ",
  3: "1fr 1fr 1fr",
  4: "1fr 1fr 1fr 1fr",
};

export default function GridBox({
  justifyContent,
  alignItems,
  wrap,
  sx,
  children,
  onClick,
  flexDirection,
  itemCount,
  ...props
}) {
  return (
    <Grid
      sx={{
        justifyContent: _justifyContent[justifyContent],
        alignItems: _alignItems[alignItems],
        gridTemplateColumns: {
          lg: _itemCount[itemCount],
          md: _itemCount[itemCount - 1],
          sm: _itemCount[itemCount - 2],
          xs: _itemCount[itemCount - 3],
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Grid>
  );
}
