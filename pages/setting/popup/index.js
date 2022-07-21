import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../src/components/Layout";
import Column from "../../../src/components/Box/Column";
import Row from "../../../src/components/Box/Row";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Checkbox,
  Box,
  FormControlLabel,
  Radio,
} from "@mui/material";

import ReceptionStatusTable from "../../../src/components/Table/data-status/ReceptionStatusTable";
import {
  select_title,
  area_input,
  headquarters_input,
  branch_input,
} from "../../../src/components/Table/data-status/ReceptionStatusList";
import TopLabelContents from "../../../src/components/Box/TopLableContents";
import RoundColorBox from "../../../src/components/Box/RoundColorBox";
import {
  status_list,
  status_bgcolor,
  rank_list,
  rank_bgcolor,
} from "../../../src/data/user";
import ExcelButton from "../../../src/components/Button/Excel";
import Input, { DateInput, OutLineInput } from "../../../src/components/Input";
import SelectInput, {
  OutLineSelectInput,
} from "../../../src/components/Input/Select";
import Button from "../../../src/components/Button";
import RowLabel from "../../../src/components/Box/RowLabel";
import RadioInput from "../../../src/components/Radio";
import Editor from "../../../src/components/Editor";

export default function Popup() {
  const router = useRouter();
  const [menu, setMenu] = useState("popup");
  const [scale, setScale] = useState("");
  const [date_range, setDateRange] = useState([null, null]);
  const [editor, setEditor] = useState("");

  console.log(editor);

  return (
    <Layout>
      <Column sx={{ gap: 2, maxWidth: 927 }}>
        <RowLabel label="조직" fs="h4" label_w={45}>
          <OutLineSelectInput menuItems={{}} />
        </RowLabel>
        <RowLabel label="유형" fs="h4" label_w={45}>
          <FormControlLabel label="레이어 팝업" control={<RadioInput />} />
          <FormControlLabel label="윈도우 팝업" control={<RadioInput />} />
        </RowLabel>
        <RowLabel label="제목" fs="h4" label_w={45}>
          <OutLineInput w="70%" />
        </RowLabel>
        <RowLabel label="위치" fs="h4" label_w={45}>
          <OutLineSelectInput menuItems={{}} />
        </RowLabel>
        <RowLabel label="크기" fs="h4" label_w={45}>
          <Column>
            <Row wrap={"wrap"}>
              <FormControlLabel
                label="대(가로:600, 세로:800)"
                control={<RadioInput />}
              />
              <FormControlLabel
                label="중(가로:600, 세로:800)"
                control={<RadioInput />}
              />
              <FormControlLabel
                label="소(가로:600, 세로:800)"
                control={<RadioInput />}
              />
              <FormControlLabel
                label="사용자 지정"
                control={
                  <RadioInput
                    checked={scale === "custom"}
                    onClick={() => setScale("custom")}
                  />
                }
              />
            </Row>
            {scale === "custom" && (
              <Row justifyContent={"end"} sx={{ width: "100%", gap: 1 }}>
                <Row alignItems={"center"}>
                  <Typography variant="h6">가로</Typography>
                  <OutLineInput w={65} sx={{ ml: 1, mr: 0.5 }} />
                  <Typography variant="h6">px</Typography>
                </Row>
                <Row alignItems={"center"}>
                  <Typography variant="h6">세로</Typography>
                  <OutLineInput w={65} sx={{ ml: 1, mr: 0.5 }} />
                  <Typography variant="h6">px</Typography>
                </Row>
              </Row>
            )}
          </Column>
        </RowLabel>
        <RowLabel label="활성화" fs="h4" label_w={45}>
          <OutLineSelectInput menuItems={{}} />
        </RowLabel>

        <Editor value={editor} onChange={(e) => setEditor(e)} />

        <Row
          justifyContent={"center"}
          sx={{ mt: "70px", maxWidth: "1039px", gap: 1 }}
        >
          <Button
            variant="contained"
            bgColor="primary"
            text="등록"
            color="primary.white"
            fs="h6"
            w={160}
            h={25}
          />
          <Button
            variant="contained"
            bgColor="gray"
            text="취소"
            color="primary.white"
            fs="h6"
            w={160}
            h={25}
            action={() => router.push("/setting")}
          />
        </Row>
      </Column>
    </Layout>
  );
}
