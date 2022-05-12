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
import RoundColorBox from "../../src/components/Box/RoundColorBox";
import {
  status_list,
  status_bgcolor,
  rank_list,
  rank_bgcolor,
} from "../../src/data/user";
import ExcelButton from "../../src/components/Button/Excel";
import Input, { DateInput } from "../../src/components/Input";
import SelectInput, {
  OutLineSelectInput,
} from "../../src/components/Input/Select";
import Button from "../../src/components/Button";
import RowLabel from "../../src/components/Box/RowLabel";
import {
  list_filter,
  list_detail,
  additionsal_func,
} from "../../src/data/setting/menu";
import Image from "next/image";

export default function Menu() {
  const router = useRouter();
  const [menu, setMenu] = useState("popup");
  const [area, setArea] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState("");
  const [excel, setExcel] = useState("");

  const [date_range, setDateRange] = useState([null, null]);

  return (
    <Layout>
      <Column>
        <Column>
          <Typography>DB 추가</Typography>
          <RowLabel></RowLabel>
          <RowLabel></RowLabel>
          <RowLabel></RowLabel>
        </Column>

        <Column>
          <Typography>리스트 필터</Typography>
          {list_filter.map((list, key) => {
            if (list === "담당지역") {
              return <RowLabel key={key} label={list}></RowLabel>;
            }
            return (
              <RowLabel key={key} label={list}>
                <FormControlLabel label="노출" control={<Radio />} />
                <FormControlLabel label="미노출" control={<Radio />} />
              </RowLabel>
            );
          })}
        </Column>

        <Column>
          <Typography>리스트 상세</Typography>
          {list_detail.map((list, key) => (
            <RowLabel key={key} label={list}>
              <FormControlLabel label="노출" control={<Radio />} />
              <FormControlLabel label="미노출" control={<Radio />} />
              <FormControlLabel label="리스트 노출" control={<Radio />} />
              <Row sx={{ gap: 1 }}>
                <Box sx={{ cursor: "pointer" }}>
                  <Image src="/up.png" width={14} height={9} alt="" />
                </Box>
                <Box sx={{ cursor: "pointer" }}>
                  <Image src="/down.png" width={14} height={9} alt="" />
                </Box>
              </Row>
            </RowLabel>
          ))}
        </Column>

        <Column>
          <Typography>추가기능</Typography>
          {additionsal_func.map((list, key) => (
            <RowLabel key={key} label={list}>
              <FormControlLabel label="노출" control={<Radio />} />
              <FormControlLabel label="미노출" control={<Radio />} />
            </RowLabel>
          ))}
        </Column>
      </Column>
    </Layout>
  );
}
