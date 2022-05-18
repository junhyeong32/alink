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

export default function Row({
  justifyContent,
  alignItems,
  wrap,
  sx,
  children,
  onClick,
  flexDirection,
  ...props
}) {
  return (
    <Box
      component="div"
      onClick={onClick}
      sx={{
        display: "flex",
        flexDirection: flexDirection || "row",
        justifyContent: _justifyContent[justifyContent],
        alignItems: _alignItems[alignItems],
        flexWrap: _wrap[wrap],
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
