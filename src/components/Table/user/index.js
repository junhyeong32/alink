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
  Typography,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import { useState } from "react";
import { userHeaderList } from "./userHedaderList";
import Button from "../../Button";
import Row from "../../Box/Row";
import MemoBox from "../../Box/Memo";
import CustomSwitch from "../../Switch";

export default function UserTable({ openModal, closeModal }) {
  const [all_checked, setAllChecked] = useState(false);
  const [checked, setChecked] = useState([]);
  const [bojang, setBojang] = useState(false);
  const [db, setDb] = useState(false);
  const [dna, setDna] = useState(false);

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
              {userHeaderList?.map((data, key) =>
                data.split(".")?.length === 2 ? (
                  <TableCell key={key} align="center" sx={{ width: "17px" }}>
                    <Row
                      justifyContent={"center"}
                      alignItems={"center"}
                      sx={{ cursor: "pointer", height: "100%" }}
                    >
                      <Image
                        src={data}
                        width={18}
                        height={18}
                        alt=""
                        layout="fixed"
                      />
                    </Row>
                  </TableCell>
                ) : (
                  <TableCell key={key} align="center">
                    {data}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="center">
                <CustomSwitch
                  checked={bojang}
                  onClick={(e) => {
                    openModal({
                      modal: "needConfirm",
                      content: {
                        contents: (
                          <Typography variant="h6">
                            <Typography variant="small">text</Typography>
                            <br />
                            {bojang
                              ? "보장DB를 OFF으로 설정하시겠습니까?"
                              : "보장DB를 ON으로 설정하시겠습니까?"}
                          </Typography>
                        ),
                        action: () => setBojang(e.target.checked),
                        buttonText: "확인",
                      },
                    });
                  }}
                />
              </TableCell>
              <TableCell align="center">
                <CustomSwitch
                  checked={db}
                  onClick={(e) => {
                    openModal({
                      modal: "needConfirm",
                      content: {
                        contents: (
                          <Typography variant="h6">
                            <Typography variant="small">text</Typography>
                            <br />
                            {db
                              ? "재무B를 OFF으로 설정하시겠습니까?"
                              : "재무B를 ON으로 설정하시겠습니까?"}
                          </Typography>
                        ),
                        action: () => setDb(e.target.checked),
                        buttonText: "확인",
                      },
                    });
                  }}
                />
              </TableCell>
              <TableCell align="center">
                <CustomSwitch
                  checked={dna}
                  onClick={(e) => {
                    openModal({
                      modal: "needConfirm",
                      content: {
                        contents: (
                          <Typography variant="h6">
                            <Typography variant="small">text</Typography>
                            <br />
                            {dna
                              ? "유전자DB를 OFF으로 설정하시겠습니까?"
                              : "유전자DB를 ON으로 설정하시겠습니까?"}
                          </Typography>
                        ),
                        action: () => setDna(e.target.checked),
                        buttonText: "확인",
                      },
                    });
                  }}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}
