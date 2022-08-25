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

export default function AreaTable({ data, area_list, setAreaList }) {
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
                      <RadioInput
                        checked={
                          area_list.length === data.length && data.length !== 0
                        }
                        onClick={() =>
                          setAreaList((prev) => {
                            const new_data = [...prev];

                            if (new_data.length < data.length) return [data];
                            return [];
                          })
                        }
                      />
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
                    <RadioInput
                      checked={
                        area_list.indexOf(
                          typeof list === "object" ? list?.area : list
                        ) !== -1
                          ? true
                          : false
                      }
                      onClick={(e) => {
                        if (!e.target.checked) {
                          setAreaList((prev) => {
                            const new_area = [...prev];
                            const foundIndex = new_area.indexOf(list);

                            new_area.splice(key, 1);
                            return new_area;
                          });
                        } else {
                          setAreaList((prev) => [
                            ...prev,
                            typeof list === "object" ? list?.area : list,
                          ]);
                        }
                      }}
                    />
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
                      {list?.area || list}
                    </Row>
                  </TableCell>
                  <TableCell align="center">{list?.org}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}
