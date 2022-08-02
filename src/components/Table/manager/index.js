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
} from "@mui/material";
import RoundColorBox from "../../Box/RoundColorBox";
import { Box, styled } from "@mui/system";
import { useState } from "react";
import { manager_header } from "./managerHeaderList";
import { status_list, rank_list } from "../../../data/share/MenuByTextList";
import Button from "../../Button";
import Row from "../../Box/Row";
import Column from "../../Box/Column";
import { useRouter } from "next/router";
const Root = styled("div")`
  table {
    box-shadow: none;
    width: 100%;
    height: 100%;
  }

  th {
    background: #f2f2f2;
    border-top: 3px solid #0d1d41;
    height: 37px;
    text-align: center;
    box-shadow: none;
    font-weight: bold;
    font-size: 12px;
    padding: 0;
    min-width: 80px;
  }
  td {
    padding: 8px;
    font-size: 12px;
  }
`;

export default function ManagerTable({ data, allocation_total }) {
  const router = useRouter();
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
              {manager_header?.map((data, key) => (
                <TableCell key={key} align="center">
                  {data}
                </TableCell>
              ))}
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
                    onClick={() => router.push(`/manager/${user?.code}`)}
                  >
                    {user?.pk}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color:
                        Number(user?.acfp) > 300000 ? "#000000" : "#FD0202",
                    }}
                    onClick={() => router.push(`/manager/${user?.code}`)}
                  >
                    {Number(user?.acfp) > 300000 ? "지원" : "미지원"}
                  </TableCell>
                  <TableCell
                    onClick={() => router.push(`/manager/${user?.code}`)}
                  >
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
                    onClick={() => router.push(`/manager/${user?.code}`)}
                  >
                    {user?.head_office}
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => router.push(`/manager/${user?.code}`)}
                  >
                    {user?.region + user?.branch + user?.team}
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => router.push(`/manager/${user?.code}`)}
                  >
                    {user?.id}
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => router.push(`/manager/${user?.code}`)}
                  >
                    {user?.name}
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => router.push(`/manager/${user?.code}`)}
                  >
                    {user?.phone}
                  </TableCell>

                  {user?.allocations.map((location, _key) => (
                    <TableCell key={_key} align="center" sx={{ width: 150 }}>
                      <Row sx={{ gap: 1 }}>
                        <RoundColorBox
                          background={
                            location?.is_activated === 1 ? "#0D1D41" : "#909090"
                          }
                        >
                          {location?.is_activated === 1 ? "ON" : "OFF"}
                        </RoundColorBox>
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
