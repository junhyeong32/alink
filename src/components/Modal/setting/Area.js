import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  useContext,
  useEffect,
  useRef,
  useState,
  forwardRef,
  createRef,
} from "react";
import { Modal, Box, Typography, Grid, Divider } from "@mui/material";
import Column from "../../Box/Column";
import RowLabel from "../../Box/RowLabel";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import TopLabelContents from "../../Box/TopLableContents";
import Button from "../../Button";
import UnderLineSelectInput from "../../Input/Select";
import { OutLineInput } from "../../Input";
import Row from "../../Box/Row";
import { ModalContext } from "../../../contexts/ModalContext";
import OutLineSelectInput from "../../Input/Select";
// import AreaTable from "../../Table/setting/area";
import NeedConfirmModal from "../share/NeedConfirm";

const style = {
  width: { lg: "322px", md: "322px", sm: "322px", xs: "90%" },
  height: "784px",
  overflowX: "hidden",
  background: "#FFFFFF",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  p: 3,
};

export default function Area() {
  const { enqueueSnackbar } = useSnackbar();
  const [area_list, setAreaList] = useState([]);
  const { visible, openModal, closeModal, modalContent } =
    useContext(ModalContext);

  const [needConfirmModalViisible, setNeedConfirmModalViisible] =
    useState(false);

  return (
    <Modal open={visible} onClose={closeModal}>
      <Box>
        <Column alignItems={"center"} justifyContent={"start"} sx={style}>
          <RowLabel label="담당 지역 설정" fs="h4"></RowLabel>
          <Row justifyContent={"between"} sx={{ width: "100%", mt: 3.1 }}>
            <Typography variant="h6">지역</Typography>
            <Button text="분할하기" fs="h6" w={62} h={15} />
          </Row>
          <OutLineSelectInput w="100%" menuItems={{}} />

          <Column justifyContent={"start"} sx={{ width: "100%", mt: 1.3 }}>
            <Typography variant="h6">상세 리스트 - 지역</Typography>
            <Column
              sx={{
                border: "3px solid #E2E2E2",
                borderRadius: "5px",
                gap: 1,
                p: 1,
              }}
            >
              <Row justifyContent={"between"} sx={{ width: "100%" }}>
                <Typography variant="h6">지역</Typography>
                <Button text="소속설정" fs="h6" w={62} h={15} />
              </Row>

              {/* <AreaTable /> */}
            </Column>
          </Column>
          <Row sx={{ mt: 3, gap: 1 }}>
            <Button
              text="등록"
              fs="h6"
              color="primary.white"
              w={100}
              h={20}
              action={() => {
                if (area_list.length === 0) setNeedConfirmModalViisible(true);
                else {
                  closeModal();
                }
              }}
            />
            <Button
              text="취소"
              bgColor={"gray"}
              fs="h6"
              color="primary.white"
              w={100}
              h={20}
              action={closeModal}
            />
            {needConfirmModalViisible && (
              <NeedConfirmModal
                doubleVisible={needConfirmModalViisible}
                setdoubleVisible={setNeedConfirmModalViisible}
              />
            )}
          </Row>
        </Column>
      </Box>
    </Modal>
  );
}
