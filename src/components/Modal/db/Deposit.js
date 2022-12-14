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
import {
  Modal,
  Box,
  Typography,
  Grid,
  Divider,
  Pagination,
} from "@mui/material";
import Column from "../../Box/Column";
import RowLabel from "../../Box/RowLabel";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import TopLabelContents from "../../Box/TopLableContents";
import Button from "../../Button";
import UnderLineSelectInput, {
  LabelOutLineSelectInput,
} from "../../Input/Select";
import { OutLineInput } from "../../Input";
import Row from "../../Box/Row";
import { ModalContext } from "../../../contexts/ModalContext";
import UnderLineInput from "../../Input";
import { LabelUnderLineInput } from "../../Input";
import DbGiftTable from "../../Table/db-gift";
import Axios from "../../../utility/api";
import { getAccessToken, getCookie } from "../../../utility/getCookie";
import useGetGroupList from "../../../hooks/share/useGetGroupList";
import useGetOrganization from "../../../hooks/share/useGetOrganization";
import { getOrgWithOfficeName } from "../../../utility/organization/getOrgWithUnit";
import { Router } from "@mui/icons-material";
import { useRouter } from "next/router";

const style = {
  width: { lg: 702, md: 702, sm: "90%", xs: "90%" },
  height: 316,
  overflowX: "hidden",
  background: "#FFFFFF",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  padding: 2,
};

export default function Deposit({ index }) {
  const [select, setSelect] = useState("");
  const router = useRouter();
  const [user_info] = useState(getCookie("user_info"));

  const { modal, data, openModal, closeModal, modalContent } =
    useContext(ModalContext);

  const { buttonAction } = modalContent[index];

  return (
    <Modal
      open={modal[index] === "deposit" ? true : false}
      onClose={closeModal}
    >
      <Box>
        <Column alignItems={"start"} justifyContent={"start"} sx={style}>
          <Row justifyContent={"end"} sx={{ width: "100%" }}>
            <Image
              src="/black_x.png"
              width={15}
              height={15}
              alt="x"
              className="cursor"
              onClick={() => {
                router.back();
                closeModal();
              }}
            />
          </Row>
          <Row
            alignItems={"end"}
            sx={{
              width: "100%",
              borderBottom: "1px solid black",
              gap: 1.5,
              pb: 1,
            }}
          >
            <Typography variant="h4">?????? ??????</Typography>
            <Typography variant="small">
              ????????? ??????????????? ????????? ?????????????????? ????????? ?????????.
            </Typography>
          </Row>
          <Column
            alignItems={"center"}
            justifyContent={"center"}
            sx={{
              width: "100%",
              height: "95%",
              gap: "25px",
              overflowY: "scroll",
              p: 3,
            }}
          >
            <Typography variant="h5" color="primary.red" align="center">
              ???????????? ?????? ?????????????????????.
              <br />
              ???????????? ??????????????? ????????? ????????? ??????????????????. <br />
              ????????? : {data[index]}???
            </Typography>

            <Typography variant="h5" align="center">
              ??????:??????????????? ????????? ?????? (T. 02-6239-0011) <br />
              ????????????: 367-910009-69804 ???????????? (???????????? ?????????????????????)
            </Typography>

            <Row sx={{ gap: 1 }}>
              <Button
                text="????????????"
                variant="contained"
                bgColor={"primary"}
                color="primary.white"
                fs="h5"
                //   w={60}
                h={28}
                action={() => {
                  closeModal();
                  buttonAction();
                }}
              />
            </Row>
          </Column>
        </Column>
      </Box>
    </Modal>
  );
}
