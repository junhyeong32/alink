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
import UnderLineInput from "../../Input";
import { LabelUnderLineInput } from "../../Input";
import DbGiftTable from "../../Table/db-gift";

const style = {
  width: { lg: 900, md: 900, sm: "90%", xs: "90%" },
  height: 880,
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

export default function Gift({ index }) {
  const [select, setSelect] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const { modal, data, openModal, closeModal, modalContent } =
    useContext(ModalContext);

  return (
    <Modal open={modal[index] === "gift" ? true : false} onClose={closeModal}>
      <Box>
        <Column alignItems={"center"} justifyContent={"center"} sx={style}>
          <Column
            alignItems={"center"}
            justifyContent={"center"}
            sx={{ width: "100%", height: "100%", gap: "25px" }}
          >
            <Row>
              <LabelUnderLineInput
                w={"100%"}
                title={"담당자"}
                placeholder={"담당자명(으)로 검색하실 수 있습니다."}
                // value={allocated_user}
                // onChange={(e) => setAllocatedUser(e.target.value)}
              />
              <LabelUnderLineInput
                w={"100%"}
                title={"담당자"}
                placeholder={"담당자명(으)로 검색하실 수 있습니다."}
                // value={allocated_user}
                // onChange={(e) => setAllocatedUser(e.target.value)}
              />
            </Row>
            {/* <DbGiftTable data={data[index]} /> */}
          </Column>
        </Column>
      </Box>
    </Modal>
  );
}
