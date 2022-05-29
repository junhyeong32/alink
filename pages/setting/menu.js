import { useContext, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../src/components/Layout";
import Column from "../../src/components/Box/Column";
import Row from "../../src/components/Box/Row";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Checkbox,
  Box,
  FormLabel,
  FormControlLabel,
  Radio,
} from "@mui/material";

import ReceptionStatusTable from "../../src/components/Table/data-status/ReceptionStatusTable";
import {
  select_title,
  area_input,
  headquarters_input,
  branch_input,
} from "../../src/components/Table/data-status/ReceptionStatusList";
import TopLabelContents from "../../src/components/Box/TopLableContents";
import RoundColorBox from "../../src/components/Box/RoundColorBox";
import {
  status_list,
  status_bgcolor,
  rank_list,
  rank_bgcolor,
} from "../../src/data/user";
import Button from "../../src/components/Button";
import Input, { DateInput, OutLineInput } from "../../src/components/Input";
import SelectInput, {
  OutLineSelectInput,
} from "../../src/components/Input/Select";
import RowLabel from "../../src/components/Box/RowLabel";
import {
  list_filter,
  list_detail,
  additionsal_func,
} from "../../src/data/setting/menu";
import Image from "next/image";
import RadioInput from "../../src/components/Radio";
import { ModalContext } from "../../src/contexts/ModalContext";
export default function Menu() {
  const router = useRouter();
  const [menu, setMenu] = useState("popup");
  const [area, setArea] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState("");
  const [excel, setExcel] = useState("");

  const [date_range, setDateRange] = useState([null, null]);
  const { openModal } = useContext(ModalContext);
  return (
    <Layout>
      <Column sx={{ gap: 4.7, width: { xs: "100%", sm: 550 } }}>
        <Column sx={{ gap: 1 }}>
          <Typography variant="h1">DB 추가</Typography>
          <RowLabel label="제목" label_w={68}>
            <OutLineInput w={231} />
          </RowLabel>
          <RowLabel label="협력사" label_w={68}>
            <FormControlLabel label="유" control={<RadioInput />} />
            <FormControlLabel label="무" control={<RadioInput />} />
          </RowLabel>
          <RowLabel label="샘플 업로드" label_w={68}>
            <OutLineInput w={231} />
            <Button
              text="파일선택"
              bgColor="excel"
              color="primary.white"
              w={60}
              h={20}
              fs="h6"
            />
          </RowLabel>
          <RowLabel label="활성화" label_w={68}>
            <FormControlLabel label="활성화" control={<RadioInput />} />
            <FormControlLabel label="비활성화" control={<RadioInput />} />
          </RowLabel>
        </Column>

        <Column>
          <Typography variant="h1">리스트 필터</Typography>
          {list_filter.map((list, key) => {
            if (list === "지역") {
              return (
                <RowLabel label_w={68} key={key} label={list}>
                  <FormControlLabel label="노출" control={<RadioInput />} />
                  <FormControlLabel label="미노출" control={<RadioInput />} />
                  <Button
                    text="지역 설정"
                    w={60}
                    h={20}
                    fs="h6"
                    action={() => openModal({ modal: "area" })}
                  />
                </RowLabel>
              );
            } else
              return (
                <RowLabel label_w={68} key={key} label={list}>
                  <FormControlLabel label="노출" control={<RadioInput />} />
                  <FormControlLabel label="미노출" control={<RadioInput />} />
                </RowLabel>
              );
          })}
        </Column>

        <Column>
          <Typography variant="h1">리스트 상세</Typography>
          {list_detail.map((list, key) => (
            <RowLabel
              label_w={68}
              key={key}
              label={list}
              columnGap={{
                lg: "35px",
                md: "35px",
                sm: "35px",
                xs: "20px",
              }}
            >
              <FormControlLabel label="노출" control={<RadioInput />} />
              <FormControlLabel label="미노출" control={<RadioInput />} />
              <FormControlLabel label="리스트 노출" control={<RadioInput />} />
              <Row sx={{ gap: 1 }}>
                <Box sx={{ cursor: "pointer" }}>
                  <Image
                    src="/up.png"
                    width={14}
                    height={9}
                    alt=""
                    layout="fixed"
                  />
                </Box>
                <Box sx={{ cursor: "pointer" }}>
                  <Image
                    src="/down.png"
                    width={14}
                    height={9}
                    alt=""
                    layout="fixed"
                  />
                </Box>
              </Row>
            </RowLabel>
          ))}
        </Column>

        <Row justifyContent={"center"}>
          <Image src="/+.png" width={28} height={28} alt="+" />
        </Row>

        <Column>
          <Typography variant="h1">추가기능</Typography>
          {additionsal_func.map((list, key) => (
            <RowLabel label_w={68} key={key} label={list}>
              <FormControlLabel label="노출" control={<RadioInput />} />
              <FormControlLabel label="미노출" control={<RadioInput />} />
            </RowLabel>
          ))}
        </Column>

        <Row justifyContent={"center"} sx={{ gap: 1.5 }}>
          <Button
            variant="contained"
            bgColor="primary"
            text="등록"
            color="primary.white"
            fs="h6"
            w={120}
            h={28}
          />
          <Button
            variant="contained"
            bgColor="gray"
            text="취소"
            color="primary.white"
            fs="h6"
            w={120}
            h={28}
          />
        </Row>
      </Column>
    </Layout>
  );
}
