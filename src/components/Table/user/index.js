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
import { userHeaderList } from "./userHedaderList";
import Button from "../../Button";
import Row from "../../Box/Row";
import MemoBox from "../../Box/Memo";
import CustomSwitch from "../../Switch";
import RoundColorBox from "../../Box/RoundColorBox";
import { status_list, rank_list } from "../../../data/share/MenuByTextList";
import Column from "../../Box/Column";
import { useRouter } from "next/router";
import { ModalContext } from "../../../contexts/ModalContext";
import api from "../../../utility/api";
import { getAccessToken, getCookie } from "../../../utility/getCookie";

export default function UserTable({ data, allocation_total }) {
  const router = useRouter();
  const [bojang, setBojang] = useState(false);
  const [db, setDb] = useState(false);
  const [dna, setDna] = useState(false);
  const [rank, setRank] = useState(getCookie("user_info")?.grade);

  const { openModal, closeModal } = useContext(ModalContext);

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
      padding: 8px;
      font-size: 12px;
      cursor: pointer;
    }
  `;

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
              {userHeaderList?.map((data, key) => {
                return (
                  <TableCell key={key} align="center">
                    {data}
                    <Column>{allocation_total[key - 8]?.count}</Column>
                  </TableCell>
                );
              })}
              {allocation_total?.map((location, key) => (
                <TableCell key={key} align="center">
                  {location?.db.title}
                  <Column>{location?.count}</Column>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.map((user, key) => {
              return (
                <TableRow key={key}>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 500 }}
                    onClick={() => router.push(`/user/${user?.code}`)}
                  >
                    {user?.pk}
                  </TableCell>
                  <TableCell onClick={() => router.push(`/user/${user?.code}`)}>
                    <Row justifyContent={"center"}>
                      <RoundColorBox
                        w={61}
                        background={status_list[user?.status]}
                      >
                        {user?.status}
                      </RoundColorBox>
                    </Row>
                  </TableCell>
                  <TableCell onClick={() => router.push(`/user/${user?.code}`)}>
                    <Row justifyContent={"center"}>
                      <RoundColorBox
                        w={61}
                        background={rank_list[user?.grade] || "#000000"}
                      >
                        {user?.grade}
                      </RoundColorBox>
                    </Row>
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => router.push(`/user/${user?.code}`)}
                  >
                    {user?.head_office}
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => router.push(`/user/${user?.code}`)}
                  >
                    {user?.region + user?.branch + user?.team}
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => router.push(`/user/${user?.code}`)}
                  >
                    {user?.id}
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => router.push(`/user/${user?.code}`)}
                  >
                    {user?.name}
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => router.push(`/user/${user?.code}`)}
                  >
                    {user?.phone}
                  </TableCell>

                  {user?.allocations.map((location, _key) => (
                    <TableCell key={_key} align="center" sx={{ width: 150 }}>
                      <Row justifyContent={"center"} sx={{ gap: "10px" }}>
                        {rank === "관리자" ? (
                          <CustomSwitch
                            checked={
                              location?.is_activated === 1 ? true : false
                            }
                            onClick={(e) => {
                              openModal({
                                modal: "needconfirm",
                                content: {
                                  contents: (
                                    <Column
                                      alignItems={"center"}
                                      justifyContent={"center"}
                                      sx={{ gap: 1 }}
                                    >
                                      <Row
                                        alignItems={"center"}
                                        justifyContent={"center"}
                                        sx={{ gap: 1 }}
                                      >
                                        <Typography
                                          variant="small"
                                          component={"span"}
                                        >
                                          {user?.region +
                                            user?.branch +
                                            user?.team}
                                        </Typography>
                                        <RoundColorBox
                                          w={61}
                                          background={
                                            rank_list[user?.grade] || "#000000"
                                          }
                                          fs={12}
                                        >
                                          {user?.grade}
                                        </RoundColorBox>
                                        <Typography
                                          variant="small"
                                          component={"span"}
                                        >
                                          {user?.name}
                                        </Typography>
                                      </Row>
                                      <Typography variant="h6">
                                        {location[key]?.is_activated === 1
                                          ? "보장DB를 OFF으로 설정하시겠습니까?"
                                          : "보장DB를 ON으로 설정하시겠습니까?"}
                                      </Typography>
                                    </Column>
                                  ),
                                  action: async () => {
                                    const res = await api.Post(
                                      "member/allocation",
                                      {
                                        token: getAccessToken(),
                                        allocation_pk: location?.pk,
                                        onoff: 1,
                                        db_pk: location?.db?.pk,
                                        user_pk: user?.pk,
                                      }
                                    );
                                    console.log(res);
                                  },
                                  buttonText: "확인",
                                },
                              });
                            }}
                          />
                        ) : (
                          <RoundColorBox
                            background={
                              location?.is_activated === 1
                                ? "#0D1D41"
                                : "#909090"
                            }
                          >
                            {location?.is_activated === 1 ? "ON" : "OFF"}
                          </RoundColorBox>
                        )}
                        {location?.count} 개
                      </Row>
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}
