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
} from "@mui/material";
import { styled } from "@mui/system";
import { useState } from "react";

export default function CustomTable({
  header,
  data,
  row_check,
  setRowCheck,
  params,
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
                <TableRow
                  key={key}
                  sx={{
                    cursor: "pointer",
                    color: !list?.matched
                      ? "#2D2D2D"
                      : !list?.signed
                      ? "#2D2D2D"
                      : list?.type === "camera" && list?.status === "확인필요"
                      ? "#2D2D2D"
                      : list?.type === "camera" && list?.status === "보완"
                      ? "#2D2D2D"
                      : "#909090",
                  }}
                >
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
                      checked={row_check[key] === list?.code ? true : false}
                    />
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: !list?.matched
                        ? "#C14327"
                        : !list?.signed
                        ? "#0F7BB8"
                        : list?.type === "camera" && list?.status === "확인필요"
                        ? "#FFC700"
                        : list?.type === "camera" && list?.status === "보완"
                        ? "#0D1D41"
                        : "#797979",
                    }}
                    onClick={() => {
                      window.parent.postMessage(
                        {
                          message: "openUserModal",
                          value: { code: list.code, key: key, params: params },
                        },
                        "*"
                      );
                    }}
                  >
                    {!list?.matched
                      ? "매칭실패"
                      : !list?.signed
                      ? "미서명"
                      : list?.type === "camera" && list?.status === "확인필요"
                      ? "확인필요"
                      : list?.type === "camera" && list?.status === "보완"
                      ? "보완"
                      : "완료"}
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => {
                      window.parent.postMessage(
                        {
                          message: "openUserModal",
                          value: { code: list.code, key: key, params: params },
                        },
                        "*"
                      );
                    }}
                  >
                    {list?.type === "write" ? "직접생성" : "촬영생성"}
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => {
                      window.parent.postMessage(
                        {
                          message: "openUserModal",
                          value: { code: list.code, key: key, params: params },
                        },
                        "*"
                      );
                    }}
                  >
                    {list?.recruiter.name}
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => {
                      window.parent.postMessage(
                        {
                          message: "openUserModal",
                          value: { code: list.code, key: key, params: params },
                        },
                        "*"
                      );
                    }}
                  >
                    {list?.contractor.name}{" "}
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => {
                      window.parent.postMessage(
                        {
                          message: "openUserModal",
                          value: { code: list.code, key: key, params: params },
                        },
                        "*"
                      );
                    }}
                  >
                    {list?.subscription_number}
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => {
                      window.parent.postMessage(
                        {
                          message: "openUserModal",
                          value: { code: list.code, key: key, params: params },
                        },
                        "*"
                      );
                    }}
                  >
                    {list?.stock_number}
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => {
                      window.parent.postMessage(
                        {
                          message: "openUserModal",
                          value: { code: list.code, key: key, params: params },
                        },
                        "*"
                      );
                    }}
                  >
                    {list?.insurance.company_name}
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => {
                      window.parent.postMessage(
                        {
                          message: "openUserModal",
                          value: { code: list.code, key: key, params: params },
                        },
                        "*"
                      );
                    }}
                  >
                    {list?.insurance.product_name}
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => {
                      window.parent.postMessage(
                        {
                          message: "openUserModal",
                          value: { code: list.code, key: key, params: params },
                        },
                        "*"
                      );
                    }}
                  >
                    {list?.contract_date}
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => {
                      window.parent.postMessage(
                        {
                          message: "openUserModal",
                          value: { code: list.code, key: key, params: params },
                        },
                        "*"
                      );
                    }}
                  >
                    {list?.sign_date || "-"}{" "}
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => {
                      window.parent.postMessage(
                        {
                          message: "openUserModal",
                          value: { code: list.code, key: key, params: params },
                        },
                        "*"
                      );
                    }}
                  >
                    {list?.created_date}
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
