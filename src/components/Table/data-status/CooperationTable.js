import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import { useState } from "react";

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
    min-width: 100px;
  }
  td {
    padding: 8px;
    font-size: 12px;
    font-weight: 500;
  }
`;

const headers = ["협력사", "DB 종류", "유입 DB", "분배 DB", "잔여 DB"];

export default function CooperationTable({ data }) {
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
              {headers?.map((data, key) => (
                <TableCell
                  key={key}
                  align="center"
                  rowSpan={data === "" ? 2 : undefined}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  {data}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((dashboard, key) => {
              return (
                <>
                  <TableRow key={key}>
                    <TableCell
                      sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)" }}
                      rowSpan={dashboard?.dbs.length + 1}
                      align="center"
                    >
                      {dashboard?.name}
                    </TableCell>
                  </TableRow>

                  {dashboard?.dbs?.map((d, _key) => (
                    <TableRow key={_key}>
                      <TableCell align="center">{d?.title}</TableCell>
                      <TableCell align="center">{d?.income}</TableCell>
                      <TableCell align="center">{d?.allocate}</TableCell>
                      <TableCell align="center">{d?.remain}</TableCell>
                    </TableRow>
                  ))}
                </>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}
