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
import { Button, Modal, Box, Typography, Grid } from "@mui/material";
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
    <Modal
      open={modal_props.is_open}
      onClose={() => {
        deleteModalList(index);
        !modal_props && false;
      }}
      sx={{ overflowY: "scroll" }}
      onKeyDown={(e) => {
        if (e.which === 39) {
          document.getElementsByClassName("next_button")[0].click();
          if (slide_index === 2) {
            setAction("next");
            setSlideIndex(0);
          }
        } else if (e.which === 37) {
          document.getElementsByClassName("prev_button")[0].click();
          if (slide_index === 0) {
            setAction("prev");
            setSlideIndex(2);
          }
        }
      }}
    >
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
          <Row
            alignItems={"start"}
            justifyContent="center"
            sx={{ padding: "23px 0 16px 0", gap: "32px" }}
          >
            <Column alignItems="start" sx={{ rowGap: "10px" }}>
              <TextBox title="계약정보" width="472px" />
              {/* {(!(new_data ? new_data : detail_info)?.signed || !(new_data ? new_data : detail_info)?.matched) && (
                <Row sx={{ width: "100%", columnGap: "7px", pl: "9.6px" }}>
                  <Image src="/not_match.png" width={14} height={14} alt="" />
                  <Typography variant="small">
                    계약과 매칭되지 않은 확인서입니다.
                  </Typography>
                </Row>
              )} */}

              <RowLabel
                title="구분"
                label={
                  (new_data ? new_data : detail_info)?.type === "write"
                    ? "직접생성"
                    : "촬영생성"
                }
                width="285px"
              />
              <RowLabel
                title="계약자명"
                label={(new_data ? new_data : detail_info)?.contractor?.name}
                width="285px"
              />
              <RowLabel
                title="연락처"
                label={(new_data ? new_data : detail_info)?.contractor?.phone}
                width="285px"
              />
              <RowLabel
                title="청약번호"
                label={(new_data ? new_data : detail_info)?.subscription_number}
                width="285px"
              />
              <RowLabel
                title="증권번호"
                label={(new_data ? new_data : detail_info)?.stock_number}
                width="285px"
              />
              <RowLabel
                title="생성일"
                label={(new_data ? new_data : detail_info)?.created_date}
                width="285px"
              />
              <RowLabel
                title="계약일"
                label={
                  new_data
                    ? new_data?.contract_date
                    : (new_data ? new_data : detail_info)?.contract_date
                }
                width="285px"
              />

              <TextBox title="설계사 정보" width="472px" sx={{ mt: 2 }} />
              <RowLabel
                title="소속"
                label={getDepthOfTeam(
                  (new_data ? new_data : detail_info)?.recruiter?.region,
                  (new_data ? new_data : detail_info)?.recruiter?.studio,
                  (new_data ? new_data : detail_info)?.recruiter?.branch,
                  (new_data ? new_data : detail_info)?.recruiter?.team
                )}
                width="285px"
              />
              <RowLabel
                title="설계사명"
                label={
                  `[${(new_data ? new_data : detail_info)?.recruiter?.code}] ` +
                  (new_data ? new_data : detail_info)?.recruiter?.name
                }
                width="285px"
              />
              <TextBox title="청약상품" width="472px" />

              <Column>
                <img
                  src={
                    (new_data ? new_data : detail_info)?.insurance?.company_logo
                  }
                  style={{ width: "50%", height: "auto" }}
                />
                <Typography variant="normal" mt={1} className="text_line1">
                  {(new_data ? new_data : detail_info)?.insurance?.product_name}
                </Typography>
              </Column>

              <TextBox title="비교상품" width="472px" />
              <Column>
                <img
                  src={
                    (new_data ? new_data : detail_info)?.insurance_compare_1
                      ?.company_logo
                  }
                  style={{ width: "50%", height: "auto" }}
                />

                <Typography variant="normal" mt={1} className="text_line1">
                  {
                    (new_data ? new_data : detail_info)?.insurance_compare_1
                      ?.product_name
                  }
                </Typography>
              </Column>
              <Column>
                <img
                  src={
                    (new_data ? new_data : detail_info)?.insurance_compare_2
                      ?.company_logo
                  }
                  style={{ width: "50%", height: "auto" }}
                />
                <Typography variant="normal" mt={1} className="text_line1">
                  {
                    (new_data ? new_data : detail_info)?.insurance_compare_2
                      ?.product_name
                  }
                </Typography>
              </Column>
              <TextBox title="확인서 기록" width="100%" sx={{ mt: 4, mb: 1 }} />
              {(new_data ? new_data : detail_info)?.logs?.map(
                (log, log_key) => (
                  <Row
                    key={log_key}
                    sx={{
                      p: 1,
                      columnGap: "20px",
                      width: "472px",
                    }}
                  >
                    <Typography variant="small" color="primary.gray">
                      {log?.created_date}
                    </Typography>
                    <Typography variant="small">{log?.message}</Typography>
                  </Row>
                )
              )}
            </Column>

            <Column alignItems={"center"} sx={{ rowGap: "12px" }}>
              <TextBox
                title="확인서"
                subtitle={`서명일 ${
                  (new_data ? new_data : detail_info)?.sign_date === null
                    ? "-"
                    : (new_data ? new_data : detail_info)?.sign_date
                }`}
                width="565px"
              />
              <Column
                alignItems="center"
                justifyContent="center"
                sx={{ width: "100%", cursor: "pointer" }}
              >
                <Carousel
                  animation={action ? "fade" : "zoom"}
                  cellAlign="center"
                  wrapAround
                  defaultControlsConfig={{
                    pagingDotsStyle: {
                      display: "none",
                    },
                  }}
                  slideIndex={slide_index}
                  // afterSlide={(slideIndex) => {
                  //   console.log("슬라이드", slide_index, slideIndex);
                  //   setSlideIndex(slideIndex);
                  //   // if (slide_index !== slideIndex) {
                  //   //   setSlideIndex(slide_index);
                  //   // }
                  // }}
                  // beforeSlide={(slideIndex) => {
                  //   setSlideIndex(slideIndex);
                  //   // if (slide_index !== slideIndex) {
                  //   //   setSlideIndex(slide_index);
                  //   // }
                  // }}
                  renderCenterLeftControls={({ previousSlide, goToSlide }) => (
                    <Button
                      className="prev_button"
                      sx={{
                        top: "50%",
                        left: "-610px",
                      }}
                      onClick={(e) => {
                        goToSlide(slide_index - 1);
                        setSlideIndex(slide_index - 1);

                        if (slide_index === 0) {
                          setAction("prev");
                          goToSlide(2);
                          setSlideIndex(2);
                        }
                      }}
                    >
                      <Image src="/prev_button.png" width={21} height={32} />
                    </Button>
                  )}
                  renderCenterRightControls={({ nextSlide, goToSlide }) => (
                    <Button
                      className="next_button"
                      sx={{
                        top: "50%",
                        right: "-105px",
                      }}
                      onClick={() => {
                        goToSlide(slide_index + 1);
                        setSlideIndex(slide_index + 1);

                        if (slide_index === 2) {
                          setAction("next");
                          goToSlide(0);
                          setSlideIndex(0);
                        }
                      }}
                    >
                      <Image src="/next_button.png" width={21} height={32} />
                    </Button>
                  )}
                >
                  {(new_data ? new_data : detail_info)?.document?.privacy && (
                    <Image
                      src={
                        (new_data ? new_data : detail_info)?.document?.privacy
                      }
                      width={460}
                      height={614}
                      alt=""
                      layout="fixed"
                      onClick={() =>
                        window.parent.postMessage(
                          {
                            message: "openImageModal",
                            value: reduceImageSize(
                              (new_data ? new_data : detail_info)?.document
                                ?.privacy,
                              {
                                w: 1900,
                                q: 50,
                              }
                            ),
                          },
                          "*"
                        )
                      }
                    />
                  )}
                  {(new_data ? new_data : detail_info)?.document
                    ?.compare_insurance && (
                    <Image
                      src={
                        (new_data ? new_data : detail_info)?.document
                          ?.compare_insurance
                      }
                      width={460}
                      height={614}
                      alt=""
                      layout="fixed"
                      onClick={() =>
                        window.parent.postMessage(
                          {
                            message: "openImageModal",
                            value: reduceImageSize(
                              (new_data ? new_data : detail_info)?.document
                                ?.compare_insurance,
                              {
                                w: 1900,
                                q: 50,
                              }
                            ),
                          },
                          "*"
                        )
                      }
                    />
                  )}
                  {(new_data ? new_data : detail_info)?.document?.finance && (
                    <Image
                      src={
                        (new_data ? new_data : detail_info)?.document?.finance
                      }
                      width={460}
                      height={614}
                      alt=""
                      layout="fixed"
                      onClick={() =>
                        window.parent.postMessage(
                          {
                            message: "openImageModal",
                            value: reduceImageSize(
                              (new_data ? new_data : detail_info)?.document
                                ?.finance,
                              {
                                w: 1900,
                                q: 50,
                              }
                            ),
                          },
                          "*"
                        )
                      }
                    />
                  )}
                </Carousel>

                <Row sx={{ columnGap: "14px", mt: 1.8 }}>
                  {(new_data ? new_data : detail_info)?.document?.privacy && (
                    <ImageTextBox
                      img_src={
                        (new_data ? new_data : detail_info)?.document?.privacy
                      }
                      button_text="다운로드"
                      action={() => {
                        if (slide_index === 0) return;
                        if (slide_index === 1) {
                          document
                            .getElementsByClassName("prev_button")[0]
                            .click();
                        }

                        if (slide_index === 2) {
                          document
                            .getElementsByClassName("prev_button")[0]
                            .click();

                          setTimeout(() => {
                            document
                              .getElementsByClassName("prev_button")[0]
                              .click();
                          }, 100);
                        }
                      }}
                      text={
                        <Typography variant="h6" align="center">
                          금융소비자보호법 <br /> 이행 확인서
                        </Typography>
                      }
                      img_id={0}
                      button_action="download"
                      slideIndex={slide_index}
                    />
                  )}
                  {(new_data ? new_data : detail_info)?.document
                    ?.compare_insurance && (
                    <ImageTextBox
                      img_src={
                        detail_info &&
                        (new_data ? new_data : detail_info)?.document
                          ?.compare_insurance
                      }
                      button_text="다운로드"
                      text={
                        <Typography variant="h6" align="center">
                          상품비교 <br /> 설명확인서
                        </Typography>
                      }
                      img_id={1}
                      action={() => {
                        if (slide_index === 0) {
                          document
                            .getElementsByClassName("next_button")[0]
                            .click();
                        }
                        if (slide_index === 1) return;
                        if (slide_index === 2) {
                          document
                            .getElementsByClassName("prev_button")[0]
                            .click();
                        }
                      }}
                      button_action="download"
                      slideIndex={slide_index}
                    />
                  )}
                  {(new_data ? new_data : detail_info)?.document?.finance && (
                    <ImageTextBox
                      img_src={
                        detail_info &&
                        (new_data ? new_data : detail_info)?.document?.finance
                      }
                      button_text="다운로드"
                      text={
                        <Typography variant="h6" align="center">
                          개인정보 <br /> 활용동의서
                        </Typography>
                      }
                      img_id={2}
                      button_action="download"
                      action={() => {
                        if (slide_index === 0) {
                          document
                            .getElementsByClassName("next_button")[0]
                            .click();

                          setTimeout(() => {
                            document
                              .getElementsByClassName("next_button")[0]
                              .click();
                          }, 100);
                        }
                        if (slide_index === 1) {
                          document
                            .getElementsByClassName("next_button")[0]
                            .click();
                        }

                        if (slide_index === 2) return;
                      }}
                      slideIndex={slide_index}
                    />
                  )}
                </Row>
                <Row sx={{ mt: "14px", gap: "25px" }}>
                  {!(new_data ? new_data : detail_info)?.matched ? (
                    <LoadingButton
                      variant="contained"
                      color="primary"
                      sx={{ width: "146px", borderRadius: "0px", height: 28 }}
                      onClick={async () => {
                        setLoading(true);
                        const res = (
                          await Axios.Post("document/check-again", {
                            platform: "web",
                            token: cookies.access_token,
                            document_codes: (new_data ? new_data : detail_info)
                              ?.code,
                          })
                        )?.code;

                        if (res === 200) {
                          enqueueSnackbar("재확인 알림이 전송되었습니다.", {
                            variant: "success",
                            autoHideDuration: 2000,
                          });
                        }
                        setLoading(false);
                      }}
                      loading={loading}
                    >
                      {!loading && (
                        <Typography variant="h6" color="primary.white">
                          재확인 알림 전송
                        </Typography>
                      )}
                    </LoadingButton>
                  ) : !(new_data ? new_data : detail_info)?.signed ? (
                    <Typography variant="normal" color="primary">
                      미서명된 확인서입니다.
                    </Typography>
                  ) : (new_data ? new_data : detail_info)?.type === "camera" &&
                    (new_data ? new_data : detail_info)?.status ===
                      "확인필요" ? (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          width: "146px",
                          heigth: "27px",
                          borderRadius: 0,
                        }}
                        onClick={() => {
                          window.parent.postMessage(
                            {
                              message: "openImproveModal",
                              value: (new_data ? new_data : detail_info)?.code,
                            },
                            "*"
                          );
                        }}
                      >
                        <Typography variant="h6" color="primary.white">
                          보완
                        </Typography>
                      </Button>
                      <Button
                        variant="contained"
                        color="green"
                        sx={{
                          width: "146px",
                          heigth: "27px",
                          borderRadius: 0,
                        }}
                        onClick={async () => {
                          setConfrmLoading(true);

                          const res = (
                            await Axios.Post("document/confirm", {
                              platform: "web",
                              token: cookies.access_token,
                              document_codes: (new_data
                                ? new_data
                                : detail_info
                              )?.code,
                            })
                          )?.code;

                          if (res === 200) {
                            enqueueSnackbar("확인완료 되었습니다.", {
                              variant: "success",
                              autoHideDuration: 2000,
                            });
                          }
                          setConfrmLoading(false);
                        }}
                      >
                        {!confirmLoading && (
                          <Typography variant="h6" color="primary.white">
                            확인완료
                          </Typography>
                        )}
                      </Button>
                    </>
                  ) : (new_data ? new_data : detail_info)?.type === "camera" &&
                    (new_data ? new_data : detail_info)?.status === "보완" ? (
                    <Typography variant="normal" color="primary">
                      보완이 요청된 확인서입니다.
                    </Typography>
                  ) : (
                    <Typography variant="normal" color="primary">
                      최종 완료된 확인서입니다.
                    </Typography>
                  )}
                </Row>
              </Column>
            </Column>
          </Row>
        </Column>
      </Box>
    </Modal>
  );
}
