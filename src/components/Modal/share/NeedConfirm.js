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

const style = {
  width: { lg: "411px", md: "411px", sm: "411px", xs: "90%" },
  height: "185px",
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

export default function NeedConfirm({ index }) {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfrmLoading] = useState(false);
  const [cookies] = useCookies();

  const { modal, closeModal, modalContent } = useContext(ModalContext);
  const {
    content,
    action,
    buttonText = "승인",
    actionButtonColor,
  } = modalContent[index];

  console.log(modalContent);

  // useEffect(async () => {
  //   if (!action) return;
  //   const res = (
  //     await Axios.Get(`document`, {
  //       params: {
  //         platform: "web",
  //         token: cookies.access_token,
  //         document_code: new_data ? new_data?.code : modal_props.code,
  //         action: action,
  //         page: modal_props?.params.page,
  //         count: modal_props?.params.count,
  //         type:
  //           modal_props?.params.type === "전체"
  //             ? undefined
  //             : modal_props?.params.type,
  //         contractor_name: modal_props?.params.contractor_name,
  //         user_name_or_code: modal_props?.params.user_name_or_code,
  //         stock_number: modal_props?.params.stock_number,
  //         subscription_number: modal_props?.params.subscription_number,
  //         created_date_range:
  //           modal_props?.params.created_date_range[0] === null
  //             ? undefined
  //             : modal_props?.params.created_date_range,
  //         contract_date_range:
  //           modal_props?.params.contract_date_range[0] === null
  //             ? undefined
  //             : modal_props?.params.contract_date_range,
  //         status:
  //           modal_props?.params.status === "전체"
  //             ? undefined
  //             : modal_props?.params.status,
  //       },
  //     })
  //   )?.data;

  //   if (res?.data) {
  //     setNewData(res?.data.result[0]);
  //     setAction();
  //     // setSlideIndex(2);
  //   } else {
  //     enqueueSnackbar(res?.message, {
  //       variant: "error",
  //       autoHideDuration: 2000,
  //     });
  //   }
  // }, [document_code, action]);
  return (
    <Modal
      open={modal[index] === "needconfirm" ? true : false}
      onClose={closeModal}
    >
      <Box>
        <Column alignItems={"center"} justifyContent={"center"} sx={style}>
          <Column
            alignItems={"center"}
            justifyContent={"center"}
            sx={{ width: "100%", height: "100%", gap: "25px" }}
          >
            <TopLabelContents title="확인 필요" sx={{ pb: 1 }} />
            {/* {typeof contents === "object" ? (
              contents
            ) : (
              <Typography>{contents}</Typography>
            )}
            [] */}
            {content}
            <Row sx={{ gap: 2.5 }}>
              <Button
                text={buttonText}
                bgColor={buttonText === "삭제" ? "red" : "primary"}
                color="primary.white"
                w={97}
                h={30}
                fs={"h4"}
                action={() => {
                  action();
                }}
              />
              <Button
                text="취소"
                w={97}
                h={30}
                bgColor={"gray"}
                color={"primary.white"}
                fs={"h4"}
                action={closeModal}
              />
            </Row>
          </Column>
        </Column>
      </Box>
    </Modal>
  );
}
