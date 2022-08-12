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
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import TopLabelContents from "../../Box/TopLableContents";
import Button from "../../Button";
import UnderLineSelectInput, {
  LabelOutLineSelectInput,
} from "../../Input/Select";
import { OutLineInput } from "../../Input";
import Row from "../../Box/Row";
import { ModalContext } from "../../../contexts/ModalContext";
import UnderLineInput from "../../Input";
import { LabelUnderLineInput } from "../../Input";
import DbGiftTable from "../../Table/db-gift";
import Axios from "../../../utility/api";
import { getAccessToken } from "../../../utility/getCookie";
import useGetGroupList from "../../../hooks/share/useGetGroupList";
import useGetOrganization from "../../../hooks/share/useGetOrganization";
import { getOrgWithUnit } from "../../../utility/organization/getOrgWithUnit";
import { Router } from "@mui/icons-material";
import { useRouter } from "next/router";

const style = {
  width: { lg: 900, md: 900, sm: "90%", xs: "90%" },
  height: 880,
  overflowX: "hidden",
  overflowY: "scroll",
  background: "#FFFFFF",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  p: 2.7,
};

export default function Gift({ index }) {
  const [select, setSelect] = useState("");
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [user_list, setUserList] = useState([]);
  const [org_code, setOrgCode] = useState("전체");
  const [name, setName] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState();

  const [orgMenuItems, setOrgMenuItems] = useState({});
  const [checkData, setCheckData] = useState([]);

  const { sales } = useGetOrganization("sales");

  const { modal, data, openModal, closeModal, modalContent } =
    useContext(ModalContext);

  const getUserList = async (is_init) => {
    const res = is_init
      ? (
          await Axios.Get("member", {
            params: {
              token: getAccessToken(),
              for_gift: 1,
            },
          })
        )?.data
      : (
          await Axios.Get("member", {
            params: {
              token: getAccessToken(),
              page: page,
              org_code: org_code === "전체" ? undefined : org_code,
              name: name,
              for_gift: 1,
            },
          })
        )?.data;

    console.log(res);
    if (res?.code === 200) {
      setUserList(res?.data?.result);
      setTotalCount(Math.ceil(res?.data.total_count / 20));
    }
  };

  useEffect(() => {
    if (sales?.length === 0) return;
    const org = {};
    getOrgWithUnit(sales, "team", org);

    setOrgMenuItems(org);
  }, [sales]);

  useEffect(() => {
    getUserList();
  }, [page]);

  return (
    <Modal open={modal[index] === "gift" ? true : false} onClose={closeModal}>
      <Box>
        <Column alignItems={"start"} justifyContent={"start"} sx={style}>
          <Row justifyContent={"end"} sx={{ width: "100%" }}>
            <Image
              src="/black_x.png"
              width={15}
              height={15}
              alt="x"
              className="cursor"
              onClick={closeModal}
            />
          </Row>
          <Column
            alignItems={"start"}
            justifyContent={"start"}
            sx={{ width: "100%", height: "100%", gap: "25px" }}
          >
            <Row alignItems={"end"} sx={{ width: "100%", gap: 2 }}>
              <UnderLineSelectInput
                w={"25%"}
                title={"소속명"}
                menuItems={orgMenuItems}
                value={org_code}
                onChange={(e) => setOrgCode(e.target.value)}
              />
              <LabelUnderLineInput
                w={"25%"}
                title={"담당자"}
                placeholder={"성명으로 검색하실 수 있습니다."}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Row sx={{ gap: 1 }}>
                <Button
                  text="검색"
                  variant="contained"
                  bgColor={"primary"}
                  color="primary.white"
                  fs="h6"
                  w={60}
                  h={20}
                  action={getUserList}
                />
                <Button
                  text="초기화"
                  variant="contained"
                  bgColor={"gray"}
                  color="primary.white"
                  fs="h6"
                  w={60}
                  h={20}
                  action={() => {
                    getUserList(true);
                    setOrgCode("전체");
                    setName("");
                  }}
                />
                <Button
                  variant={"outlined"}
                  color="primary"
                  text="선물하기"
                  w={80}
                  h={21}
                  fs="h6"
                  action={() => {
                    openModal({
                      modal: "needconfirm",
                      content: {
                        contents: "DB 선물하기를 진행하시겠습니끼?",
                        buttonText: "승인",
                        action: async () => {
                          const res = await Axios.Post("db/list/present", {
                            token: getAccessToken(),
                            list_pks: router.query.menu,
                            target_user_pk: checkData.join(","),
                          });
                          if (res?.code === 200) {
                            closeModal(1);
                            enqueueSnackbar("DB 선물하기가 완료되었습니다", {
                              variant: "success",
                              autoHideDuration: 2000,
                            });
                          }
                        },
                      },
                    });
                  }}
                />
              </Row>
            </Row>
            <DbGiftTable
              data={user_list}
              checkData={checkData}
              setCheckData={setCheckData}
            />
          </Column>
          <Row
            alignItems="center"
            justifyContent="center"
            sx={{ width: "100%", mt: "86px" }}
          >
            <Pagination
              component="div"
              page={page}
              count={totalCount}
              onChange={(subject, newPage) => {
                setPage(newPage);
              }}
              color="primary"
              // hidePrevButton
              // hideNextButton
            />
          </Row>
        </Column>
      </Box>
    </Modal>
  );
}
