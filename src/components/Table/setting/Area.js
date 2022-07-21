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
import { areaHeaderList } from "./areaHeaderList";
import Button from "../../Button";
import Row from "../../Box/Row";
import RadioInput from "../../Radio";

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
    padding: 0;
  }
`;

export default function AreaTable({ data }) {
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
              {areaHeaderList?.map((data, key) => {
                if (data === "") {
                  return (
                    <TableCell key={key} align="center">
                      <RadioInput />
                    </TableCell>
                  );
                } else {
                  return (
                    <TableCell key={key} align="center">
                      {data}
                    </TableCell>
                  );
                }
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.map((list, key) => {
              return (
                <TableRow align="center" key={key}>
                  <TableCell align="center">
                    <RadioInput />
                  </TableCell>
                  <TableCell align="center">
                    <Row
                      alignItems={"center"}
                      justifyContent={"center"}
                      sx={{
                        background: "#E6E6E6",
                        borderRadius: "5px",
                      }}
                    >
                      {list}
                    </Row>
                  </TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}
