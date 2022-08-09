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
import { headers, headers_bgcolor } from "./ReceptionStatusList";

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

export default function ReceptionStatus({ data, date }) {
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
                >
                  <Box
                    sx={{
                      background: headers_bgcolor[key],
                      width: "60px",
                      height: "20px",
                      borderRadius: "5px",
                      margin: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FFFFFF",
                    }}
                  >
                    {data}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((dashboard, key) => (
              <>
                <TableRow>
                  <TableCell rowSpan={4}>{dashboard?.title}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell rowSpan={1} align="center">
                    당일
                  </TableCell>
                  {dashboard?.status.map((status, _key) => (
                    <TableCell rowSpan={1} align="center" key={_key}>
                      {status?.today}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell rowSpan={1} align="center">
                    {date}월
                  </TableCell>
                  {dashboard?.status.map((status, _key) => (
                    <TableCell rowSpan={1} align="center" key={_key}>
                      {status?.month}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell rowSpan={1} align="center">
                    전체
                  </TableCell>
                  {dashboard?.status.map((status, _key) => (
                    <TableCell rowSpan={1} align="center" key={_key}>
                      {status?.total}
                    </TableCell>
                  ))}
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}
