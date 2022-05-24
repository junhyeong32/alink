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

export default function ReceptionStatus({
  data,
  row_check,
  setRowCheck,
  params,
}) {
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
            <TableRow>
              <TableCell rowSpan={4}>보장</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">1</TableCell>
              <TableCell>1</TableCell>
              <TableCell>1</TableCell>
              <TableCell>1</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>1</TableCell>
              <TableCell>1</TableCell>
              <TableCell>1</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>1</TableCell>
              <TableCell>1</TableCell>
              <TableCell>1</TableCell>
            </TableRow>

            <TableRow>
              <TableCell rowSpan={4}>재무</TableCell>
              <TableCell>1</TableCell>
              <TableCell>1</TableCell>
              <TableCell>1</TableCell>
              <TableCell>1</TableCell>
            </TableRow>

            <TableRow>
              <TableCell rowSpan={4}>유전자</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}
