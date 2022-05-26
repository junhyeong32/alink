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
import { Modal, Box, Typography, Grid } from "@mui/material";
import Column from "../../Box/Column";
import RowLabel from "../../Box/RowLabel";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import TopLabelContents from "../../Box/TopLableContents";
import Button from "../../Button";
import UnderLineSelectInput from "../../Input/Select";
import { OutLineInput } from "../../Input";
import Row from "../../Box/Row";

export default function Upload({ visible, setVisible }) {
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Modal open={visible} onClose={() => setVisible(false)}>
      <Box>
        <Column
          alignItems={"center"}
          justifyContent={"center"}
          sx={{
            width: "715px",
            height: "322px",
            overflowX: "hidden",
            background: "#FFFFFF",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            pt: 2,
            px: 4,
            pb: 3,
          }}
        >
          <TopLabelContents title="파일 업로드">
            <RowLabel label="Sample">
              <Button text="다운로드" />
            </RowLabel>
            <RowLabel label="관련 파일">
              <OutLineInput />
              <Button text="다운로드" />
            </RowLabel>
            <Row>
              <Button text="변경" />
              <Button text="취소" action={() => setVisible(false)} />
            </Row>
          </TopLabelContents>
        </Column>
      </Box>
    </Modal>
  );
}
