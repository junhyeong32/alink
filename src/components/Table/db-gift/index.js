import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import { useContext, useState } from "react";
import { headerList } from "./headerList";
import Row from "../../Box/Row";
import RoundColorBox from "../../Box/RoundColorBox";
import { rank_list } from "../../../data/share/MenuByTextList";
import Column from "../../Box/Column";
import { useRouter } from "next/router";
import { ModalContext } from "../../../contexts/ModalContext";
import api from "../../../utility/api";
import { getAccessToken, getCookie } from "../../../utility/getCookie";
import { getTitleOfOrg } from "../../../utility/organization/getTitleOfOrg";
import Button from "../../Button";
import { useSnackbar } from "notistack";

const Root = styled("div")`
  table {
    box-shadow: none;
    width: 100%;
    height: 100%;
  }

  th {
    border-top: 3px solid #0d1d41;
    border-bottom: none;
    height: 45px;
    text-align: center;
    box-shadow: none;
    font-weight: bold;
    font-size: 12px;
    padding: 0;
    min-width: 100px;
  }
  td {
    padding: 0px;
    font-size: 12px;
    cursor: pointer;
    height: 35px;
  }
`;

export default function DbGiftTable({ data, checkData }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [bojang, setBojang] = useState(false);
  const [db, setDb] = useState(false);
  const [dna, setDna] = useState(false);
  const [rank, setRank] = useState(getCookie("user_info")?.grade);

  const { openModal, closeModal } = useContext(ModalContext);

  return (
    <Root sx={{ width: "100%" }}>
      <TableContainer>
        <Table
          sx={{
            width: "100%",
          }}
        >
          <TableHead>
            <TableRow key="head">
              {headerList?.map((data, key) => {
                if (
                  (rank === "담당자" || rank === "팀장") &&
                  data === "DB 지원 대상"
                )
                  return;
                return (
                  <TableCell key={key} align="center">
                    {data}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.map((user, key) => {
              return (
                <TableRow
                  key={key}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      background: "#F0EFEF",
                    },
                  }}
                >
                  {rank !== "담당자" && rank !== "팀장" && (
                    <TableCell
                      align="center"
                      sx={{
                        color: user?.acfp < 300000 ? "#FD0202" : "#000000",
                      }}
                    >
                      {user?.acfp < 300000 ? "미지원" : "지원"}
                    </TableCell>
                  )}

                  <TableCell>
                    <Row justifyContent={"center"}>
                      <RoundColorBox w={61} background={rank_list[user?.grade]}>
                        {user?.grade}
                      </RoundColorBox>
                    </Row>
                  </TableCell>
                  <TableCell align="center">{getTitleOfOrg(user)}</TableCell>
                  <TableCell align="center">{user?.name}</TableCell>
                  <TableCell align="center">
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
                              const res = await api.Post("db/list/present", {
                                token: getAccessToken(),
                                list_pks: checkData.join(","),
                                target_user_pk: user?.pk,
                              });
                              if (res?.code === 200) {
                                closeModal(1);
                                enqueueSnackbar(
                                  "DB 선물하기가 완료되었습니다",
                                  {
                                    variant: "success",
                                    autoHideDuration: 2000,
                                  }
                                );
                              }
                            },
                          },
                        });
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}
