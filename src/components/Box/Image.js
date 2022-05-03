import Image from "next/image";
import { Container, Typography, Button } from "@mui/material";
import Column from "./Column";

export default function ImageTextBox({
  img_src,
  text,
  action,
  button_text,
  button_action,
  sx,
  img_id,
}) {
  return (
    <Column
      alignItems="center"
      sx={{
        ...sx,
      }}
    >
      <Typography component="div" style={{ cursor: "pointer" }}>
        {img_src && (
          <Image
            src={img_src}
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
