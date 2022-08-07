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
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { popup_header } from "./popupHeaderList";
import Button from "../../Button";
import Row from "../../Box/Row";
import { ModalContext } from "../../../contexts/ModalContext";
import Axios from "../../../utility/api";
import { getAccessToken } from "../../../utility/getCookie";
import { useSnackbar } from "notistack";

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

export default function PopupTable({ data, getList }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

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
              {popup_header?.map((data, key) => (
                <TableCell key={key} align="center">
                  {data}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.map((list, key) => (
              <TableRow
                key={key}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    background: "#F0EFEF",
                  },
                }}
              >
                <TableCell align="center">{list?.pk}</TableCell>
                <TableCell align="center">{list?.organization_name}</TableCell>
                <TableCell align="center">{list?.title}</TableCell>
                <TableCell align="center">{list?.size}</TableCell>
                <TableCell align="center">{list?.activate}</TableCell>
                <TableCell align="center">{list?.created_date}</TableCell>

                <TableCell align="center">
                  <Box sx={{ cursor: "pointer" }}>
                    <Image
                      src="/preview.png"
                      width={21}
                      height={21}
                      alt=""
                      onClick={() =>
                        openModal({
                          modal: "popup",
                          data: list,
                        })
                      }
                    />
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Row
                    alignItems={"center"}
                    justifyContent={"center"}
                    sx={{ gap: 1 }}
                  >
                    <Button
                      variant="contained"
                      bgColor="primary"
                      text="수정"
                      color="primary.white"
                      fs="h6"
                      w={56}
                      h={17}
                      action={() => router.push(`/setting/popup/${list?.pk}`)}
                    />
                    <Button
                      variant="contained"
                      bgColor="red"
                      text="삭제"
                      color="primary.white"
                      fs="h6"
                      w={56}
                      h={17}
                      action={() =>
                        openModal({
                          modal: "needconfirm",
                          content: {
                            buttonText: "삭제",
                            contents: "팝업을 삭제하시겠습니까?",
                            action: async () => {
                              const res = await Axios.Post("popup/remove", {
                                token: getAccessToken(),
                                popup_pk: list?.pk,
                              });
                              if (res?.code === 200) {
                                enqueueSnackbar("팝업이 삭제되었습니다.", {
                                  variant: "success",
                                  autoHideDuration: 2000,
                                });
                                closeModal();
                                getList();
                              }
                            },
                          },
                        })
                      }
                    />
                  </Row>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}
