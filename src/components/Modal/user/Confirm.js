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
import ColumnLabel from "../../Box/ColumnLabel";
import RowLabel from "../../Box/RowLabel";
import TextBox from "../../Box/Text";
import ImageTextBox from "../../Box/Image";
import getDepthOfTeam from "../../../hooks/share/getDepthOfTeam";
import ImageModal from "../Image";
import styles from "../../../../styles/js/modal";
import reduceImageSize from "../../../utility/image";
import { contract_information } from "./items";
import { LoadingButton } from "@mui/lab";
import Axios from "../../../utility/api";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import Carousel from "nuka-carousel";
import previousSlide from "nuka-carousel";
import { ModalContext } from "../../../contexts/ModalContext";
import TopLabelContents from "../../Box/TopLableContents";
import Button from "../../Button";

export default function Contract({ index, modal_props, deleteModalList }) {
  const { enqueueSnackbar } = useSnackbar();
  const { detail_info } = modal_props;
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfrmLoading] = useState(false);
  const [cookies] = useCookies();
  const [document_code, setDocumentCode] = useState();
  const [action, setAction] = useState();
  const [new_data, setNewData] = useState();
  const [slide_index, setSlideIndex] = useState(0);

  useEffect(async () => {
    if (!action) return;
    const res = (
      await Axios.Get(`document`, {
        params: {
          platform: "web",
          token: cookies.access_token,
          document_code: new_data ? new_data?.code : modal_props.code,
          action: action,
          page: modal_props?.params.page,
          count: modal_props?.params.count,
          type:
            modal_props?.params.type === "전체"
              ? undefined
              : modal_props?.params.type,
          contractor_name: modal_props?.params.contractor_name,
          user_name_or_code: modal_props?.params.user_name_or_code,
          stock_number: modal_props?.params.stock_number,
          subscription_number: modal_props?.params.subscription_number,
          created_date_range:
            modal_props?.params.created_date_range[0] === null
              ? undefined
              : modal_props?.params.created_date_range,
          contract_date_range:
            modal_props?.params.contract_date_range[0] === null
              ? undefined
              : modal_props?.params.contract_date_range,
          status:
            modal_props?.params.status === "전체"
              ? undefined
              : modal_props?.params.status,
        },
      })
    )?.data;

    if (res?.data) {
      setNewData(res?.data.result[0]);
      setAction();
      // setSlideIndex(2);
    } else {
      enqueueSnackbar(res?.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  }, [document_code, action]);

  return (
    <Modal open={is_open}>
      <Box
        sx={{
          width: "1175px",
          height: "90%",
          borderRadius: "10px",
          ...styles.modal,
          padding: "0px",
          position: "relative",
          gap: "32px",
          overflowX: "hidden",
        }}
      >
        <Column alignItems={"center"} justifyContent={"center"}>
          <TopLabelContents label="확인 필요" />
          <Typography>1</Typography>
          <Typography>보장DB를 ON으로 설정하시겠습니까?</Typography>
          <Button text="확인" />
          <Button text="취소" />
        </Column>
      </Box>
    </Modal>
  );
}
