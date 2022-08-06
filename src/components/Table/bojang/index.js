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
import { dbHeaderList } from "./bojangHedaderList";
import Button from "../../Button";
import Row from "../../Box/Row";
import MemoBox from "../../Box/Memo";
import { useRouter } from "next/router";
import { getTitleOfOrg } from "../../../utility/organization/getTitleOfOrg";

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
              <TableCell align="center">
                <Checkbox />
              </TableCell>
              {dbHeaderList?.map((header, key) => (
                <TableCell align="center" key={key}>
                  {header}
                </TableCell>
              ))}

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
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    background: "#F0EFEF",
                  },
                }}
              >
                <TableCell key={d?.pk + 1} align="center" sx={{ width: 40 }}>
                  <Checkbox />
                </TableCell>
                <TableCell
                  key={d?.pk + 8}
                  align="center"
                  onClick={() => router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)}
                >
                  {key + 1}
                </TableCell>
                <TableCell
                  key={d?.pk + 2}
                  align="center"
                  onClick={() => router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)}
                >
                  {d?.geo_parent + " " + d?.geo_name}
                </TableCell>
                <TableCell
                  key={d?.pk + 3}
                  align="center"
                  onClick={() => router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)}
                >
                  {d?.status}
                </TableCell>
                <TableCell
                  key={d?.pk + 4}
                  align="center"
                  onClick={() => router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)}
                  sx={{
                    color: d?.org_status === "AS승인" ? "#FF0000" : "#3532C7",
                  }}
                >
                  {d?.org_status}
                </TableCell>
                <TableCell
                  key={d?.pk + 5}
                  align="center"
                  onClick={() => router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)}
                >
                  {d?.uploader?.name}
                </TableCell>
                <TableCell
                  key={d?.pk + 8}
                  align="center"
                  onClick={() => router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)}
                >
                  {d?.allocated_user?.head_office}
                </TableCell>
                <TableCell
                  key={d?.pk + 6}
                  align="center"
                  onClick={() => router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)}
                >
                  {getTitleOfOrg(d?.allocated_user)}
                </TableCell>
                <TableCell
                  key={d?.pk + 7}
                  align="center"
                  onClick={() => router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)}
                >
                  {d?.allocated_user?.name}
                </TableCell>

                {d?.values?.map((val) =>
                  header?.fields?.map((head) => {
                    if (
                      head?.is_list_shown === 1 &&
                      head?.pk === val?.field_pk
                    ) {
                      if (val?.title === "녹취 파일") {
                        return (
                          <Image
                            src={"/recording.png"}
                            width={18.75}
                            height={22.92}
                            alt=""
                            onClick={() =>
                              openModal({
                                modal: "readFile",
                                content: {
                                  contents: <MemoBox />,
                                },
                              })
                            }
                          />
                        );
                      } else if (val?.title === "메모") {
                        return (
                          <Image
                            src={"/memo.png"}
                            width={25}
                            height={25}
                            alt="memo"
                            onClick={() =>
                              openModal({
                                modal: "readFile",
                                content: {
                                  contents: <MemoBox />,
                                },
                              })
                            }
                          />
                        );
                      } else if (val?.title === "결과지 파일") {
                        return (
                          <Image
                            src={"/dna.png"}
                            width={12}
                            height={25}
                            alt="result"
                            onClick={() =>
                              openModal({
                                modal: "result",
                                content: {
                                  contents: "hi",
                                },
                              })
                            }
                          />
                        );
                      } else {
                        return (
                          <TableCell
                            key={val?.field_pk}
                            align="center"
                            onClick={() =>
                              router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)
                            }
                          >
                            {val?.value}
                          </TableCell>
                        );
                      }
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
