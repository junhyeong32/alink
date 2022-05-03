import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import styles from "../../../styles/js/modal";
import shareStyles from "../../../styles/js/modal";
import { useEffect, useState, useContext } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  Grid,
  TextField,
  Checkbox,
} from "@mui/material";
import Column from "../Box/Column";
import Row from "../Box/Row";
import TextBox from "../Box/Text";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import getDepthOfTeam from "../../hooks/share/getDepthOfTeam";
import getLastTeam from "../../hooks/share/getLastTeam";
import Axios from "../../utility/api";
import { useCookies } from "react-cookie";
import { ModalContext } from "../../contexts/ModalContext";

const MessageBox = ({ text }) => {
  return (
    <Typography
      variant="normal"
      sx={{ wordBreak: "break-all", letterSpacing: "-0.05em" }}
    >
      {text.split("\n").map((txt) => (
        <>
          {txt}
          <br />
        </>
      ))}
    </Typography>
  );
};

export default function Message({ index, modal_props, deleteModalList }) {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [user_info] = useState(cookies.user_info);
  const { enqueueSnackbar } = useSnackbar();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { modal_list, modal_data, addModalList, addModalData } =
    useContext(ModalContext);

  useEffect(() => setMessage(""), [modal_props]);

  const handleSendMessage = async () => {
    setLoading(true);
    if (!message) {
      enqueueSnackbar("메세지를 입력해주세요.", {
        variant: "error",
        autoHideDuration: 2000,
      });
      return setLoading(false);
    }

    const res = (
      await Axios.Post("ap/message", {
        platform: "web",
        token: cookies.access_token,
        ap_codes: modal_props?.detail_info.row_check
          ? modal_props?.detail_info.row_check.filter((d, key) => d).join(",")
          : modal_props?.detail_info?.code,
        message: message,
      })
    )?.code;

    if (res === 200) {
      enqueueSnackbar("메세지가 전송되었습니다.", {
        variant: "success",
        autoHideDuration: 2000,
      });
      deleteModalList(index);
    } else {
      enqueueSnackbar(res?.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
    setLoading(false);
  };

  return (
    <Modal
      open={modal_props.is_open}
      onClose={() => {
        deleteModalList(index);
        !modal_props && false;
      }}
    >
      <Box sx={{ width: "908px", height: "90%", ...styles.modal }}>
        <Row justifyContent="end" sx={{ mb: 2, width: "100%" }}>
          <Typography component="div" sx={{ cursor: "pointer" }}>
            <Image
              src="/x.png"
              width={25}
              height={25}
              alt="colse"
              onClick={() => deleteModalList(index)}
            />
          </Typography>
        </Row>
        <Column sx={{ padding: "40px" }}>
          <Row justifyContent="between">
            <Column>
              <TextBox title="메시지 전송 대상" width="375px" />
              <Column
                sx={{
                  rowGap: "11px",
                  mt: "15px",
                  height: "316px",
                  // ...shareStyles.scrollbar,
                  overflowY: "scroll",
                  msOverflowStyle: "none !important",
                  scrollbarWidth: "none !important",
                  "&::-webkit-scrollbar": { display: "none" },
                }}
              >
                {modal_props?.detail_info?.row_user_info ? (
                  modal_props?.detail_info?.row_user_info?.map((info, key) => {
                    if (info)
                      return (
                        <Row
                          key={key}
                          sx={{ columnGap: "15px" }}
                          alignItems="center"
                        >
                          <Checkbox
                            // onClick={(e) => {
                            //   setRowCheck(() => {
                            //     const new_row_check = [...row_check];

                            //     if (!e.target.checked) {
                            //       delete new_row_check[key];
                            //     } else {
                            //       new_row_check[key] = list?.code;
                            //     }

                            //     return new_row_check;
                            //   });
                            // }}
                            sx={{ padding: 0 }}
                            icon={
                              <Image
                                src={`/web_unchecked.png`}
                                width={22}
                                height={22}
                                alt=""
                              />
                            }
                            checkedIcon={
                              <Image
                                src={`/web_checked.png`}
                                width={22}
                                height={22}
                                alt=""
                              />
                            }
                            value={modal_props?.detail_info?.row_check[key]}
                            checked={
                              modal_props?.detail_info?.row_check[key]
                                ? true
                                : false
                            }
                          />
                          <div
                            style={{
                              backgroundImage: `url(${info?.profile_img})`,
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "cover",
                              objectFit: "contain",
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                            }}
                          />

                          <Typography variant="small">
                            {info?.user_info}
                          </Typography>
                        </Row>
                      );
                  })
                ) : (
                  <Row sx={{ columnGap: "15px" }} alignItems="center" key={key}>
                    <Checkbox
                      // onClick={(e) => {
                      //   setRowCheck(() => {
                      //     const new_row_check = [...row_check];

                      //     if (!e.target.checked) {
                      //       delete new_row_check[key];
                      //     } else {
                      //       new_row_check[key] = list?.code;
                      //     }

                      //     return new_row_check;
                      //   });
                      // }}
                      sx={{ padding: 0 }}
                      icon={
                        <Image
                          src={`/web_unchecked.png`}
                          width={22}
                          height={22}
                          alt=""
                        />
                      }
                      checkedIcon={
                        <Image
                          src={`/web_checked.png`}
                          width={22}
                          height={22}
                          alt=""
                        />
                      }
                      value={modal_props?.detail_info}
                      checked={modal_props?.detail_info ? true : false}
                    />
                    <div
                      style={{
                        backgroundImage: `url(${modal_props?.detail_info?.profile_image})`,
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        objectFit: "contain",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                      }}
                    />

                    <Typography variant="small">
                      {"[" +
                        getLastTeam(
                          modal_props?.detail_info?.region,
                          modal_props?.detail_info?.studio,
                          modal_props?.detail_info?.branch,
                          modal_props?.detail_info?.team
                        ) +
                        "]" +
                        " " +
                        modal_props?.detail_info?.name +
                        " " +
                        modal_props?.detail_info?.rank}
                    </Typography>
                  </Row>
                )}
              </Column>
            </Column>
            <Column>
              <TextBox title="보낼 메시지" width="375px" />
              <Column sx={{ ml: 1, mt: 1, mb: 2 }}>
                <Typography variant="h6" color="primary.gray">
                  명령어
                </Typography>
                <Typography variant="small" color="primary.gray">
                  {`{사원명}`}: 사원명으로 대체합니다.
                  <br />
                  {`{직급}`}: 직급으로 대체합니다.
                  <br />
                  {`{직책}`}: 직책으로 대체합니다.
                </Typography>
              </Column>
              <TextField
                variant="outlined"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                name="message"
                sx={{
                  borderRadius: "3px",
                  fontSize: "15px",
                  lineHeight: "18px",
                  letterSpacing: "-0.05em",
                }}
                multiline
                rows={6}
                mt={1}
              />
              <LoadingButton
                variant="contained"
                color="primary"
                sx={{ fontSize: "15px", fontWeight: "bold", mt: 2 }}
                loading={loading}
                onClick={handleSendMessage}
              >
                메시지 전송
              </LoadingButton>
            </Column>
          </Row>
          <Column sx={{ mt: 1 }}>
            <TextBox title="미리보기" width="100%" />
            <Row justifyContent="between" sx={{ mt: "11px" }}>
              <Typography component="div" sx={styles.ios}>
                <Typography component="div" sx={styles.ios_message_box}>
                  <Row alignItems="center" sx={{ columnGap: "6px" }}>
                    <Image
                      src="/logo.png"
                      width={15}
                      height={15}
                      alt=""
                      layout="fixed"
                    />
                    <Typography variant="small" color="primary.blue">
                      AFG
                    </Typography>
                    <Typography variant="small" color="primary.lightBlack">
                      now
                    </Typography>
                  </Row>
                  <Column sx={{ mt: 2 }}>
                    <Typography variant="h5">
                      [
                      {getDepthOfTeam(
                        user_info?.region,
                        user_info?.studio,
                        user_info?.branch,
                        user_info?.team
                      )}
                      ] {user_info?.name} {user_info?.rank}
                    </Typography>
                    {<MessageBox text={message} />}
                  </Column>
                </Typography>
              </Typography>
              <Typography component="div" sx={styles.android}>
                <Typography component="div" sx={styles.android_message_box}>
                  <Row>
                    <Image
                      src="/logo.png"
                      width={38}
                      height={38}
                      alt=""
                      layout="fixed"
                    />
                  </Row>
                  <Column
                    justifyContent="start"
                    sx={{ ml: 1, width: "100%", height: "100%" }}
                  >
                    <Row justifyContent="between">
                      <Typography variant="h5">
                        [
                        {getDepthOfTeam(
                          user_info?.region,
                          user_info?.studio,
                          user_info?.branch,
                          user_info?.team
                        )}
                        ] {user_info?.name} {user_info?.rank}
                      </Typography>
                      <Typography variant="h6" color="primary.gray">
                        now
                      </Typography>
                    </Row>
                    {<MessageBox text={message} />}
                  </Column>
                </Typography>
              </Typography>
            </Row>
          </Column>
        </Column>
      </Box>
    </Modal>
  );
}
