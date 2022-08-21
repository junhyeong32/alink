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
import {
  getTitleOfOrg,
  getTitleOfOrg_name,
} from "../../../utility/organization/getTitleOfOrg";
import { useEffect } from "react";

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

export default function BojangTable({
  openModal,
  closeModal,
  header,
  data,
  checkData,
  setCheckData,
}) {
  const router = useRouter();

  console.log("data", header, data);

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
                <Checkbox
                  checked={
                    data?.length !== 0 && checkData.length === data?.length
                  }
                  onClick={() => {
                    setCheckData((prev) => {
                      let newData = [...prev];

                      if (newData.length === data?.length) {
                        return [];
                      } else {
                        newData = [];
                        data?.map((d) => newData.push(d?.pk));
                      }

                      return newData;
                    });
                  }}
                />
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
                  <Checkbox
                    checked={checkData.indexOf(d?.pk) !== -1}
                    onClick={() => {
                      setCheckData((prev) => {
                        const newData = [...prev];

                        const foundIndex = newData.indexOf(d?.pk);

                        if (foundIndex === -1) newData.push(d?.pk);
                        else newData.splice(foundIndex, 1);

                        return newData;
                      });
                    }}
                  />
                </TableCell>
                <TableCell
                  key={"hi" + key}
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
                  {d?.organization?.head_office_name}
                </TableCell>
                <TableCell
                  key={d?.pk + 6}
                  align="center"
                  onClick={() => router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)}
                >
                  {getTitleOfOrg_name(d?.organization)}
                </TableCell>
                <TableCell
                  key={d?.pk + 7}
                  align="center"
                  onClick={() => router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)}
                >
                  {d?.allocated_user?.name}
                </TableCell>

                {header?.fields?.map((head, _key) => {
                  if (
                    head?.is_list_shown === 1 &&
                    head?.property.name !== "녹취 파일" &&
                    head?.property.name !== "메모" &&
                    head?.property.name !== "결과지 파일"
                  ) {
                    return (
                      <TableCell
                        key={_key}
                        align="center"
                        onClick={() =>
                          router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)
                        }
                      >
                        {data[key]?.values.find((v) => v?.field_pk === head?.pk)
                          ?.value || "-"}
                      </TableCell>
                    );
                  }
                })}

                {header?.fields?.map((head, _key) => {
                  if (
                    head?.is_list_shown === 1 &&
                    head?.property?.name === "녹취 파일"
                  ) {
                    return (
                      <TableCell
                        align="center"
                        key={_key}
                        onClick={() =>
                          openModal({
                            modal: "readFile",
                            content: {
                              title: "녹취 파일",
                              data: data[key]?.values.filter(
                                (v) =>
                                  v?.title === "녹취 파일" &&
                                  v?.value.includes("https")
                              ),
                            },
                          })
                        }
                      >
                        {data[key]?.values.filter(
                          (v) =>
                            v?.title === "녹취 파일" &&
                            v?.value.includes("https") &&
                            v?.value !== ""
                        ).length !== 0 ? (
                          <Image
                            src={"/recording.png"}
                            width={18.75}
                            height={22.92}
                            alt=""
                          />
                        ) : (
                          ""
                        )}
                      </TableCell>
                    );
                  } else if (
                    head?.is_list_shown === 1 &&
                    head?.property?.name === "메모"
                  ) {
                    return (
                      <TableCell
                        align="center"
                        key={_key}
                        onClick={() =>
                          openModal({
                            modal: "readFile",
                            content: {
                              title: "메모",
                              data: data[key]?.values.filter(
                                (v) => v?.title === "메모"
                              ),
                            },
                          })
                        }
                      >
                        {data[key]?.values.filter(
                          (v) => v?.title === "메모" && v?.value !== ""
                        ).length !== 0 ? (
                          <Image
                            src={"/memo.png"}
                            width={25}
                            height={25}
                            alt="memo"
                          />
                        ) : (
                          ""
                        )}
                      </TableCell>
                    );
                  } else if (
                    head?.is_list_shown === 1 &&
                    head?.property?.name === "결과지 파일"
                  ) {
                    return (
                      <TableCell
                        align="center"
                        key={_key}
                        onClick={() =>
                          openModal({
                            modal: "readFile",
                            content: {
                              title: "결과지 파일",
                              data: data[key]?.values.filter(
                                (v) => v?.title === "결과지 파일"
                              ),
                            },
                          })
                        }
                      >
                        {data[key]?.values.filter(
                          (v) => v?.title === "결과지 파일" && v?.value !== ""
                        ).length !== 0 ? (
                          <Image
                            src={"/dna.png"}
                            width={12}
                            height={25}
                            alt="result"
                          />
                        ) : (
                          ""
                        )}
                      </TableCell>
                    );
                  }
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}
