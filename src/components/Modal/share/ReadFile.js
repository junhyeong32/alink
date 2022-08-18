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
import Row from "../../Box/Row";
import { LoadingButton } from "@mui/lab";
import Axios from "../../../utility/api";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import { ModalContext } from "../../../contexts/ModalContext";
import TopLabelContents from "../../Box/TopLableContents";
import Button from "../../Button";
import MemoBox from "../../Box/Memo";

const style = {
  width: { lg: "411px", md: "411px", sm: "411px", xs: "90%" },
  height: "auto",
  minHeight: 185,
  maxHeight: 500,
  overflowX: "hidden",
  background: "#FFFFFF",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  p: 2.7,
};

export default function ReadFile({ index }) {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfrmLoading] = useState(false);
  const [cookies] = useCookies();

  const { modal, closeModal, modalContent } = useContext(ModalContext);
  const { contents, title, data } = modalContent[index];

  return (
    <Modal
      open={modal[index] === "readFile" ? true : false}
      onClose={closeModal}
    >
      <Box>
        <Column alignItems={"center"} justifyContent={"start"} sx={style}>
          <Row
            justifyContent={"end"}
            sx={{ width: "100%", cursor: "pointer", mb: 2 }}
          >
            <Image
              src="/black_x.png"
              width={19}
              height={19}
              alt="x"
              layout="fixed"
              onClick={closeModal}
            />
          </Row>
          <Column
            alignItems={"center"}
            justifyContent={"center"}
            sx={{ width: "100%", height: "100%", gap: "25px" }}
          >
            {data?.map((d, key) => {
              if (title === "녹취 파일" && d?.value !== "") {
                return (
                  <Column
                    sx={{
                      width: "100%",
                      p: 1,
                      border: "1px solid black",
                      borderRadius: "5px",
                    }}
                  >
                    <Typography variant="h6" ml={3} mb={1}>
                      {d?.created_date}
                    </Typography>
                    <audio
                      controls
                      src={d?.value}
                      key={key}
                      style={{ width: "100%" }}
                    >
                      Your browser does not support the
                      <code>audio</code> element.
                    </audio>
                  </Column>
                );
              } else if (title === "메모" && d?.value !== "") {
                return (
                  <MemoBox
                    w={"100%"}
                    time={d?.created_date}
                    text={d?.value}
                    key={key}
                  />
                );
              } else if (title === "결과지 파일" && d?.value !== "") {
              }
            })}
          </Column>
        </Column>
      </Box>
    </Modal>
  );
}
