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
import { useContext, useState } from "react";
import { headerList } from "./headerList";
import Row from "../../Box/Row";
import RoundColorBox from "../../Box/RoundColorBox";
import { rank_list } from "../../../data/share/MenuByTextList";
import Column from "../../Box/Column";
import { useRouter } from "next/router";
import { ModalContext } from "../../../contexts/ModalContext";
import api from "../../../utility/api";
import { getAccessToken, getCookie } from "../../../utility/getCookie";
import { getTitleOfOrg } from "../../../utility/organization/getTitleOfOrg";
import Button from "../../Button";
import { useSnackbar } from "notistack";

const Root = styled("div")`
  table {
    box-shadow: none;
    width: 100%;
    height: 100%;
  }

  th {
    border-top: 3px solid #0d1d41;
    border-bottom: none;
    height: 45px;
    text-align: center;
    box-shadow: none;
    font-weight: bold;
    font-size: 12px;
    padding: 0;
    min-width: 100px;
  }
  td {
    padding: 8px;
    font-size: 12px;
    cursor: pointer;
  }
`;

export default function DbGiftTable({
  data,
  allocation_total,
  getUsers,
  checkData,
  setCheckData,
}) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [bojang, setBojang] = useState(false);
  const [db, setDb] = useState(false);
  const [dna, setDna] = useState(false);
  const [rank, setRank] = useState(getCookie("user_info")?.grade);

  const { openModal, closeModal } = useContext(ModalContext);

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
                  checked={
                    data?.length !== 0 && checkData.length === data?.length
                  }
                  onClick={() => {
                    setCheckData((prev) => {
                      let newData = [...prev];

                      if (newData.length === data?.length) {
                        return [];
                      } else {
                        newData = [];
                        data?.map((d) => newData.push(d?.pk));
                      }

                      console.log(newData, newData.length, data?.length);

                      return newData;
                    });
                  }}
                />
              </TableCell>
              {headerList?.map((data, key) => {
                return (
                  <TableCell key={key} align="center">
                    {data}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.map((user, key) => {
              return (
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
                      checked={checkData.indexOf(user?.pk) !== -1}
                      onClick={() => {
                        setCheckData((prev) => {
                          const newData = [...prev];

                          const foundIndex = newData.indexOf(user?.pk);

                          if (foundIndex === -1) newData.push(user?.pk);
                          else newData.splice(foundIndex, 1);

                          return newData;
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: user?.acfp < 300000 ? "#FD0202" : "#000000" }}
                  >
                    {user?.acfp < 300000 ? "미지원" : "지원"}
                  </TableCell>
                  <TableCell>
                    <Row justifyContent={"center"}>
                      <RoundColorBox w={61} background={rank_list[user?.grade]}>
                        {user?.grade}
                      </RoundColorBox>
                    </Row>
                  </TableCell>
                  <TableCell align="center">{getTitleOfOrg(user)}</TableCell>
                  <TableCell align="center">{user?.name}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}
