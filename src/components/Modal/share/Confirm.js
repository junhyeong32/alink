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
import { Modal, Box, Typography, Grid, Dialog } from "@mui/material";
import Column from "../../Box/Column";
import RowLabel from "../../Box/RowLabel";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import TopLabelContents from "../../Box/TopLableContents";
import Button from "../../Button";
import UnderLineSelectInput from "../../Input/Select";
import { OutLineInput } from "../../Input";
import Row from "../../Box/Row";

export default function Confirm({
  contents,
  action,
  actionText,
  visible,
  setVisible,
}) {
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Dia open={visible} onClose={() => setVisible(false)}>
      <Box
        sx={{
          width: { lg: "715px", md: "715px", sm: "715px", xs: "90%" },
          height: "322px",
          overflowX: "hidden",
          background: "#FFFFFF",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 5,
          boxShadow: 24,
          pt: 2,
          px: 4,
          pb: 3,
        }}
      >
        <Column alignItems={"center"} justifyContent={"center"}>
          <TopLabelContents title="확인필요" sx={{ pb: 1 }} />
          <Typography variant="normal">{contents}</Typography>
          <Row sx={{ mt: 2.7, gap: 5 }}>
            <Button
              text={actionText}
              w={166}
              h={52}
              fs={"h5"}
              onClick={action}
            />
            <Button
              text="취소"
              bgColor={"gray"}
              w={166}
              h={52}
              fs={"h5"}
              color="primary.white"
              action={() => setVisible(false)}
            />
          </Row>
        </Column>
      </Box>
    </Dia>
  );
}
