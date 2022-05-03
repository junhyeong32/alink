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
  Button,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { useState } from "react";
import getDepthOfTeam from "../../../hooks/share/getDepthOfTeam";
import getLastTeam from "../../../hooks/share/getLastTeam";
import { header } from "./productTableItems";
import Row from "../../Box/Row";

export default function ProductTable({
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
                        data?.map((row_data) => data_arr.push(row_data.pk));
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
                    color: list?.status === "미완료" ? "#A02222" : "#2D2D2D",
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
                            new_row_check[key] = list?.pk;
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
                      checked={row_check[key] ? true : false}
                    />
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: list?.status === "미완료" ? "#A02222" : "#797979",
                    }}
                  >
                    {list?.status}
                  </TableCell>
                  <TableCell align="center">{list?.recruiter_name}</TableCell>
                  <TableCell align="center">{list?.company_name}</TableCell>
                  <TableCell align="center">{list?.product_name}</TableCell>
                  <TableCell align="center">{list?.created_date}</TableCell>

                  <TableCell align="center">
                    <Row justifyContent="center" sx={{ gap: 1 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ width: "66px", height: "28px" }}
                        onClick={() => {
                          window.parent.postMessage(
                            {
                              message: "openApproveModal",
                              value: list?.pk,
                            },
                            "*"
                          );
                        }}
                      >
                        <Typography variant="h6" color="primary.white">
                          승인
                        </Typography>
                      </Button>
                      <Button
                        variant="contained"
                        color="red"
                        sx={{
                          width: "66px",
                          height: "28px",
                        }}
                        onClick={() => {
                          window.parent.postMessage(
                            {
                              message: "openCompanionModal",
                              value: list?.pk,
                            },
                            "*"
                          );
                        }}
                      >
                        <Typography variant="h6" color="primary.white">
                          반려
                        </Typography>
                      </Button>
                    </Row>
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
