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
import { LoadingButton } from "@mui/lab";
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
import { styled } from "@mui/material/styles";
import Axios from "../../../utility/api";
import { getAccessToken } from "../../../utility/getCookie";
import { useRouter } from "next/router";
import { FileDrop } from "react-file-drop";

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

const Input = styled("input")({
  display: "none",
});

export default function Upload({ index }) {
  const [cookies, setCookie, removeCookie] = useCookies();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const { modal, openModal, closeModal, modalContent } =
    useContext(ModalContext);
  const {
    title,
    download,
    choiceFile,
    uploadFIle,
    uploadUrl,
    is_sample,
    fileType,
    data,
    reload,
  } = modalContent[index];

  console.log(file);

  return (
    <Modal open={modal[index] === "upload"} onClose={closeModal}>
      <Box>
        <Column alignItems={"start"} justifyContent={"center"} sx={style}>
          <FileDrop onDrop={(files, event) => setFile(files[0])}>
            <Typography variant="h3" mb={1}>
              {title}
            </Typography>
            {is_sample && (
              <Row
                alignItems={"center"}
                w={430}
                sx={{
                  width: "100%",
                  pl: 3,
                  position: "relative",
                  borderTop: "2px solid black",
                  borderBottom: "2px solid black",
                  height: 58,
                  mb: "-12px",
                }}
              >
                <Typography
                  variant="h4"
                  align="left"
                  sx={{ minWidth: "45px", mr: 5.2 }}
                >
                  Sample
                </Typography>
                <Divider
                  vertical
                  sx={{
                    height: "100%",
                    mr: 2.8,
                    borderLeft: "1px solid black",
                  }}
                />
                <Button
                  variant="contained"
                  text="다운로드"
                  fs="h6"
                  action={async (e) => {
                    e.preventDefault();
                    window.open(
                      `https://alinkapi.afg.kr/api/v1/db/menu/sample/${
                        router.query.menu
                      }?token=${getAccessToken()}`
                    );
                  }}
                />
              </Row>
            )}
            <Row
              alignItems={"center"}
              sx={{
                pl: 3,
                borderBottom: "2px solid black",
                borderTop: !is_sample && "2px solid black",
                width: "100%",
                height: 70,
              }}
            >
              <Typography
                variant="h4"
                sx={{ mr: "41.92px", whiteSpace: "nowrap" }}
              >
                DB 파일
              </Typography>
              <Divider
                vertical
                sx={{
                  height: "100%",
                  mr: 2.8,
                  borderLeft: "1px solid black",
                }}
              />

              <Row
                alignItems={"center"}
                sx={{
                  width: "219px",
                  height: "36px",
                  background: "#E6E6E6",
                  borderRadius: " 5px",
                  p: 1,
                  mr: 3,
                }}
              >
                <Typography
                  variant="small"
                  component={"div"}
                  sx={{
                    width: "219px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {file
                    ? file.name
                    : fileType
                    ? `오디오 ${fileType} 파일만 등록가능`
                    : "엑셀(.xlsx, .xls) 파일만 등록가능"}
                </Typography>
              </Row>
              <label htmlFor="contained-button-file">
                <Input
                  accept={
                    fileType
                      ? fileType
                      : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  }
                  multiple={fileType ? true : false}
                  id="contained-button-file"
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <Button
                  variant="contained"
                  component="span"
                  text="파일선택"
                  fs="h6"
                />
              </label>
            </Row>
            <Row
              justifyContent={"center"}
              sx={{ width: "100%", mt: 2.7, gap: 5 }}
            >
              <LoadingButton
                variant="contained"
                color="primary"
                loading={loading}
                sx={{ width: 166, height: 50 }}
                onClick={async () => {
                  if (!file)
                    return enqueueSnackbar("파일을 업로드 해주세요.", {
                      variant: "error",
                      autoHideDuration: 2000,
                    });
                  setLoading(true);

                  const formData = new FormData();

                  formData.append("token", getAccessToken());
                  formData.append("file", file);
                  data && formData.append("organization_code", data);
                  const config = {
                    headers: {
                      "content-type": "multipart/form-data",
                    },
                  };

                  const upload = uploadUrl
                    ? await Axios.Post(uploadUrl, formData, config)
                    : await Axios.Post(
                        `document/upload-excel`,
                        formData,
                        config
                      );

                  if (upload?.code === 200) {
                    enqueueSnackbar("파일이 업로드 되었습니다.", {
                      variant: "success",
                      autoHideDuration: 2000,
                    });
                    reload && reload();

                    closeModal(index);
                    setLoading(true);
                  } else if (upload?.code === 500) {
                    setLoading(false);
                    openModal({
                      modal: "needconfirm",
                      content: {
                        buttonText: "확인",
                        action: () => closeModal(1, 1),
                        contents: (
                          <Column>
                            {upload?.message.map((m, key) => (
                              <Typography key={key}>{m}</Typography>
                            ))}
                          </Column>
                        ),
                      },
                    });
                  }
                }}
              >
                {!loading && <Typography variant="h4">파일 업로드</Typography>}
              </LoadingButton>
              <Button
                text="취소"
                variant="contained"
                bgColor="gray"
                fs="h4"
                w={166}
                h={50}
                action={closeModal}
              ></Button>
            </Row>
          </FileDrop>
        </Column>
      </Box>
    </Modal>
  );
}
