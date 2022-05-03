import Image from "next/image";
import { Container, Typography, Button } from "@mui/material";
import Column from "./Column";
import Row from "./Row";

export default function News({ data, sx }) {
  return (
    <Column
      sx={{
        width: "100%",
        alignItems: "flex-start",
        borderBottom: "1px solid #919191",
        ":after": { width: "90%" },
        pb: 2,
        ...sx,
      }}
      mt={2.2}
    >
      <Row justifyContent={"between"} sx={{ width: "100%" }}>
        <Typography variant="h6">{data?.title}</Typography>
        <Typography variant="h6" color="primary.weather_gray">
          {data?.date}
        </Typography>
      </Row>

      <Typography variant="normal">{data?.contents}</Typography>
    </Column>
  );
}
