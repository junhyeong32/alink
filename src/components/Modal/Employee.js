import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Button, Modal, Box, Typography, Grid } from "@mui/material";
import Column from "../Box/Column";
import Row from "../Box/Row";
import ColumnLabel from "../Box/ColumnLabel";
import TextBox from "../Box/Text";
import getDepthOfTeam from "../../hooks/share/getDepthOfTeam";
import postInitPassword from "../../hooks/apManagement/postInitPassword";
import styles from "../../../styles/js/modal";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import Axios from "../../utility/api";
import getLastTeam from "../../hooks/share/getLastTeam";
import reduceImageSize from "../../utility/image";
import ImageLabel from "../Box/ImageLabel";

export default function Employee({
  index,
  modal_props,
  deleteModalList,
  addModalList,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { detail_info } = modal_props;
  const [cookies, setCookie, removeCookie] = useCookies();
  const [user_info] = useState(cookies.user_info);

  return (
    <Modal
      open={modal_props.is_open}
      onClose={() => {
        deleteModalList(index);
        !modal_props && false;
      }}
    >
      <Box
        sx={{
          width: "611px",
          height: "90%",
          ...styles.modal,
        }}
      >
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

        <Column sx={{ padding: "45px", rowGap: "10px" }}>
          <Row
            justifyContent="between"
            sx={{ pb: "6px", borderBottom: "1px solid black" }}
          >
            <Typography variant="h5">사원정보</Typography>
            <Row sx={{ columnGap: "6px" }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ width: "115px", height: "23px", borderRadius: "3px" }}
              >
                <Typography
                  variant="h6"
                  color="primary.white"
                  onClick={() => {
                    window.parent.postMessage(
                      {
                        message: "openMessageModal",
                        value: {
                          row_check: [detail_info.id],
                          row_user_info: [
                            {
                              profile_img: detail_info?.profile_image,
                              user_info:
                                "[" +
                                getLastTeam(
                                  detail_info?.region,
                                  detail_info?.studio,
                                  detail_info?.branch,
                                  detail_info?.team
                                ) +
                                "]" +
                                " " +
                                detail_info?.name +
                                " " +
                                detail_info?.rank,
                            },
                          ],
                        },
                      },
                      "*"
                    );
                  }}
                >
                  메시지 보내기
                </Typography>
              </Button>
              {user_info?.region === "본사" && (
                <Button
                  variant="contained"
                  color="red"
                  sx={{ width: "115px", height: "23px", borderRadius: "3px" }}
                >
                  <Typography
                    variant="h6"
                    color="primary.white"
                    onClick={async () => {
                      const init_password = await Axios.Post(`ap/password`, {
                        platform: "web",
                        token: cookies.access_token,
                        ap_code: modal_props?.detail_info?.code,
                      });
                      if (init_password?.code === 200) {
                        enqueueSnackbar("비밀번호가 초기화 되었습니다.", {
                          variant: "success",
                          autoHideDuration: 2000,
                        });
                      }
                    }}
                  >
                    비밀번호 초기화
                  </Typography>
                </Button>
              )}
            </Row>
          </Row>
          <Row alignItems="center" justifyContent="between">
            <div
              style={{
                backgroundImage: `url(${detail_info?.profile_image})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                objectFit: "contain",
                width: "129px",
                height: "145px",
                borderRadius: "50%",
              }}
            />
            <Column sx={{ rowGap: "10px" }}>
              <ColumnLabel
                title="소속"
                label={getDepthOfTeam(
                  detail_info?.region,
                  detail_info?.studio,
                  detail_info?.branch,
                  detail_info?.team
                )}
                width="326px"
              />
              <ColumnLabel
                title="사원명"
                label={`[${detail_info?.code}] ${detail_info?.name}`}
              />
            </Column>
          </Row>
          <Row justifyContent="between">
            <ColumnLabel
              title="주민등록번호"
              label={detail_info?.reg_number}
              width="231px"
            />
            <ColumnLabel
              title="휴대전화"
              label={detail_info?.phone}
              width="231px"
            />
          </Row>
          <Row justifyContent="between">
            <ColumnLabel
              title="이메일"
              label={detail_info?.email}
              width="231px"
            />
            <ColumnLabel
              title="전화번호"
              label={detail_info?.tel ? detail_info?.tel : "-"}
              width="231px"
            />
          </Row>
          <Row justifyContent="between">
            <ColumnLabel
              title="유치자"
              label={
                `[${detail_info?.funnels_user_code}] ` +
                detail_info?.funnels_user_name
              }
              width="231px"
            />
            <ColumnLabel
              title="CM"
              label={
                detail_info?.cm_name
                  ? `[${detail_info?.cm_code}] ` + detail_info?.cm_name
                  : "-"
              }
              width="231px"
            />
          </Row>

          <ColumnLabel
            title="주소"
            label={detail_info?.address + ", " + detail_info?.address_detail}
            width="100%"
          />
          <ColumnLabel
            title="계좌정보"
            label={
              detail_info?.bank_company +
              " / " +
              detail_info?.bank_account_number +
              " / " +
              detail_info?.bank_account_owner +
              " / " +
              detail_info?.bank_account_owner_relationship
            }
            width="100%"
          />

          <Row justifyContent="between">
            <ImageLabel
              title="서명"
              img_props={{
                img_src: detail_info?.sign_image,
                width: 131,
                height: 189,
              }}
              width="145px"
              action={() => {
                window.parent.postMessage(
                  {
                    message: "openImageModal",
                    value: reduceImageSize(detail_info?.sign_image, {
                      w: 1900,
                      q: 50,
                    }),
                  },
                  "*"
                );
              }}
            />
            <ImageLabel
              title="생명보험 등록증"
              img_props={{
                img_src: detail_info?.life_insurance_reg_image,
                width: 131,
                height: 189,
              }}
              width="145px"
              action={() => {
                window.parent.postMessage(
                  {
                    message: "openImageModal",
                    value: reduceImageSize(
                      detail_info?.life_insurance_reg_image,
                      {
                        w: 1900,
                        q: 50,
                      }
                    ),
                  },
                  "*"
                );
              }}
            />
            <ImageLabel
              title="손해보험 등록증"
              img_props={{
                img_src: detail_info?.non_life_insurance_reg_image,
                width: 131,
                height: 189,
              }}
              width="145px"
              action={() => {
                window.parent.postMessage(
                  {
                    message: "openImageModal",
                    value: reduceImageSize(
                      detail_info?.non_life_insurance_reg_image,
                      {
                        w: 1900,
                        q: 50,
                      }
                    ),
                  },
                  "*"
                );
              }}
            />
          </Row>
          <TextBox title="사원 기록" width="100%" sx={{ mt: "10px", mb: 1 }} />
          {detail_info?.logs?.map((log, log_key) => (
            <Row
              key={log_key}
              sx={{
                p: 1,
                columnGap: "20px",
              }}
            >
              <Typography
                variant="small"
                color="primary.gray"
                sx={{ whiteSpace: "nowrap" }}
              >
                {log.created_date}
              </Typography>
              <Typography variant="small">{log.message}</Typography>
            </Row>
          ))}
        </Column>
      </Box>
    </Modal>
  );
}
