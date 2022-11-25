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
  FormControlLabel,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import { useState } from "react";
import { sms_header } from "./smsHeaderList";
import Button from "../../Button";
import Row from "../../Box/Row";
import { getTitleOfOrg } from "../../../utility/organization/getTitleOfOrg";
import { getAccessToken } from "../../../utility/getCookie";
import Axios from "../../../utility/api";

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
  }
`;

export default function SmsTable({ data, page, pks, setPks }) {
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
                  checked={pks.length > 19}
                  onClick={() =>
                    setPks(() => {
                      const result = [];
                      if (data?.length > pks.length) {
                        data?.map((d) => result.push(d?.pk));
                      }
                      return result;
                    })
                  }
                />
              </TableCell>
              {sms_header?.map((data, key) => (
                <TableCell key={key} align="center">
                  {data}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.map((sms, key) => (
              <TableRow
                key={key}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    background: "#F0EFEF",
                  },
                }}
              >
                <TableCell align="center">
                  <Checkbox
                    checked={pks.indexOf(sms?.pk) !== -1 ? true : false}
                    onClick={() =>
                      setPks((prev) => {
                        const newPks = [...prev];

                        const foundIndex = newPks.indexOf(sms.pk);

                        if (foundIndex === -1) {
                          newPks.push(sms?.pk);
                        } else {
                          newPks.splice(foundIndex, 1);
                        }

                        return newPks;
                      })
                    }
                  />
                </TableCell>
                <TableCell align="center">
                  {page === 1
                    ? key + 1
                    : page === 2
                    ? page * 10 + key + 1
                    : page * 10 + (page - 2) * 10 + key + 1}
                </TableCell>
                <TableCell align="center">{getTitleOfOrg(sms)}</TableCell>
                <TableCell align="center">{sms?.name}</TableCell>
                <TableCell align="center">{sms?.message}</TableCell>
                <TableCell align="center">{sms?.created_date}</TableCell>
                <TableCell align="center">
                  <Button
                    text="재발송"
                    bgColor={"primary"}
                    variant={"contained"}
                    color="primary.white"
                    w={50}
                    h={24}
                    fs="h6"
                    action={async () => {
                      const res = await Axios.Post(`notification/resend`, {
                        token: getAccessToken(),
                        notification_pks: sms?.pk,
                      });

                      if (res?.code === 200) {
                        enqueueSnackbar("재발송 되었습니디", {
                          variant: "success",
                          autoHideDuration: 2000,
                        });

                        setPks([]);
                      }
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}
