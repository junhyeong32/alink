import { useState } from "react";
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
import ExcelButton from "../../src/components/Button/Excel";
import Input, { DateInput, OutLineInput } from "../../src/components/Input";
import SelectInput, {
  OutLineSelectInput,
} from "../../src/components/Input/Select";
import Button from "../../src/components/Button";
import RowLabel from "../../src/components/Box/RowLabel";
import RadioInput from "../../src/components/Radio";

export default function Popup() {
  const router = useRouter();
  const [menu, setMenu] = useState("popup");
  const [area, setArea] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState("");
  const [excel, setExcel] = useState("");

  const [date_range, setDateRange] = useState([null, null]);

  // console.log(
  //   path.dirname("../../smarteditor2/workspace/static/SmartEditor2Skin.html")
  // );

  return (
    <Layout>
      <Column sx={{ gap: 2, maxWidth: 927 }}>
        <RowLabel label="조직">
          <OutLineSelectInput menuItems={{}} />
        </RowLabel>
        <RowLabel label="유형">
          <FormControlLabel label="레이어 팝업" control={<RadioInput />} />
          <FormControlLabel label="윈도우 팝업" control={<RadioInput />} />
        </RowLabel>
        <RowLabel label="제목">
          <OutLineInput />
        </RowLabel>
        <RowLabel label="위치">
          <OutLineSelectInput menuItems={{}} />
        </RowLabel>
        <RowLabel label="크기"></RowLabel>
        <RowLabel label="활성화">
          <OutLineSelectInput menuItems={{}} />
        </RowLabel>
        <Row sx={{ mt: "70px" }}>
          <Button
            variant="contained"
            bgColor="primary"
            text="등록"
            color="primary.white"
            fs="h6"
            w={100}
            h={20}
          />
          <Button
            variant="contained"
            bgColor="gray"
            text="취소"
            color="primary.white"
            fs="h6"
            w={100}
            h={20}
            action={() => router.push("/setting")}
          />
        </Row>
        <iframe
          frameBorder="0"
          scrolling="no"
          // style={"width: 100%; height: 449px"}}
          src="../../smarteditor2/workspace/static/SmartEditor2Skin.html"
        ></iframe>
      </Column>
    </Layout>
  );
}
