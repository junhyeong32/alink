import Image from "next/image";
import { useCookies } from "react-cookie";
import { Button, Typography } from "@mui/material";
import Column from "../Box/Column";
import Row from "../Box/Row";
import styles from "./styles";
import useGetGroupList from "../../hooks/share/useGetGroupList";
import { ModalContext } from "../../contexts/ModalContext";
import { useContext } from "react";
import { OrganizationContext } from "../../contexts/OrganizationListContext";
import { useRouter } from "next/router";

export default function OrganizationList() {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies();
  const group_list = useGetGroupList(cookies);
  const {
    modal_list,
    modal_data,
    addModalList,
    deleteModalList,
    addModalData,
  } = useContext(ModalContext);

  const { open, setOpenVisible } = useContext(OrganizationContext);

  return (
    <>
      <Column
        alignItems="center"
        sx={{
          ...styles.organization_container,
          // position: open && router.asPath !== "/apManagement" && "absolute",
          // display: open ? "flex" : "none",
        }}
      >
        <Row
          justifyContent="end"
          sx={{
            border: "1px solid black",
            width: "100%",
            // padding: "20px 18px 0 0",
            cursor: "pointer",
            // display: router.asPath === "/apManagement" && "none",
          }}
        >
          <Image
            src="/x.png"
            width={24}
            height={24}
            alt=""
            onClick={() => setOpenVisible(false)}
          />
        </Row>
        <Button
          variant="contained"
          sx={{ borderRadius: "3px" }}
          onClick={() => {
            window.parent.postMessage(
              {
                message: "openMessageModal",
                value: {
                  row_check: modal_data?.row_check,
                  row_user_info: modal_data?.row_user_info,
                },
              },
              "*"
            );
          }}
        >
          <Typography variant="h6"> 선택한 조직에 알림 보내기</Typography>
        </Button>

        {/* <OrganizationList group_list={group_list} /> */}
      </Column>
    </>
  );
}
