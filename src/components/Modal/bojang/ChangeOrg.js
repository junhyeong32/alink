import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  useContext,
  useEffect,
  useRef,
  useState,
  forwardRef,
  createRef,
} from "react";
import { Modal, Box, Typography, Grid } from "@mui/material";
import Column from "../../Box/Column";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import TopLabelContents from "../../Box/TopLableContents";
import Button from "../../Button";
import UnderLineSelectInput from "../../Input/Select";
import { ModalContext } from "../../../contexts/ModalContext";
import Row from "../../Box/Row";

const style = {
  width: { lg: 411, md: 411, sm: 411, xs: "90%" },
  height: 186,
  overflowX: "hidden",
  background: "#FFFFFF",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "5",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  borderRadius: "10px",
};

export default function Change({ index, modal_props, deleteModalList }) {
  const { visible, openModal, closeModal, modalContent } =
    useContext(ModalContext);
  return (
    <Modal open={visible} onClose={closeModal}>
      <Box>
        <Column alignItems={"center"} justifyContent={"between"} sx={style}>
          <TopLabelContents title="DB 조직 변경" fs="h2" />
          <UnderLineSelectInput menuItems={{}} />
          <Row sx={{ gap: 2 }}>
            <Button
              text="변경"
              variant="contained"
              bgColor="primary"
              color="primary.white"
              fs="h6"
              w={97}
              h={30}
            />
            <Button
              text="취소"
              variant="contained"
              bgColor="gray"
              color="primary.white"
              fs="h6"
              w={97}
              h={30}
            />
          </Row>
        </Column>
      </Box>
    </Modal>
  );
}
