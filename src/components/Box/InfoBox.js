import Image from "next/image";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import Row from "./Row";
import Column from "./Column";

export default function InfoBox({
  bgColor,
  color = true,
  title,
  total,
  shooting,
  directly,
}) {
  return (
    <Column
      sx={{
        flex: 1,
        height: 124,
        background: bgColor,
        borderRadius: "5px",
        padding: "14px",
        margin: "0 5px",
      }}
    >
      <Typography
        variant="h5"
        color={color ? "primary.black" : "primary.white"}
      >
        {title}
      </Typography>
      <Row justifyContent="between" sx={{ padding: "15px 25px 0 25px" }}>
        <Column alignItems="center" sx={{ rowGap: "11px", flex: 1 }}>
          <Typography
            variant="h6"
            color={color ? "primary.black" : "primary.white"}
          >
            합계
          </Typography>
          <Typography
            variant="h3"
            color={color ? "primary.black" : "primary.white"}
          >
            {total} 개
          </Typography>
        </Column>
        <Column alignItems="center" sx={{ rowGap: "11px", flex: 1 }}>
          <Typography
            variant="h6"
            color={color ? "primary.black" : "primary.white"}
          >
            촬영 생성
          </Typography>
          <Typography
            variant="h3"
            color={color ? "primary.black" : "primary.white"}
          >
            {shooting} 개
          </Typography>
        </Column>
        <Column alignItems="center" sx={{ rowGap: "11px", flex: 1 }}>
          <Typography
            variant="h6"
            color={color ? "primary.black" : "primary.white"}
          >
            직접 생성
          </Typography>
          <Typography
            variant="h3"
            color={color ? "primary.black" : "primary.white"}
          >
            {directly} 개
          </Typography>
        </Column>
      </Row>
    </Column>
  );
}
