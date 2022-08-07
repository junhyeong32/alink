import Image from "next/image";
import { Box, Button, Typography } from "@mui/material";
import Row from "./Row";
import { useRouter } from "next/router";

export default function MenuBox({ img_src, w, text, link, textWidth }) {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push(link)}
      sx={{
        width: w || "100%",
        columnGap: "10.6px",
        display: "flex",
        justifyContent: "flex-start",
        heigth: 57,
        borderRadius: 0,
        "&.MuiButtonBase-root:active": {
          bgcolor: "transparent",
        },
        padding: "0 0 15px 0",
        "&:hover": {
          backgroundColor: "none",
          color: "primary",
        },
        "&:active": {
          backgroundColor: "none",
        },
      }}
    >
      {/* <Image src={img_src} width={22} height={22} alt="setting" /> */}
      <Typography
        variant="h4"
        color="primary.white"
        sx={{
          borderBottom:
            (`/${router.pathname.split("/")[1]}` === "/db"
              ? link.split("menu=")[1] === router.query.menu
              : link === router.asPath ||
                link === `/${router.pathname.split("/")[1]}`) &&
            "2px solid white",
          pb: "2px",
          whiteSpace: "break-spaces",
          textAlign: "start",
          maxWidth: textWidth,
        }}
      >
        {text}
      </Typography>
    </Button>
  );
}
