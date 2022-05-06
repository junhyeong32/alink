import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button, Modal, Box, Typography, Grid } from "@mui/material";
import Row from "../Box/Row";

export default function ImageModal({ index, modal_props, deleteModalList }) {
  const style = {
    position: "absolute",
    top: "49%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: " 808px",
    height: "95%",
    bgcolor: "background.paper",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    overflowY: "scroll",
    p: 2,
  };

  return (
    <Modal
      open={modal_props.is_open}
      onClose={() => {
        deleteModalList(index);
        !modal_props && false;
      }}
    >
      <Box sx={style}>
        <Row justifyContent="center" sx={{ rowGap: 3, width: "100%" }}>
          <Row
            sx={{ width: "90%", height: "997px", position: "relative", mt: 4 }}
          >
            {modal_props?.image && (
              <Image
                src={modal_props?.image}
                alt=""
                layout="fill"
                placeholder="img"
                priority={true}
                loading="eager"
              />
            )}
          </Row>
          <Typography
            component="div"
            sx={{ cursor: "pointer", position: "absolute", right: 0, mr: 2 }}
          >
            <Image
              src="/x.png"
              width={25}
              height={25}
              alt="colse"
              onClick={() => deleteModalList(index)}
            />
          </Typography>
        </Row>
      </Box>
    </Modal>
  );
}
