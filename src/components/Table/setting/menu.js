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
import { useContext, useState } from "react";
import { menu_header } from "./menuHeaderList";
import Button from "../../Button";
import Row from "../../Box/Row";
import { ModalContext } from "../../../contexts/ModalContext";
import { useRouter } from "next/router";
import api from "../../../utility/api";
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

export default function MenuTable({ data, getMenus }) {
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
              {menu_header?.map((data, key) => (
                <TableCell key={key} align="center">
                  {data}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.map((list, key) => {
              return (
                <TableRow
                  align="center"
                  key={key}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      background: "#F0EFEF",
                    },
                  }}
                >
                  <TableCell align="center">
                    {list?.organizations?.map((org) => org.name).join(", ")}
                  </TableCell>
                  <TableCell align="center">{list?.title}</TableCell>
                  <TableCell align="center">
                    {list?.cooperation_organizations
                      ?.map((cop) => cop.name)
                      .join(", ")}
                  </TableCell>
                  <TableCell align="center">
                    {list?.is_activated === 0 ? "비활성화" : "활성화"}
                  </TableCell>
                  <TableCell align="center">
                    {list?.updated_date.slice(0, 10)}
                  </TableCell>
                  <TableCell align="center">
                    <Row justifyContent={"center"} sx={{ gap: 1 }}>
                      <Button
                        variant="contained"
                        bgColor="primary"
                        text="수정"
                        color="primary.white"
                        fs="h6"
                        w={56}
                        h={17}
                        action={() => router.push(`/setting/menu/${list?.pk}`)}
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
                              text: "메뉴를 삭제하시겠습니까?",
                              action: async () => {
                                const res = await api.Post("db/menu/delete", {
                                  token: getAccessToken(),
                                  db_pk: list?.pk,
                                });

                                if (res?.code === 200) {
                                  enqueueSnackbar("삭제되었습니다.", {
                                    variant: "success",
                                    autoHideDuration: 2000,
                                  });
                                  closeModal();
                                  getMenus();
                                }
                              },
                            },
                          })
                        }
                      />
                    </Row>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}
