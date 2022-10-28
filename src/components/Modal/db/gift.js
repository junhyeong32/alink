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
import { getAccessToken, getCookie } from "../../../utility/getCookie";
import useGetGroupList from "../../../hooks/share/useGetGroupList";
import useGetOrganization from "../../../hooks/share/useGetOrganization";
import { getOrgWithOfficeName } from "../../../utility/organization/getOrgWithUnit";
import { Router } from "@mui/icons-material";
import { useRouter } from "next/router";

const style = {
  width: { lg: 900, md: 900, sm: "90%", xs: "90%" },
  height: "95%",
  overflowX: "hidden",
  background: "#FFFFFF",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  padding: 2,
};

export default function Gift({ index }) {
  const [select, setSelect] = useState("");
  const router = useRouter();
  const [user_info] = useState(getCookie("user_info"));
  const { enqueueSnackbar } = useSnackbar();
  const [user_list, setUserList] = useState([]);
  const [org_code, setOrgCode] = useState("전체");
  const [name, setName] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState();
  const [branch, setBranch] = useState("전체");
  const [team, setTeam] = useState("전체");
  const [orgBranchMenuItems, setOrgBranchMenuItems] = useState({});
  const [orgTeamMenuItems, setOrgTeamMenuItems] = useState({});

  const [orgMenuItems, setOrgMenuItems] = useState({});

  const { sales, getOrganization } = useGetOrganization("sales");

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
              org_code: team === "전체" ? undefined : team,
              name: name,
              for_gift: 1,
            },
          })
        )?.data;

    if (res?.code === 200) {
      setUserList(res?.data?.result);
      setTotalCount(Math.ceil(res?.data.total_count / 20));
    }
  };

  useEffect(() => {
    const org = { 전체: "전체" };
    getOrgWithOfficeName(sales, user_info, org);

    setOrgTeamMenuItems(org);
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
            sx={{
              width: "100%",
              height: "95%",
              gap: "25px",
              overflowY: "scroll",
            }}
          >
            <Row alignItems={"end"} sx={{ width: "100%", gap: 2 }}>
              <UnderLineSelectInput
                w={"25%"}
                title={"소속"}
                menuItems={orgTeamMenuItems}
                value={team}
                onChange={(e) => setTeam(e.target.value)}
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
                  action={() => getUserList()}
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
                    setBranch("전체");
                    setTeam("전체");
                    setName("");
                  }}
                />
              </Row>
            </Row>
            <DbGiftTable data={user_list} checkData={data[index]} />
          </Column>
          <Row
            alignItems="center"
            justifyContent="center"
            sx={{ width: "100%", mt: 2, mb: 2 }}
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
