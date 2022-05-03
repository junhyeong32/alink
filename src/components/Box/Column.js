import Image from "next/image";
import { Box, Button } from "@mui/material";
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

const _wrap = {
  wrap: "wrap",
  nowrap: "no-wrap",
};

export default function Column({
  componentType,
  justifyContent,
  alignItems,
  wrap,
  children,
  sx,
  ...props
}) {
  return (
    <Box
      component={componentType}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: _justifyContent[justifyContent],
        alignItems: _alignItems[alignItems],
        wrap: _wrap[_wrap],
        ...sx,
      }}
      props
    >
      {children}
    </Box>
  );
}
