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

export default function UserTable({ data, allocation_total }) {
  const router = useRouter();
  const [bojang, setBojang] = useState(false);
  const [db, setDb] = useState(false);
  const [dna, setDna] = useState(false);

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
                        <CustomSwitch
                          checked={location[key]?.is_activated === 1}
                          onClick={(e) => {
                            openModal({
                              modal: "needconfirm",
                              content: {
                                contents: (
                                  <Typography variant="h6">
                                    <Typography variant="small">
                                      text
                                    </Typography>
                                    <br />
                                    {bojang
                                      ? "보장DB를 OFF으로 설정하시겠습니까?"
                                      : "보장DB를 ON으로 설정하시겠습니까?"}
                                  </Typography>
                                ),
                                action: () => setBojang(e.target.checked),
                                buttonText: "확인",
                              },
                            });
                          }}
                        />
                        {user?.allocations[0]?.count} 개
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
