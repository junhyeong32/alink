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
import { useRouter } from "next/router";
import {
  getTitleOfOrg,
  getTitleOfOrg_name,
} from "../../../utility/organization/getTitleOfOrg";
import { useEffect } from "react";
import { getCookie } from "../../../utility/getCookie";
import { formatPhoneNumber } from "../../../utility/formatPhone";

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
  page,
  header,
  data,
  checkData,
  setCheckData,
  count,
}) {
  const router = useRouter();
  const today = new Date();

  const [rank] = useState(getCookie("user_info")?.grade);
  const [user_info] = useState(getCookie("user_info"));

  console.log(count, page);

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
              {dbHeaderList?.map((header, key) => {
                if (
                  (rank === "????????????" || rank === "?????????") &&
                  (header === "??????" ||
                    header === "?????????" ||
                    header === "??????")
                )
                  return;

                if (
                  rank !== "?????????" &&
                  rank !== "?????????" &&
                  rank !== "????????????" &&
                  header === "?????????"
                )
                  return;
                return (
                  <TableCell align="center" key={key}>
                    {header}
                  </TableCell>
                );
              })}

              {header?.fields?.map((head, key) => {
                if (head?.is_list_shown === 1)
                  return (
                    <TableCell key={key} align="center">
                      {head?.property?.name}
                    </TableCell>
                  );
              })}
              <TableCell align="center">
                {rank === "?????????" || rank === "????????????"
                  ? "????????????"
                  : "????????????"}
              </TableCell>
              <TableCell align="center">?????? ?????????</TableCell>
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
                  sx={{
                    fontWeight:
                      d?.allocated_user?.pk === user_info?.pk
                        ? "bold"
                        : "normal",
                  }}
                  onClick={() => router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)}
                >
                  {(page || router.query.page) === 1
                    ? count - (page || router.query.page) * key
                    : (page || router.query.page) === 2
                    ? count - 20 - key
                    : count -
                      ((page || router.query.page) * 10 +
                        ((page || router.query.page) - 2) * 10) -
                      key}
                </TableCell>
                <TableCell
                  key={d?.pk + 999}
                  align="center"
                  sx={{
                    width: 10,
                    fontWeight:
                      d?.allocated_user?.pk === user_info?.pk
                        ? "bold"
                        : "normal",
                  }}
                  onClick={() => router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)}
                >
                  {d?.gift_user?.pk ? (
                    <Image src="/gift.png" width={20} height={20} alt="gift" />
                  ) : (
                    ""
                  )}
                </TableCell>
                <TableCell
                  key={d?.pk + 2}
                  align="center"
                  sx={{
                    fontWeight:
                      d?.allocated_user?.pk === user_info?.pk
                        ? "bold"
                        : "normal",
                  }}
                  onClick={() => router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)}
                >
                  {d?.geo_parent + " " + d?.geo_name}
                </TableCell>
                <TableCell
                  key={d?.pk + 3}
                  align="center"
                  sx={{
                    fontWeight:
                      d?.allocated_user?.pk === user_info?.pk
                        ? "bold"
                        : "normal",
                  }}
                  onClick={() => router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)}
                >
                  {d?.status}
                </TableCell>
                <TableCell
                  key={d?.pk + 4}
                  align="center"
                  onClick={() => router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)}
                  sx={{
                    color: d?.org_status === "AS??????" ? "#FF0000" : "#3532C7",
                    fontWeight:
                      d?.allocated_user?.pk === user_info?.pk
                        ? "bold"
                        : "normal",
                  }}
                >
                  {d?.org_status}
                </TableCell>{" "}
                {(rank === "?????????" ||
                  rank === "?????????" ||
                  rank === "????????????") && (
                  <TableCell
                    key={d?.pk + 5}
                    align="center"
                    onClick={() => router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)}
                    sx={{
                      fontWeight:
                        d?.allocated_user?.pk === user_info?.pk
                          ? "bold"
                          : "normal",
                    }}
                  >
                    {d?.uploader?.name}
                  </TableCell>
                )}
                {rank !== "????????????" && rank !== "?????????" && (
                  <>
                    <TableCell
                      key={d?.pk + 8}
                      align="center"
                      onClick={() =>
                        router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)
                      }
                      sx={{
                        fontWeight:
                          d?.allocated_user?.pk === user_info?.pk
                            ? "bold"
                            : "normal",
                      }}
                    >
                      {d?.organization?.name}
                    </TableCell>
                    <TableCell
                      key={d?.pk + 6}
                      align="center"
                      onClick={() =>
                        router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)
                      }
                      sx={{
                        fontWeight:
                          d?.allocated_user?.pk === user_info?.pk
                            ? "bold"
                            : "normal",
                      }}
                    >
                      {getTitleOfOrg_name(d?.allocated_user?.organization)}
                    </TableCell>

                    <TableCell
                      key={d?.pk + 7}
                      align="center"
                      onClick={() =>
                        router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)
                      }
                      sx={{
                        fontWeight:
                          d?.allocated_user?.pk === user_info?.pk
                            ? "bold"
                            : "normal",
                      }}
                    >
                      {d?.allocated_user?.name}
                    </TableCell>
                  </>
                )}
                {header?.fields?.map((head, _key) => {
                  if (
                    head?.is_list_shown === 1 &&
                    head?.property.name !== "?????? ??????" &&
                    head?.property.name !== "??????" &&
                    head?.property.name !== "AS?????????" &&
                    head?.property.name !== "????????? ??????"
                  ) {
                    if (head?.property.name === "??????") {
                      return (
                        <TableCell
                          key={_key}
                          align="center"
                          sx={{
                            fontWeight:
                              d?.allocated_user?.pk === user_info?.pk
                                ? "bold"
                                : "normal",
                          }}
                          onClick={() =>
                            router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)
                          }
                        >
                          {data[key]?.values.find(
                            (v) => v?.field_pk === head?.pk
                          )?.value?.length === 2
                            ? data[key]?.values.find(
                                (v) => v?.field_pk === head?.pk
                              )?.value
                            : today.getFullYear() -
                              new Date(
                                (() => {
                                  let getDate = data[key]?.values.find(
                                    (v) => v?.field_pk === head?.pk
                                  )?.value;

                                  return getDate?.length === 8
                                    ? getDate.slice(0, 4) +
                                        "-" +
                                        getDate.slice(5, 6) +
                                        "-" +
                                        getDate.slice(7, 8)
                                    : getDate;
                                })()
                              ).getFullYear() +
                              1}
                        </TableCell>
                      );
                    } else if (head?.property.name === "?????????") {
                      return (
                        <TableCell
                          key={_key}
                          align="center"
                          sx={{
                            fontWeight:
                              d?.allocated_user?.pk === user_info?.pk
                                ? "bold"
                                : "normal",
                          }}
                          onClick={() =>
                            router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)
                          }
                        >
                          {formatPhoneNumber(
                            data[key]?.values.find(
                              (v) => v?.field_pk === head?.pk
                            )?.value
                          ) ||
                            data[key]?.values.find(
                              (v) => v?.field_pk === head?.pk
                            )?.value}
                        </TableCell>
                      );
                    }

                    return (
                      <TableCell
                        key={_key}
                        align="center"
                        sx={{
                          fontWeight:
                            d?.allocated_user?.pk === user_info?.pk
                              ? "bold"
                              : "normal",
                        }}
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
                    head?.property?.name === "?????? ??????"
                  ) {
                    return (
                      <TableCell align="center" key={_key}>
                        {data[key]?.values.filter(
                          (v) =>
                            v?.title === "?????? ??????" &&
                            v?.value.includes("https") &&
                            v?.value !== ""
                        ).length !== 0 ? (
                          <Image
                            src={"/recording.png"}
                            width={18.75}
                            height={22.92}
                            alt=""
                            onClick={() =>
                              openModal({
                                modal: "readFile",
                                content: {
                                  title: "?????? ??????",
                                  data: data[key]?.values.filter(
                                    (v) =>
                                      v?.title === "?????? ??????" &&
                                      v?.value.includes("https")
                                  ),
                                },
                              })
                            }
                          />
                        ) : (
                          ""
                        )}
                      </TableCell>
                    );
                  } else if (
                    head?.is_list_shown === 1 &&
                    head?.property?.name === "AS?????????"
                  ) {
                    return (
                      <TableCell align="center" key={_key}>
                        {data[key]?.values.filter(
                          (v) => v?.title === "AS?????????" && v?.value !== ""
                        ).length !== 0 ? (
                          <Image
                            src={"/asimage.svg"}
                            width={20}
                            height={20}
                            alt="result"
                            onClick={() =>
                              openModal({
                                modal: "imageslider",
                                data: data[key]?.values.filter(
                                  (v) => v?.title === "AS?????????"
                                ),
                                content: {
                                  title: "????????? ??????",
                                },
                              })
                            }
                          />
                        ) : (
                          ""
                        )}
                      </TableCell>
                    );
                  } else if (
                    head?.is_list_shown === 1 &&
                    head?.property?.name === "??????"
                  ) {
                    return (
                      <TableCell align="center" key={_key}>
                        {data[key]?.values.filter(
                          (v) => v?.title === "??????" && v?.value !== ""
                        ).length !== 0 ? (
                          <Image
                            src={"/memo.png"}
                            width={25}
                            height={25}
                            alt="memo"
                            onClick={() =>
                              openModal({
                                modal: "readFile",
                                content: {
                                  title: "??????",
                                  data: data[key]?.values.filter(
                                    (v) => v?.title === "??????"
                                  ),
                                },
                              })
                            }
                          />
                        ) : (
                          ""
                        )}
                      </TableCell>
                    );
                  } else if (
                    head?.is_list_shown === 1 &&
                    head?.property?.name === "????????? ??????"
                  ) {
                    return (
                      <TableCell align="center" key={_key}>
                        {data[key]?.values.filter(
                          (v) => v?.title === "????????? ??????" && v?.value !== ""
                        ).length !== 0 ? (
                          <Image
                            src={"/dna.png"}
                            width={12}
                            height={25}
                            alt="result"
                            onClick={() =>
                              openModal({
                                modal: "readFile",
                                content: {
                                  title: "????????? ??????",
                                  data: data[key]?.values.filter(
                                    (v) => v?.title === "????????? ??????"
                                  ),
                                },
                              })
                            }
                          />
                        ) : (
                          ""
                        )}
                      </TableCell>
                    );
                  }
                })}
                <TableCell
                  onClick={() => router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)}
                  sx={{
                    fontWeight:
                      d?.allocated_user?.pk === user_info?.pk
                        ? "bold"
                        : "normal",
                  }}
                  align="center"
                >
                  {rank === "?????????" || rank === "????????????"
                    ? d?.created_date
                    : d?.allocated_date}
                </TableCell>
                <TableCell
                  onClick={() => router.push(`/db/${d?.pk}?menu=${d?.db_pk}`)}
                  sx={{
                    fontWeight:
                      d?.allocated_user?.pk === user_info?.pk
                        ? "bold"
                        : "normal",
                  }}
                  align="center"
                >
                  {d?.first_gift_user?.name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>{" "}
    </Root>
  );
}
