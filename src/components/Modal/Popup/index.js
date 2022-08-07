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

export default function Popup({ index }) {
  const {
    openModal,
    modal,
    data = {},
    closeModal,
    modalContent,
  } = useContext(ModalContext);

  const reSize = data[index]?.size?.split("/");
  const rePosition = data[index]?.position?.split("/");

  const style = {
    width:
      reSize?.length !== 1
        ? Number(reSize?.[0])
        : data[index]?.size === "대"
        ? 600
        : data[index]?.size === "중"
        ? 500
        : 250,
    height:
      reSize?.length !== 1
        ? Number(reSize?.[1])
        : data[index]?.size === "대"
        ? 800
        : 300,
    overflowY: "hidden",
    background: "#FFFFFF",
    position: "absolute",
    bgcolor: "background.paper",
    borderRadius: "5",
    border: "none",
    transform: data[index]?.position === "중앙" && "translate(-50%, -50%)",
    pt: 2,
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
          sx={{ position: "relative", height: "100%" }}
        >
          <div dangerouslySetInnerHTML={{ __html: data[index]?.content }}></div>

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
                  setCookie(
                    ["popup"],
                    [...getCookie(["popup"]), data[index]?.pk],
                    { maxAge: 43200 }
                  );
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
              onClick={closeModal}
            />
          </Row>
        </Column>
      </Box>
    </Modal>
  );
}
