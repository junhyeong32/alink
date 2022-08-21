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
import UnderLineInput from "../../Input";

const style = {
  width: { lg: "411px", md: "411px", sm: "411px", xs: "90%" },
  height: "185px",
  overflowX: "hidden",
  background: "#FFFFFF",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  p: 2.7,
};

export default function Division({ index }) {
  const [select, setSelect] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const { modal, data, openModal, closeModal, modalContent } =
    useContext(ModalContext);

  const { value, setValue, selectedParent, geomaps } = data[index];
  

  return (
    <Modal
      open={modal[index] === "division" ? true : false}
      onClose={() => closeModal(index)}
    >
      <Box>
        <Column alignItems={"center"} justifyContent={"center"} sx={style}>
          <Column
            alignItems={"center"}
            justifyContent={"center"}
            sx={{ width: "100%", height: "100%", gap: "25px" }}
          >
            <TopLabelContents title="확인 필요" sx={{ pb: 1 }} />
            <UnderLineInput value={select} setValue={setSelect} />
            <Row sx={{ gap: 2.5 }}>
              <Button
                text={"확인"}
                bgColor="primary"
                color="primary.white"
                w={97}
                h={30}
                fs={"h4"}
                action={() => {
                  const addedSplitedGeo = "";
                  setValue((prevState) => {
                    if (
                      prevState.filter((geo) => geo.name === addedSplitedGeo)
                        .length > 0
                    )
                      return prevState; // 중복됨

                    return [
                      ...prevState,
                      {
                        parent: geomaps[selectedParent].name,
                        name: select,
                        children: [],
                      },
                    ];
                  });
                  closeModal(index);
                }}
              />
              <Button
                text="취소"
                w={97}
                h={30}
                bgColor={"gray"}
                color={"primary.white"}
                fs={"h4"}
                action={() => {
                  closeModal(index);
                }}
              />
            </Row>
          </Column>
        </Column>
      </Box>
    </Modal>
  );
}
