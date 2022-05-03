import Image from "next/image";
import { Container, Typography, Button, Box } from "@mui/material";
import Column from "./Column";
import reduceImageSize from "../../utility/image";

export default function ImageTextBox({
  img_src,
  text,
  action,
  button_text,
  button_action,
  sx,
  img_id,
  slideIndex,
}) {
  const img = reduceImageSize(img_src, {
    w: 100,
    q: 50,
  });

  return (
    <Column
      alignItems="center"
      sx={{
        ...sx,
        position: "relative",
      }}
    >
      {slideIndex === img_id && (
        <Box
          id="test"
          sx={{
            width: "100px",
            height: "141px",
            position: "absolute",
            background: "rgba(0, 0, 0, 0.6)",
            zIndex: 1,
          }}
        />
      )}
      <Typography component="div" style={{ cursor: "pointer" }}>
        {img && (
          <Image
            src={img}
            width={100}
            height={141}
            alt=""
            onClick={action}
            id={img_id}
          />
        )}
      </Typography>
      {text}
      {button_text && (
        <Button
          variant="contained"
          color="primary"
          sx={{ borderRadius: 0, width: "100px", height: 24, mt: 1, p: 0 }}
        >
          <Typography variant="h6">
            <a href={img_src} target="_blank" rel="noreferrer">
              {button_text}
            </a>
          </Typography>
        </Button>
      )}
    </Column>
  );
}
