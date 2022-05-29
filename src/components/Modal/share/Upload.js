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
import { Modal, Box, Typography, Grid, Divider } from "@mui/material";
import Column from "../../Box/Column";
import RowLabel from "../../Box/RowLabel";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import TopLabelContents from "../../Box/TopLableContents";
import Button from "../../Button";
import UnderLineSelectInput from "../../Input/Select";
import { OutLineInput } from "../../Input";
import Row from "../../Box/Row";
import { ModalContext } from "../../../contexts/ModalContext";

const style = {
  width: { lg: "715px", md: "715px", sm: "715px", xs: "90%" },
  height: "322px",
  overflowX: "hidden",
  background: "#FFFFFF",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  padding: { lg: "32px 60px 32px 60px", xs: "32px 30px 32px 30px" },
  gap: 1.3,
};

export default function Upload() {
  const { enqueueSnackbar } = useSnackbar();
  const { visible, closeModal, modalContent } = useContext(ModalContext);
  const { title, download, choiceFile, uploadFIle } = modalContent;
  return (
    <Modal open={visible} onClose={closeModal}>
      <Box>
        <Column alignItems={"start"} justifyContent={"center"} sx={style}>
          <TopLabelContents title={title} sx={{ pb: 1 }} />
          <RowLabel label="Sample" w={430} sx={{ pl: 3, position: "relative" }}>
            <Divider
              absolute
              orientation="vertical"
              sx={{
                height: "75px",
                top: "-5px",
                left: { lg: -"80%", xs: "-75%" },
                borderColor: "black",
              }}
            />
            <Button
              text="다운로드"
              w={60}
              h={20}
              fs={"h6"}
              onClick={download}
            />
          </RowLabel>
          <Row alignItems={"center"} sx={{ pl: 3 }}>
            <Typography variant="normal" sx={{ mr: 4 }}>
              관련 파일
            </Typography>
            <OutLineInput sx={{ mr: 1.4 }} />
            <Button
              text="파일선택"
              w={60}
              h={20}
              fs={"h6"}
              onClick={choiceFile}
            />
          </Row>
          <Row
            justifyContent={"center"}
            sx={{ width: "100%", mt: 2.7, gap: 5 }}
          >
            <Button
              text="파일 업로드"
              w={166}
              h={52}
              fs={"h4"}
              onClick={uploadFIle}
            />
            <Button
              text="취소"
              bgColor={"gray"}
              w={166}
              h={52}
              fs={"h4"}
              color="primary.white"
              action={closeModal}
            />
          </Row>
        </Column>
      </Box>
    </Modal>
  );
}
