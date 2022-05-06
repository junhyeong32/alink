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
import { styled } from "@mui/system";
import { useState } from "react";
import Row from "../Box/Row";
import getDepthOfTeam from "../../hooks/share/getDepthOfTeam";
import getLastTeam from "../../hooks/share/getLastTeam";

export default function ApTable({
  header,
  data,
  row_check,
  setRowCheck,
  row_user_info,
  setRowUserInfo,
}) {
  const [all_checked, setAllChecked] = useState(false);
  const [checked, setChecked] = useState([]);
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
    }
    td {
      padding: 8px;
      font-size: 12px;
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
              <TableCell>
                <Checkbox
                  onClick={(e) => {
                    setAllChecked(e.target.checked);
                    setRowCheck(() => {
                      let data_arr = [];
                      if (e.target.checked) {
                        data?.map((row_data) => data_arr.push(row_data.code));
                      }

                      return data_arr;
                    });

                    setRowUserInfo(() => {
                      let data_arr = [];
                      if (e.target.checked) {
                        data?.map((row_data) =>
                          data_arr.push({
                            profile_img: row_data?.profile_image,
                            user_info:
                              "[" +
                              getLastTeam(
                                row_data?.region,
                                row_data?.studio,
                                row_data?.branch,
                                row_data?.team
                              ) +
                              "]" +
                              " " +
                              row_data?.name +
                              " " +
                              row_data?.rank,
                          })
                        );
                      }
                      return data_arr;
                    });
                  }}
                  sx={{ padding: 0 }}
                  icon={
                    <Image
                      src={`/web_unchecked.png`}
                      width={22}
                      height={22}
                      alt=""
                    />
                  }
                  checkedIcon={
                    <Image
                      src={`/web_checked.png`}
                      width={22}
                      height={22}
                      alt=""
                    />
                  }
                  value={all_checked}
                  checked={all_checked}
                />
              </TableCell>
              {header?.map((data, key) => (
                <TableCell key={key} align="center">
                  {data}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.map((list, key) => {
              return (
                <TableRow key={key} sx={{ cursor: "pointer" }}>
                  <TableCell align="center">
                    <Checkbox
                      onClick={(e) => {
                        setRowCheck(() => {
                          const new_row_check = [...row_check];

                          if (!e.target.checked) {
                            delete new_row_check[key];
                          } else {
                            new_row_check[key] = list?.code;
                          }

                          return new_row_check;
                        });

                        setRowUserInfo(() => {
                          const new_row_user_ifo = [...row_user_info];

                          if (!e.target.checked) {
                            delete new_row_user_ifo[key];
                          } else {
                            new_row_user_ifo[key] = {
                              profile_img: list?.profile_image,
                              user_info:
                                "[" +
                                getLastTeam(
                                  list?.region,
                                  list?.studio,
                                  list?.branch,
                                  list?.team
                                ) +
                                "]" +
                                " " +
                                list?.name +
                                " " +
                                list?.rank,
                            };
                          }

                          return new_row_user_ifo;
                        });
                      }}
                      sx={{ padding: 0 }}
                      icon={
                        <Image
                          src={`/web_unchecked.png`}
                          width={22}
                          height={22}
                          alt=""
                        />
                      }
                      checkedIcon={
                        <Image
                          src={`/web_checked.png`}
                          width={22}
                          height={22}
                          alt=""
                        />
                      }
                      value={row_check[key]}
                      checked={row_check[key] ? true : false}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ width: "37px" }}>
                    <div
                      style={{
                        backgroundImage: `url(${list?.profile_image})`,
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        objectFit: "contain",
                        width: "32px",
                        height: "35px",
                        borderRadius: "50%",
                      }}
                    />
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color:
                        list?.status === "퇴직" || list?.status === "퇴직"
                          ? "#909090"
                          : "#000000",
                    }}
                    onClick={() => {
                      window.parent.postMessage(
                        {
                          message: "openApModal",
                          value: list?.code,
                        },
                        "*"
                      );
                    }}
                  >
                    {list?.status}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color:
                        list?.status === "퇴직" || list?.status === "퇴직"
                          ? "#909090"
                          : "#000000",
                    }}
                    onClick={() => {
                      window.parent.postMessage(
                        {
                          message: "openApModal",
                          value: list?.code,
                        },
                        "*"
                      );
                    }}
                  >
                    {list?.code}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color:
                        list?.status === "퇴직" || list?.status === "퇴직"
                          ? "#909090"
                          : "#000000",
                    }}
                    onClick={() => {
                      window.parent.postMessage(
                        {
                          message: "openApModal",
                          value: list?.code,
                        },
                        "*"
                      );
                    }}
                  >
                    {list?.name}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color:
                        list?.status === "퇴직" || list?.status === "퇴직"
                          ? "#909090"
                          : "#000000",
                    }}
                    onClick={() => {
                      window.parent.postMessage(
                        {
                          message: "openApModal",
                          value: list?.code,
                        },
                        "*"
                      );
                    }}
                  >
                    {list?.rank}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color:
                        list?.status === "퇴직" || list?.status === "퇴직"
                          ? "#909090"
                          : "#000000",
                    }}
                    onClick={() => {
                      window.parent.postMessage(
                        {
                          message: "openApModal",
                          value: list?.code,
                        },
                        "*"
                      );
                    }}
                  >
                    {list?.position}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color:
                        list?.status === "퇴직" || list?.status === "퇴직"
                          ? "#909090"
                          : "#000000",
                    }}
                    onClick={() => {
                      window.parent.postMessage(
                        {
                          message: "openApModal",
                          value: list?.code,
                        },
                        "*"
                      );
                    }}
                  >
                    {list?.phone}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color:
                        list?.status === "퇴직" || list?.status === "퇴직"
                          ? "#909090"
                          : "#000000",
                    }}
                    onClick={() => {
                      window.parent.postMessage(
                        {
                          message: "openApModal",
                          value: list?.code,
                        },
                        "*"
                      );
                    }}
                  >
                    {getDepthOfTeam(
                      list?.region,
                      list?.studio,
                      list?.branch,
                      list?.team
                    )}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color:
                        list?.status === "퇴직" || list?.status === "퇴직"
                          ? "#909090"
                          : "#000000",
                    }}
                    onClick={() => {
                      window.parent.postMessage(
                        {
                          message: "openApModal",
                          value: list?.code,
                        },
                        "*"
                      );
                    }}
                  >
                    {list?.join_date}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}
