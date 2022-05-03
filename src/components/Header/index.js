import Image from "next/image";
import { Box, Button, Container, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Row from "../Box/Row";
import styles from "../../../styles/js/home";
import { useRouter } from "next/router";

function Header() {
  const router = useRouter();
  return (
    <nav
      style={{
        width: "100%",
        height: "63px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        padding: "0 0 0 21px",
        minWidth: "1280px",
      }}
    >
      <Row
        alignItems="center"
        justifyContent="between"
        sx={{ height: "100%", cursor: "pointer" }}
      >
        <Image
          src="/marketool_logo_color.png"
          width={206}
          height={33}
          alt="logo"
          onClick={() => router.push("/")}
        />
      </Row>
    </nav>
  );
}

export default Header;
