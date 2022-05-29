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
import { menu_header } from "./menuHeaderList";
import Button from "../../Button";
import Row from "../../Box/Row";

export default function MenuTable({}) {
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
      min-width: 80px;
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
              {menu_header?.map((data, key) => (
                <TableCell key={key} align="center">
                  {data}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell>
                <Row sx={{ gap: 1 }}>
                  <Box sx={{ cursor: "pointer" }}>
                    <Image src="/up.png" width={14} height={9} alt="" />
                  </Box>
                  <Box sx={{ cursor: "pointer" }}>
                    <Image src="/down.png" width={14} height={9} alt="" />
                  </Box>
                </Row>
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
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}
