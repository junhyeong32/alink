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
import Axios from "../../../utility/api";
import { getAccessToken } from "../../../utility/getCookie";
import { useRouter } from "next/router";

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

export default function Change({ index }) {
  const {
    openModal,
    modal,
    data = {},
    closeModal,
    modalContent,
  } = useContext(ModalContext);

  const { title, buttonName, buttonAction, list, type, reload } =
    modalContent[index];

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [select, setSelect] = useState("전체");

  return (
    <Modal open={modal[index] === "change"} onClose={() => closeModal(index)}>
      <Box>
        <Column alignItems={"center"} justifyContent={"between"} sx={style}>
          <TopLabelContents title={title} fs="h2" />
          <UnderLineSelectInput
            menuItems={data[index] || {}}
            value={select}
            setValue={setSelect}
            w={148}
          />
          <Row sx={{ gap: 2 }}>
            <Button
              text={buttonName}
              variant="contained"
              bgColor="primary"
              color="primary.white"
              fs="h6"
              w={97}
              h={30}
              action={() => {
                if (type === "dbUpload") {
                  closeModal(index);
                  openModal({
                    modal: "upload",
                    content: {
                      title: "DB 대량 등록",
                      is_sample: true,
                      uploadUrl: `db/menu/excelupload/${router.query.menu}`,
                      data: select,
                      reload: reload,
                    },
                  });
                } else if (type === "area") {
                  buttonAction(select);
                } else if (type === "changedb") {
                  buttonAction(select);
                  closeModal(index);
                } else
                  openModal({
                    modal: "needconfirm",
                    content: {
                      contents: `${data[index][select]}(으)로 소속변경을 진행하시겠습니까? `,
                      action: async () => {
                        const res = await Axios.Post("db/list/head_office", {
                          // TODO
                          // 재차 확인
                          token: getAccessToken(),
                          list_pks: list,
                          head_office_org_code: select,
                        });

                        if (res?.code === 200) {
                          closeModal(0, 2);
                          enqueueSnackbar("조직이 변경되었습니다", {
                            variant: "success",
                            autoHideDuration: 2000,
                          });
                        }
                      },
                    },
                  });
              }}
            />
            <Button
              text="취소"
              variant="contained"
              bgColor="gray"
              color="primary.white"
              fs="h6"
              w={97}
              h={30}
              action={() => closeModal(index)}
            />
          </Row>
        </Column>
      </Box>
    </Modal>
  );
}
