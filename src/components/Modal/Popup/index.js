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
import { Modal, Box, Typography, Grid, Checkbox } from "@mui/material";
import Column from "../../Box/Column";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import TopLabelContents from "../../Box/TopLableContents";
import Button from "../../Button";
import UnderLineSelectInput from "../../Input/Select";
import { ModalContext } from "../../../contexts/ModalContext";
import Row from "../../Box/Row";
import { setCookie, getCookie } from "../../../utility/getCookie";
import "react-quill/dist/quill.snow.css";
import Editor from "../../Editor";

export default function Popup({ index }) {
  const {
    openModal,
    modal,
    data = {},
    closeModal,
    modalContent,
  } = useContext(ModalContext);

  const { action, setCookieAction } = modalContent[index];
  const [_cookieAction, _setCookieAction] = useState(false);

  const reSize = data[index]?.size?.split("/");
  const rePosition = data[index]?.position?.split("/");

  const style = {
    width: {
      lg:
        reSize?.length !== 1
          ? Number(reSize?.[0])
          : data[index]?.size === "대"
          ? 600
          : data[index]?.size === "중"
          ? 500
          : 250,
      md:
        reSize?.length !== 1
          ? Number(reSize?.[0])
          : data[index]?.size === "대"
          ? 600
          : data[index]?.size === "중"
          ? 500
          : 250,
      sm: "95%",
      xs: "95%",
    },

    height: {
      lg:
        reSize?.length !== 1
          ? Number(reSize?.[1])
          : data[index]?.size === "대"
          ? 800
          : 300,
      md:
        reSize?.length !== 1
          ? Number(reSize?.[1])
          : data[index]?.size === "대"
          ? 800
          : 300,
      sm: "95%",
      xs: "95%",
    },

    overflowY: "hidden",
    background: "#FFFFFF",
    position: "absolute",
    bgcolor: "background.paper",
    borderRadius: "5",
    border: "none",
    transform: data[index]?.position === "중앙" && "translate(-50%, -50%)",

    right: data[index]?.position === "우측상단" && 0,
    left:
      rePosition?.length !== 1
        ? Number(rePosition?.[1])
        : data[index]?.position === "좌측상단"
        ? 0
        : data[index]?.position === "중앙" && "50%",
    top:
      rePosition?.length !== 1
        ? Number(rePosition?.[1])
        : data[index]?.position === "좌측상단"
        ? 0
        : data[index]?.position === "우측상단"
        ? 0
        : "50%",
  };

  return (
    <Modal open={modal[index] === "popup"} onClose={() => closeModal(index)}>
      <Box
        sx={style}
        tabIndex={"none"}
        componentsProps={{
          tabIndex: "none",
        }}
      >
        <Column
          alignItems={"center"}
          justifyContent={"between"}
          sx={{ position: "relative", width: "100%", height: "100%" }}
        >
          <Editor
            value={data[index]?.content}
            readOnly
            theme={"bubble"}
            style={{ height: "100%", width: "100%", overflowY: "scroll" }}
          />

          <Row
            justifyContent={"between"}
            alignItems={"center"}
            sx={{
              bottom: 0,
              width: "100%",
              height: 27,
              background: "#232323",
              p: 1,
            }}
          >
            <Row alignItems={"center"} sx={{ gap: 1 }}>
              <Checkbox
                color="white"
                icon={
                  <Image
                    src="/checkbox_white.png"
                    width={22}
                    height={22}
                    alt=""
                  />
                }
                onClick={() => {
                  typeof action === "function" &&
                    action((prev) => {
                      const newCookie = [...prev];

                      const foundIndex = newCookie.indexOf(data[index]?.pk);

                      if (foundIndex === -1) newCookie.push(data[index]?.pk);

                      return newCookie;
                    });
                }}
              />
              <Typography variant="h5" color="primary.white">
                하루동안 열지않기
              </Typography>
            </Row>

            <Image
              src={"/popup_x.png"}
              width={20}
              height={20}
              alt=""
              className="cursor"
              onClick={() => {
                index === 0 &&
                  typeof setCookieAction === "function" &&
                  setCookieAction(!_cookieAction);
                closeModal(index);
              }}
            />
          </Row>
        </Column>
      </Box>
    </Modal>
  );
}
