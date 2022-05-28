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
import Input, {
  DateInput,
  LabelUnderLineInput,
  OutLineInput,
} from "../../src/components/Input";
import SelectInput, {
  OutLineSelectInput,
} from "../../src/components/Input/Select";
import Button from "../../src/components/Button";
import { styles } from "../../src/styles/bojang";
import { argument_status } from "../../src/data/share/MenuByTextList";
import RowLabel from "../../src/components/Box/RowLabel";
import DisableBox from "../../src/components/Box/DisableBox";

export default function Dna() {
  const router = useRouter();
  const [area, setArea] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState("");
  const [excel, setExcel] = useState("");

  const [date_range, setDateRange] = useState([null, null]);

  return (
    <Layout>
      <Column sx={{ width: 463, gap: 2 }}>
        <Typography variant="h1">고객 정보</Typography>
        <RowLabel label="등록처" fs="h6">
          text
        </RowLabel>
        <RowLabel label="고객명" fs="h6">
          <OutLineInput />
        </RowLabel>
        <RowLabel label="지역" fs="h6">
          <OutLineSelectInput menuItems={{}} />
          <OutLineSelectInput menuItems={{}} />
        </RowLabel>
        <RowLabel label="연락처" fs="h6">
          <OutLineInput />
        </RowLabel>
        <RowLabel label="나이" fs="h6">
          <OutLineInput />
        </RowLabel>
        <RowLabel label="성별" fs="h6">
          <Typography variant="h6" color="primary.blue">
            남
          </Typography>
          <Typography variant="h6" color="primary.red">
            여
          </Typography>
        </RowLabel>
        <RowLabel label="결혼여부" fs="h6">
          <Typography variant="h6">미혼</Typography>
          <Typography variant="h6">기혼</Typography>
        </RowLabel>
        <RowLabel label="특이사항" fs="h6">
          <DisableBox text="text" w={367} h={95} />
        </RowLabel>
        <RowLabel label="녹취파일" fs="h6">
          <Column sx={{ gap: 1 }}>
            <Row justifyContent={"end"} sx={{ gap: 1 }}>
              <Button
                text="파일찾기"
                fs="h6"
                bgColor={"gray"}
                color={"primary.white"}
                h={25}
              />
              <Button text="업로드" fs="h6" h={25} />
            </Row>
            <DisableBox text="마우스로 파일을 끌어오세요." w={367} h={95} />
          </Column>
        </RowLabel>
      </Column>
      <Row justifyContent={"center"} sx={{ width: "100%", mt: 10, gap: 1.5 }}>
        <Button text="등록" fs="h6" w={158} h={25} />
        <Button
          text="취소"
          fs="h6"
          bgColor={"gray"}
          color={"primary.white"}
          w={158}
          h={25}
          action={() => router.back()}
        />
      </Row>
    </Layout>
  );
}
