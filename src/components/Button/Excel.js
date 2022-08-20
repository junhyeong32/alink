import Head from "next/head";
import Image from "next/image";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { Button, Typography } from "@mui/material";
import Row from "../Box/Row";

export default function ExcelButton({ action }) {
  return (
    <Button
      variant="contained"
      color="excel"
      sx={{
        borderRadius: "5px",
        height: 28,
        minWidth: "30px",
        maxWidth: "30px",
        p: 0,
        overflow: "hidden",
        position: "relative",
        transitionProperty: "min-width,width,max-width",
        transitionDuration: ".5s",
        zIndex: -1,
        "&:hover": {
          minWidth: "96px",
          maxWidth: "96px",
        },
      }}
      onClick={action}
    >
      <Row
        sx={{
          position: "absolute",
          display: "flex",
          width: "113px",
          left: "8px",
        }}
        alignItems="center"
      >
        <Image src="/excel.png" width={14} height={14} alt="excel" />
        <Typography variant="h7" color="primary.white" ml={1}>
          엑셀 다운로드
        </Typography>
      </Row>
    </Button>
  );
}
