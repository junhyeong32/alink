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
import {
  Modal,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Pagination,
  Button,
} from "@mui/material";
import Column from "../../Box/Column";
import RowLabel from "../../Box/RowLabel";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import TopLabelContents from "../../Box/TopLableContents";
import Grid from "../../Box/Grid";

import UnderLineSelectInput, {
  LabelOutLineSelectInput,
} from "../../Input/Select";
import { OutLineInput } from "../../Input";
import Row from "../../Box/Row";
import { ModalContext } from "../../../contexts/ModalContext";
import UnderLineInput from "../../Input";
import { LabelUnderLineInput } from "../../Input";
import DbGiftTable from "../../Table/db-gift";
import { useRouter } from "next/router";
import Carousel from "nuka-carousel/lib/carousel";

const style = {
  width: { lg: 581, md: 581, sm: "90%", xs: "90%" },
  height: "95%",
  overflowX: "hidden",
  background: "#FFFFFF",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  padding: 2,
};

export default function Imageslider({ index }) {
  const [select, setSelect] = useState("");
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const [slideIndex, setSlideIndex] = useState(0);

  const { modal, data, openModal, closeModal, modalContent } =
    useContext(ModalContext);

  console.log(modal);

  return (
    <Modal
      open={modal[index] === "imageslider" ? true : false}
      onClose={closeModal}
      //   onKeyDown={(ev) => {
      //     if (ev.key === "Escape") {
      //       closeModal(index);
      //     }
      //   }}
    >
      <Box>
        <Column alignItems={"center"} justifyContent={"start"} sx={style}>
          <Row justifyContent={"end"} sx={{ width: "100%", mb: 1 }}>
            <Image
              src="/black_x.png"
              width={15}
              height={15}
              alt="x"
              className="cursor"
              onClick={closeModal}
            />
          </Row>
          <Carousel
            defaultControlsConfig={{
              pagingDotsStyle: {
                display: "none",
              },
            }}
            slideIndex={slideIndex}
            renderCenterLeftControls={({ previousSlide, goToSlide }) => (
              <Button
                className="prev_button"
                sx={{
                  left: "-130px",
                }}
                onClick={(e) => {
                  //   goToSlide(slideIndex - 1);
                  setSlideIndex(slideIndex - 1);

                  if (slideIndex === 0) {
                    goToSlide(
                      data[index]?.filter(
                        (v, _key) =>
                          v?.title === "AS이미지" &&
                          v?.value &&
                          v?.value.includes("https")
                      )?.length - 1
                    );
                    setSlideIndex(
                      data[index]?.filter(
                        (v, _key) =>
                          v?.title === "AS이미지" &&
                          v?.value &&
                          v?.value.includes("https")
                      )?.length - 1
                    );
                  }
                }}
              >
                <Image src="/prev_button.png" width={21} height={32} />
              </Button>
            )}
            renderCenterRightControls={({ nextSlide, goToSlide }) => (
              <Button
                className="next_button"
                sx={{
                  right: "-130px",
                }}
                onClick={() => {
                  //   goToSlide(slideIndex + 1);
                  setSlideIndex(slideIndex + 1);

                  if (
                    data[index]?.filter(
                      (v, _key) =>
                        v?.title === "AS이미지" &&
                        v?.value &&
                        v?.value.includes("https")
                    )?.length -
                      1 ===
                    slideIndex
                  ) {
                    goToSlide(0);
                    setSlideIndex(0);
                  }
                }}
              >
                <Image src="/next_button.png" width={21} height={32} />
              </Button>
            )}
          >
            {data[index]?.map(
              (v, _key) =>
                v?.title === "AS이미지" &&
                v?.value &&
                v?.value.includes("https") && (
                  <Column sx={{ border: "1px solid black" }} key={_key}>
                    <Image
                      src={v?.value || "/"}
                      width={321}
                      height={612}
                      alt=""
                    />
                  </Column>
                )
            )}
          </Carousel>

          <Grid
            // wrap="wrap"
            itemCount={[4, 4, 4, 2]}
            sx={{
              width: "100%",
              mt: 2,
              border: "1px solid #909090",
              borderRadius: "5px",
            }}
          >
            {data[index]
              ?.filter(
                (d, _key) =>
                  d?.title === "AS이미지" &&
                  d?.value &&
                  d?.value.includes("https")
              )
              ?.map((v, key) => (
                <Column
                  key={key}
                  alignItems={"center"}
                  sx={{
                    position: "relative",
                    p: 1,
                  }}
                >
                  {key === slideIndex && (
                    <Row
                      sx={{
                        width: 100,
                        height: 140,
                        background: "rgba(0, 0, 0, 0.5)",
                        position: "absolute",
                        zIndex: 1,
                      }}
                    />
                  )}

                  <Image
                    src={v?.value || "/"}
                    width={"100%"}
                    height={140}
                    alt=""
                  />
                  <Typography variant="h6" mb={1} align="center">
                    {data[index].filter((v) => v?.title === "고객명")?.[0]
                      ?.value + "고객님"}{" "}
                    <br />
                    {v?.created_date}
                  </Typography>
                  <a href={v?.value} target="_blank" rel="noreferrer">
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        width: 80,
                        height: 20,
                      }}
                      // action={() => {}}
                    >
                      <Typography variant="h6">다운로드</Typography>
                    </Button>
                  </a>
                </Column>
              ))}
          </Grid>
        </Column>
      </Box>
    </Modal>
  );
}
