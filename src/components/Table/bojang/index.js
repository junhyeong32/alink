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
import { Box, styled } from "@mui/system";
import { useState } from "react";
import { bojangHeaderList } from "./bojangHedaderList";
import Button from "../../Button";
import Row from "../../Box/Row";
import MemoBox from "../../Box/Memo";
import { useRouter } from "next/router";

const Root = styled("div")`
  table {
    box-shadow: none;
    width: 100%;
    height: 100%;
  }

  th {
    border-top: 3px solid #0d1d41;
    border-bottom: none;
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
    border-bottom: none;
  }
`;

export default function BojangTable({ openModal, closeModal, header, data }) {
  const router = useRouter();
  console.log("header, data", header, data);
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
              {header?.fields?.map((head, key) => {
                if (head?.is_list_shown === 1)
                  return (
                    <TableCell key={key} align="center">
                      {head?.property?.name}
                    </TableCell>
                  );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.map((d, key) => (
              <TableRow
                key={key}
                onClick={() => router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)}
              >
                {d?.values?.map((val) =>
                  header?.fields?.map((head) => {
                    if (
                      head?.is_list_shown === 1 &&
                      head?.pk === val?.field_pk
                    ) {
                      return (
                        <TableCell key={val?.field_pk} align="center">
                          {val?.value}
                        </TableCell>
                      );
                    }
                  })
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}
