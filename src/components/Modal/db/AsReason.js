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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Column from "../../Box/Column";
import RowLabel from "../../Box/RowLabel";
import { useSnackbar } from "notistack";
import { styled } from "@mui/material/styles";
import Button from "../../Button";
import Row from "../../Box/Row";
import { ModalContext } from "../../../contexts/ModalContext";
import { LoadingButton } from "@mui/lab";
import UnderLineInput, { LabelUnderLineInput, OutLineInput } from "../../Input";
import uploadFile from "../../../utility/uploadFile";

const style = {
  width: { lg: 411, md: 411, sm: "90%", xs: "90%" },
  height: "auto",
  overflowX: "hidden",
  background: "#FFFFFF",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  padding: 5,
};

const Input = styled("input")({
  display: "none",
});

export default function AsReason({ index }) {
  const { enqueueSnackbar } = useSnackbar();
  const [reason, setReason] = useState("");
  const [_reason, _setReason] = useState("");
  const [transcript_file, setTranscriptFile] = useState("");
  const [upload_file, setUploadFile] = useState("");
  const [fileLoading, setFileLoading] = useState(false);

  const { modal, data, openModal, closeModal, modalContent } =
    useContext(ModalContext);

  const { action } = modalContent[index];

  return (
    <Modal
      open={modal[index] === "asreason" ? true : false}
      onClose={closeModal}
    >
      <Box>
        <Column alignItems={"start"} justifyContent={"start"} sx={style}>
          <Row
            justifyContent={"between"}
            sx={{ width: "100%", borderBottom: "1px solid black", pb: 1 }}
          >
            <Typography variant="h2">AS 신청사유를 입력해주세요.</Typography>
          </Row>
          <Column alignItems={"start"} sx={{ width: "100%", mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  //   checked={is_all === 1}
                  onClick={() => setReason("암, 뇌 심장 관련 치료력")}
                />
              }
              label={
                <Typography ml="-5px" variant="h6">
                  암, 뇌 심장 관련 치료력
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  //   checked={is_all === 1}
                  onClick={() => setReason("신청자 본인 설계사")}
                />
              }
              label={
                <Typography ml="-5px" variant="h6">
                  신청자 본인 설계사
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  //   checked={is_all === 1}
                  onClick={() => setReason("3")}
                />
              }
              label={
                <Typography ml="-5px" variant="h6">
                  기타(AS신청사유에 구체적으로 입력해주세요)
                </Typography>
              }
            />
            {reason === "3" && (
              <OutLineInput
                w={"100%"}
                placeholder={
                  "단순거절, 고객변심으로 인한 AS신청은 반려처리됩니다."
                }
                rows={5}
                multiline
                value={_reason}
                setValue={_setReason}
              />
            )}
            <Row
              alignItems={"center"}
              justifyContent={"start"}
              sx={{ gap: 1, mb: 2 }}
            >
              <label htmlFor="contained-button-file2">
                <Input
                  accept="audio/*"
                  id="contained-button-file2"
                  type="file"
                  onChange={(e) => {
                    setTranscriptFile(e.target.files[0]);
                  }}
                />

                <Button
                  text="파일찾기"
                  fs="h5"
                  bgColor={"gray"}
                  color={"primary.white"}
                  h={28}
                  component={"span"}
                />
              </label>

              <UnderLineInput disabled value={transcript_file?.name || ""} />
              <LoadingButton
                variant="contained"
                loading={fileLoading}
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  height: 28,
                  mt: 0.1,
                }}
                onClick={async () => {
                  if (!transcript_file)
                    return enqueueSnackbar("파일을 선택해주세요", {
                      variant: "error",
                      autoHideDuration: 2000,
                    });
                  setFileLoading(true);
                  const _uploadFile = await uploadFile(transcript_file);

                  if (_uploadFile) {
                    setUploadFile(_uploadFile);

                    setFileLoading(false);
                    if (!fileLoading) {
                      setTranscriptFile("");
                      document.querySelector("#contained-button-file").value =
                        "";

                      enqueueSnackbar("파일이 정상적으로 등록 되었습니다.", {
                        variant: "success",
                        autoHideDuration: 2000,
                      });
                    }
                  }
                }}
              >
                업로드
              </LoadingButton>
            </Row>
            {upload_file && (
              <audio controls src={upload_file} style={{ width: "100%" }}>
                Your browser does not support the
                <code>audio</code> element.
              </audio>
            )}
          </Column>
          <Row sx={{ gap: 1, mt: 3 }}>
            <Button
              variant="contained"
              bgColor="primary"
              text="신청하기"
              color="primary.white"
              fs="h5"
              w={160}
              h={30}
              action={() => {
                action(reason === "3" ? _reason : reason, upload_file);
                closeModal();
              }}
            />
            <Button
              variant="contained"
              bgColor="gray"
              text="취소"
              color="primary.white"
              fs="h5"
              w={160}
              h={30}
              action={() => {
                closeModal();
              }}
            />
          </Row>
        </Column>
      </Box>
    </Modal>
  );
}
