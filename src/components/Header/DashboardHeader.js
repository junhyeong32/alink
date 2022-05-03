import Image from "next/image";
import { Box, Button, Container, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Row from "../Box/Row";
import styles from "../../../styles/js/home";
import { useRouter } from "next/router";

export default function DashboardHeader() {
  const router = useRouter();
  return (
    <header
      style={{
        width: "calc(100%)",
        height: "62px",
        borderBottom: "1px solid #4158D9",
        paddingBottom: "12px",
        display: "flex",
        alignItems: "end",
        position: "static",
        // marginBottom: "20px",
        background: "#FFFFFF",
      }}
    >
      <Typography variant="h1" color="primary">
        대시보드
      </Typography>
    </header>
  );
}
