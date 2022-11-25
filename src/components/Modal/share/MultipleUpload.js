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
  LinearProgress,
} from "@mui/material";
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
import { getCookie } from "../../../utility/getCookie";
import { FileDrop } from "react-file-drop";

const style = {
  width: { lg: "715px", md: "715px", sm: "715px", xs: "90%" },
  minHeight: 322,
  height: "auto",
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

export default function MultipleUpload({ index }) {
  const [cookies, setCookie, removeCookie] = useCookies();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [user_info] = useState(getCookie("user_info"));
  const [file, setFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const { modal, closeModal, modalContent } = useContext(ModalContext);
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

  const [count, setCount] = useState(0);
  const d = file.flat([1]);
  console.log(file);

  return (
    <Modal open={modal[index] === "multipleupload"} onClose={closeModal}>
      <Box>
        <Column alignItems={"start"} justifyContent={"between"} sx={style}>
          <FileDrop onDrop={(files, event) => setFile([...file, [...files]])}>
            <Column sx={{ width: "100%" }}>
              <Row
                alignItems={"center"}
                justifyContent={"between"}
                sx={{
                  width: "100%",
                  borderBottom: "1px solid black",
                  pb: 1,
                  gap: 2,
                }}
              >
                <Typography variant="h2">{title}</Typography>
                <label htmlFor="contained-button-file">
                  <Input
                    accept={"audio/*"}
                    multiple
                    id="contained-button-file"
                    type="file"
                    onChange={(e) => setFile([...file, [...e.target.files]])}
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
                wrap={"wrap"}
                justifyContent={"start"}
                sx={{ mt: 2, gap: 1, overflowY: "scroll", gap: 1 }}
              >
                {file.map((d, k) =>
                  d?.map((f, key) => {
                    return (
                      <Row alignItems={"center"} key={key} sx={{ gap: 2 }}>
                        <Typography variant="h6">- {f?.name}</Typography>
                        <Image
                          src="/black_x.png"
                          width={10}
                          height={10}
                          alt="x"
                          layout="fixed"
                          className="cursor"
                          onClick={() =>
                            setFile((prev) => {
                              const newData = [...prev];

                              newData[k].splice(key, 1);
                              return newData;
                            })
                          }
                        />
                      </Row>
                    );
                  })
                )}
              </Row>
            </Column>

            <Row
              justifyContent={"center"}
              sx={{ width: "100%", mt: 2.7, gap: 5 }}
            >
              {loading ? (
                <LinearProgress
                  sx={{ width: "100%" }}
                  value={((count / d.length) * 100).toFixed(0)}
                  variant="determinate"
                />
              ) : (
                <>
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    loading={loading}
                    sx={{ width: 166, height: 35 }}
                    onClick={async () => {
                      if (file.length === 0)
                        return enqueueSnackbar("파일을 업로드 해주세요.", {
                          variant: "error",
                          autoHideDuration: 2000,
                        });
                      setLoading(true);

                      for (let f of d) {
                        if (f.type.split("/")[0] !== "audio") {
                          setLoading(false);
                          return enqueueSnackbar(
                            "형식이 맞지 않는 파일이 존재합니다",
                            {
                              variant: "error",
                              autoHideDuration: 2000,
                            }
                          );
                        }

                        const formData = new FormData();
                        formData.append("token", getAccessToken());
                        formData.append("file", f);
                        formData.append(
                          "prefix",
                          user_info?.grade === "협력사"
                            ? `cooperation|`
                            : user_info?.grade === "관리자" ||
                              user_info?.grade === "부관리자"
                            ? `manager|`
                            : `user|`
                        );
                        const config = {
                          headers: {
                            "content-type": "multipart/form-data",
                          },
                        };

                        const res = (
                          await Axios.Post("upload", formData, config)
                        )?.code;
                        if (res?.code === 200) setCount(count + 1);
                      }

                      setLoading(false);
                      enqueueSnackbar("파일이 업로드 되었습니다.", {
                        variant: "success",
                        autoHideDuration: 2000,
                      });

                      // reload && reload();

                      if (((count / d.length) * 100).toFixed(0) === 100)
                        closeModal(index);
                    }}
                  >
                    {!loading && (
                      <Typography variant="h4">파일 업로드</Typography>
                    )}
                  </LoadingButton>
                  <Button
                    text="취소"
                    variant="contained"
                    bgColor="gray"
                    fs="h4"
                    w={166}
                    h={35}
                    action={closeModal}
                  ></Button>
                </>
              )}
            </Row>
          </FileDrop>
        </Column>
      </Box>
    </Modal>
  );
}
