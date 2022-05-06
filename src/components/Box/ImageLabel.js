import Image from "next/image";
import { Container, Typography, Button } from "@mui/material";
import Column from "./Column";

export default function ImageLabel({ title, img_props, width, sx, action }) {
  return (
    <Column
      sx={{
        alignItems: "flex-start",
        ...sx,
      }}
      mt={2.2}
    >
      <Typography
        variant="h5"
        align="left"
        sx={{ borderBottom: "1px solid #0D1D41", width: width, pb: 1.2 }}
      >
        {title}
      </Typography>

      <Typography variant="normal" sx={{ p: 1.2, cursor: "pointer" }}>
        {img_props?.img_src && (
          <Image
            src={img_props.img_src}
            width={img_props.width}
            height={img_props.height}
            alt=""
            onClick={action}
          />
        )}
      </Typography>
    </Column>
  );
}
