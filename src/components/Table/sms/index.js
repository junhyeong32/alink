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
import { sms_header } from "./smsHeaderList";
import Button from "../../Button";
import Row from "../../Box/Row";
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


export default function SmsTable({}) {
  const [all_checked, setAllChecked] = useState(false);
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
              {sms_header?.map((data, key) => (
                <TableCell key={key} align="center">
                  {data}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {/* <TableRow>
              <TableCell align="center">
                <Box sx={{ cursor: "pointer" }}>
                  <Image src="/preview.png" width={21} height={21} alt="" />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Row sx={{ gap: 1 }}>
                  <Button
                    variant="contained"
                    bgColor="primary"
                    text="수정"
                    color="primary.white"
                    fs="h6"
                    w={56}
                    h={17}
                  />
                  <Button
                    variant="contained"
                    bgColor="red"
                    text="삭제"
                    color="primary.white"
                    fs="h6"
                    w={56}
                    h={17}
                  />
                </Row>
              </TableCell>
            </TableRow> */}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}
