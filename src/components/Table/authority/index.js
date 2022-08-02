import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import CustomCheckBox from "../../CheckBox";
import { getOrgWithUnit } from "../../../utility/organization/getOrgWithUnit";
import { Box, styled } from "@mui/system";
import { useState } from "react";
import { authority_header } from "./authorityHedaerList";
import Button from "../../Button";
import Row from "../../Box/Row";
import { getTitleOfOrg } from "../../../utility/organization/getTitleOfOrg";
import { numberFormat } from "../../../utility/math";
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
    min-width: 80px;
  }
  td {
    padding: 8px;
    font-size: 12px;
  }
`;

export default function AuthorityTable({ data, checkList, setCheckList }) {
  const [checked, setChecked] = useState([]);

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
                <CustomCheckBox
                  checked={checkList.length > 19}
                  onClick={() =>
                    setCheckList(() => {
                      const result = [];
                      if (data?.length > checkList.length) {
                        data?.map((d) => result.push(d?.pk));
                      }
                      return result;
                    })
                  }
                />
              </TableCell>
              {authority_header?.map((data, key) => (
                <TableCell key={key} align="center">
                  {data}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {/* TODO
            프로필 이미지
          */}
          {console.log(checkList)}
          <TableBody>
            {data?.map((list, key) => (
              <TableRow key={key}>
                <TableCell align="center">
                  <CustomCheckBox
                    checked={checkList.indexOf(list?.pk) !== -1 ? true : false}
                    onClick={() =>
                      setCheckList((prev) => {
                        const newData = [...prev];

                        const foundIndex = newData.indexOf(list.pk);

                        if (foundIndex === -1) {
                          newData.push(list?.pk);
                        } else {
                          newData.splice(foundIndex, 1);
                        }

                        return newData;
                      })
                    }
                  />
                </TableCell>
                <TableCell align="center">{list?.status}</TableCell>
                <TableCell align="center">{list?.id}</TableCell>
                <TableCell align="center">{list?.name}</TableCell>
                <TableCell align="center">{list?.rank}</TableCell>
                <TableCell align="center">{getTitleOfOrg(list)}</TableCell>
                <TableCell align="center">
                  {numberFormat(list?.pay_amount)}
                </TableCell>
                <TableCell
                  sx={{
                    color:
                      list?.deposit_status === "입금 완료"
                        ? "#0D1D41"
                        : "#FF0000",
                  }}
                  align="center"
                >
                  {list?.deposit_status}
                </TableCell>
                <TableCell align="center">{list?.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}
