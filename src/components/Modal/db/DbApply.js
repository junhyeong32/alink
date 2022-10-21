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
  Pagination,
} from "@mui/material";
import Column from "../../Box/Column";
import RowLabel from "../../Box/RowLabel";
import { useSnackbar } from "notistack";
import Button from "../../Button";
import Row from "../../Box/Row";
import { ModalContext } from "../../../contexts/ModalContext";
import { LabelUnderLineInput } from "../../Input";
import { getAccessToken, getCookie } from "../../../utility/getCookie";
import { useRouter } from "next/router";
import moment from "moment";
import RoundColorBox from "../../Box/RoundColorBox";
import Axios from "../../../utility/api";

const style = {
  width: { lg: 1000, md: 1000, sm: "90%", xs: "90%" },
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

export default function DbApply({ index }) {
  const [select, setSelect] = useState("");
  const router = useRouter();
  const [user_info] = useState(getCookie("user_info"));
  const { enqueueSnackbar } = useSnackbar();

  const [resultDb, setResultDb] = useState([]);
  const [db_count, setDbCount] = useState([]);
  const [next_db_count, setNextDbCount] = useState([]);
  const [dbChangeLoading, setDbChangeLoading] = useState(true);

  const weekdayOf27 = moment(moment().format("yyyy-MM-27")).weekday();
  const day = 27 - (weekdayOf27 === 6 || weekdayOf27 === 0 ? 1 : 0);

  const { modal, data, openModal, closeModal, modalContent } =
    useContext(ModalContext);

  const { menus, changeDb, setChangeDb, noneChangeDb, user } = data[index];

  useEffect(() => {
    if (dbChangeLoading) return;
    console.log("hi");
    const dbApply = async () => {
      const res = await Axios.Post("user/db/count", {
        token: getAccessToken(),
        db: [...resultDb, ...noneChangeDb],
      });

      if (res?.code === 200) {
        enqueueSnackbar("익월db가 신청되었습니다.", {
          variant: "success",
          autoHideDuration: 2000,
        });
        router.reload();
      }
    };

    dbApply();
  }, [dbChangeLoading]);

  return (
    <Modal
      open={modal[index] === "dbapply" ? true : false}
      onClose={closeModal}
    >
      <Box>
        <Column alignItems={"start"} justifyContent={"start"} sx={style}>
          <Row justifyContent={"between"} sx={{ width: "100%" }}>
            <Typography variant="h2">익월DB 신청하기</Typography>
            <Image
              src="/black_x.png"
              width={15}
              height={15}
              alt="x"
              layout="fixed"
              className="cursor"
              onClick={closeModal}
            />
          </Row>
          <Column alignItems={"center"} sx={{ mt: 5, gap: 3 }}>
            {menus?.map((menu, key) => (
              <Column key={key}>
                <RowLabel
                  label={menu?.title}
                  fs="h4"
                  label_w={83}
                  sx={{ gap: 10 }}
                >
                  <Row alignItems={"end"} sx={{ gap: 1 }}>
                    <LabelUnderLineInput
                      w={90}
                      defaultValue={0}
                      onBlur={(e) =>
                        setNextDbCount((prev) => {
                          const newData = [...prev];

                          newData[key] = e.target.value;

                          return newData;
                        })
                      }
                    />
                    <Typography variant="h6" pl={1}>
                      개
                    </Typography>
                  </Row>
                  <Row wrap={"wrap"} sx={{ gap: 1 }}>
                    <Typography variant="h4" mr={3}>
                      담당 지역
                    </Typography>
                    <RoundColorBox
                      background={
                        changeDb[key]?.geomap.length === menu?.geomap?.length
                          ? "#0D1D41"
                          : "#E6E6E6"
                      }
                      fc={
                        changeDb[key]?.geomap.length === menu?.geomap?.length
                          ? "#FFFFFF"
                          : "#000000"
                      }
                      fs={12}
                      sx={{ maxWidth: 100, gap: 1, cursor: "pointer" }}
                      onClick={() =>
                        setChangeDb((prev) => {
                          const newData = [...prev];

                          if (
                            newData[key].geomap.length < menu?.geomap?.length
                          ) {
                            newData[key].geomap = [];

                            menu?.geomap?.map((map) =>
                              newData[key].geomap?.push({ name: map?.name })
                            );
                          } else {
                            newData[key].geomap = [];
                          }

                          return newData;
                        })
                      }
                    >
                      전국
                    </RoundColorBox>

                    {menu?.geomap?.map((map, area_key) => (
                      <RoundColorBox
                        key={area_key}
                        background={
                          changeDb[key]?.geomap?.find(
                            (d) => d?.name === map?.name
                          )
                            ? "#0D1D41"
                            : "#E6E6E6"
                        }
                        fc={
                          changeDb[key]?.geomap?.find(
                            (d) => d?.name === map?.name
                          )
                            ? "#FFFFFF"
                            : "#000000"
                        }
                        fs={12}
                        sx={{ maxWidth: 100, gap: 1, cursor: "pointer" }}
                        onClick={() =>
                          setChangeDb((prev) => {
                            const newData = [...prev];
                            const newDataGeo = newData[key].geomap;

                            const foundIndex = newDataGeo?.findIndex(
                              (d) => d?.name === map?.name
                            );

                            if (foundIndex === -1) {
                              newDataGeo.push({ name: map?.name });
                            } else {
                              newDataGeo.splice(foundIndex, 1);
                            }

                            return newData;
                          })
                        }
                      >
                        {map?.name}
                      </RoundColorBox>
                    ))}
                  </Row>
                </RowLabel>
              </Column>
            ))}

            <Button
              variant="contained"
              bgColor="primary"
              text="익월DB 신청"
              color="primary.white"
              fs="h5"
              w={160}
              h={30}
              sx={{ mt: 7 }}
              action={() => {
                openModal({
                  modal: "guide",
                  data: menus,
                  content: {
                    close: false,
                    action: () => {
                      console.log("stasrt");
                      setResultDb((prev) => {
                        let newData = [...changeDb];

                        changeDb?.map(
                          (db, key) =>
                            (newData[key] = {
                              ...newData[key],
                              allocation: [
                                {
                                  ...newData[key]?.allocation[0],
                                  count:
                                    Number(db?.allocation[0]?.count) +
                                    (Number(db_count[key])
                                      ? Number(db_count[key])
                                      : 0),
                                  count_for_next_month:
                                    Number(
                                      db?.allocation[0]?.count_for_next_month
                                    ) +
                                    (Number(next_db_count[key])
                                      ? Number(next_db_count[key])
                                      : 0),
                                },
                              ],
                            })
                        );

                        return newData;
                      });

                      setDbChangeLoading(false);
                    },
                    buttonText: "확인",
                    guideText:
                      user_info?.name +
                      " " +
                      user_info?.grade +
                      " " +
                      (new Date().getMonth() + 1) +
                      "월 DB신청현황",
                    contents: (
                      <Typography variant="h4">
                        {
                          <>
                            {menus
                              ?.map((menu, key) => {
                                return user?.db?.find(
                                  (db) => db?.pk === menu.pk
                                );
                              })
                              ?.map(
                                (d, key) =>
                                  d?.title.split("리스트")[0] +
                                  " " +
                                  (next_db_count[key]
                                    ? Number(
                                        d?.allocation?.count_for_next_month
                                      ) + Number(next_db_count[key])
                                    : "0") +
                                  "개 "
                              )}
                            <br />
                            <br />
                            <Typography variant="small" align="cetner">
                              신청하신 수량에 대하여 다음 달 1일에 자동
                              반영됩니다. <br /> 신청취소 및 수량 수정을
                              원하시는 경우 00일(해당 달 말일)
                              <br /> 23시59분 까지 DB신청하기 메뉴에서 DB수량을
                              조정바랍니다.
                            </Typography>
                          </>
                        }
                      </Typography>
                    ),
                  },
                });
              }}
            />
          </Column>
        </Column>
      </Box>
    </Modal>
  );
}
