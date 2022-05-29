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
import { bojangHeaderList } from "./bojangHedaderList";
import Button from "../../Button";
import Row from "../../Box/Row";
import MemoBox from "../../Box/Memo";

export default function BojangTable({ openModal, closeModal }) {
  const [all_checked, setAllChecked] = useState(false);
  const [checked, setChecked] = useState([]);
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
              {bojangHeaderList?.map((data, key) => (
                <TableCell key={key} align="center">
                  {data}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell>
                <Box sx={{ cursor: "pointer" }}>
                  <Image
                    src="/recording.png"
                    width={19}
                    height={23}
                    alt=""
                    onClick={() =>
                      openModal({
                        modal: "readFile",
                        content: {
                          contents: "hi",
                        },
                      })
                    }
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box sx={{ cursor: "pointer" }}>
                  <Image
                    src="/memo.png"
                    width={25}
                    height={25}
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
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}
