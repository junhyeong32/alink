import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Button, Modal, Box, Typography, Grid } from "@mui/material";

export default function Sign({ visible, setVisible, contents, height }) {
  const handleOpen = () => setVisible(true);
  const handleClose = () => {
    setVisible(false);
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    height: height,
    bgcolor: "background.paper",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  return (
    <Modal open={visible} onClose={handleClose}>
      <Box sx={style}>{contents}</Box>
    </Modal>
  );
}
