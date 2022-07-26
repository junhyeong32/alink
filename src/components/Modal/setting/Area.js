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
import AreaTable from "../../Table/setting/Area";
import BackgroundInput from "../../Input/Background";

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

export default function Area({ index }) {
  const { enqueueSnackbar } = useSnackbar();
  const [area_list, setAreaList] = useState([]);

  const [parent_area, setParentArea] = useState("");
  const [menuItems, setMenuItems] = useState({});
  const [table_data, setTableData] = useState([]);
  const [division, setDivision] = useState([]);

  const [select, setSelect] = useState("");

  const [area_org, setAreaOrg] = useState({});

  const { modal, data, openModal, closeModal, modalContent } =
    useContext(ModalContext);

  // const { buttonAction } = modalContent[index];

  useEffect(() => {
    setMenuItems(() => {
      const obj = {};
      data[index]?.map((d, key) => {
        Object.assign(obj, { [d.parent]: d.parent });
      });
      return obj;
    });
  }, []);

  useEffect(() => {
    const foundIndex = data[index].findIndex((d) => d.parent === parent_area);

    setTableData(data[index][foundIndex]?.children);
  }, [parent_area]);

  console.log(modalContent);

  return (
    <Modal open={modal[index] === "area" ? true : false} onClose={closeModal}>
      <Box>
        <Column alignItems={"center"} justifyContent={"start"} sx={style}>
          <RowLabel label="담당 지역 설정" fs="h4"></RowLabel>
          <Row justifyContent={"between"} sx={{ width: "100%", mt: 3.1 }}>
            <Typography variant="h5">지역</Typography>
            <Button
              text="분할하기"
              fs="h6"
              w={62}
              h={20}
              action={() => {
                setDivision([...division, ""]);
              }}
            />
          </Row>
          <OutLineSelectInput
            w="100%"
            value={parent_area}
            setValue={setParentArea}
            menuItems={menuItems}
          />
          {division.length !== 0 && (
            <Column
              justifyContent={"start"}
              sx={{ width: "100%", mt: 1.3, gap: 1 }}
              wrap={"wrap"}
            >
              <Typography variant="h5">지역 분할</Typography>
              <Grid
                container
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  border: "3px solid #E2E2E2",
                  borderRadius: "5px",
                  gap: 1,
                  p: 1,
                }}
              >
                {division.map((d, key) => (
                  <Row sx={{ width: "100%" }} alignItems={"center"} key={key}>
                    <BackgroundInput
                      h={25}
                      onBlur={(e) => {
                        setDivision((prev) => {
                          const arr = [...prev];
                          arr[key] = e.target.value;

                          return arr;
                        });
                      }}
                      endAdornment={
                        <Image
                          src="/cancel.png"
                          width={15}
                          height={15}
                          alt="x"
                          layout="fixed"
                          className="pointer"
                          onClick={() =>
                            setDivision((prev) => {
                              const arr = [...prev];
                              arr.splice(key, 1);

                              return arr;
                            })
                          }
                        />
                      }
                    />
                  </Row>
                ))}
              </Grid>
            </Column>
          )}

          <Column
            justifyContent={"start"}
            sx={{ width: "100%", mt: 1.3, gap: 1 }}
          >
            <Typography variant="h5">
              상세 리스트 - {"지역" || parent_area}
            </Typography>
            <Column
              sx={{
                border: "3px solid #E2E2E2",
                borderRadius: "5px",
                gap: 1,
                p: 1,
              }}
            >
              <Column alignItems={"end"} sx={{ gap: 1 }}>
                <Button
                  text="소속설정"
                  fs="h6"
                  w={62}
                  h={20}
                  action={() => {
                    if (division.length === 0)
                      return enqueueSnackbar(
                        "분할 지역을 입력해 선택해주세요",
                        {
                          variant: "error",
                          autoHideDuration: 2000,
                        }
                      );
                    if (area_list.length === 0)
                      return enqueueSnackbar("지역을 선택해주세요", {
                        variant: "error",
                        autoHideDuration: 2000,
                      });

                    let obj = {};
                    division.map((d) => Object.assign(obj, { ...obj, [d]: d }));
                    openModal({
                      modal: "change",
                      data: obj,
                      content: {
                        title: "소속 설정",
                        buttonName: "설정",
                        buttonAction: setSelect,
                      },
                    });
                  }}
                />
                <AreaTable
                  data={table_data}
                  area_list={area_list}
                  setAreaList={setAreaList}
                />
              </Column>
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
                if (area_list.length === 0)
                  return enqueueSnackbar("지역을 선택해주세요", {
                    variant: "error",
                    autoHideDuration: 2000,
                  });

                buttonAction({
                  parent: parent_area,
                  name: select,
                  children: area_list,
                });
                closeModal(index);
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
          </Row>
        </Column>
      </Box>
    </Modal>
  );
}
