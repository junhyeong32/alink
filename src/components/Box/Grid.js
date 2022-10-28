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
  console.log(typeof itemCount, typeof itemCount === "array" && itemCount[3]);
  return (
    <Grid
      sx={{
        display: "grid",
        justifyContent: _justifyContent[justifyContent],
        alignItems: _alignItems[alignItems],
        gridTemplateColumns: {
          lg:
            typeof itemCount === "object" && itemCount[0]
              ? _itemCount[itemCount[0] - 1]
              : _itemCount[3],
          md:
            typeof itemCount === "object" && itemCount[1]
              ? _itemCount[itemCount[1] - 1]
              : _itemCount[2],
          sm:
            typeof itemCount === "object" && itemCount[2]
              ? _itemCount[itemCount[2] - 1]
              : _itemCount[1],
          xs:
            typeof itemCount === "object" && itemCount[3]
              ? _itemCount[itemCount[3] - 1]
              : _itemCount[0],
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Grid>
  );
}
