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
} from "../../src/components/Input";
import SelectInput, {
  OutLineSelectInput,
} from "../../src/components/Input/Select";
import Button from "../../src/components/Button";
import { styles } from "../../src/styles/bojang";
import { argument_status } from "../../src/data/share/MenuByTextList";
import UploadModal from "../../src/components/Modal/dna/upload";

export default function Dna() {
  const router = useRouter();
  const [area, setArea] = useState("");
  const [visible, setVisible] = useState(false);

  return (
    <Layout>
      <Column>
        <Button variant="outlined" text="신청권한" fs="h6" w={80} h={20} />
        <Column sx={{ rowGap: "15px", p: "40px 40px 0 40px" }}>
          <TopLabelContents
            title={"인수상태"}
            sx={styles.argument_status_contents}
          >
            {Object.entries(argument_status).map(([list, color], key) => (
              <FormControlLabel
                key={key}
                control={<Checkbox />}
                label={
                  <RoundColorBox background={color}>
                    <Typography variant="h6">{list}</Typography>
                  </RoundColorBox>
                }
              />
            ))}
          </TopLabelContents>

          <Row justifyContent={"end"}>
            <Button
              variant="contained"
              bgColor="gray"
              text="초기화"
              color="primary.white"
              fs="h6"
              w={60}
              h={20}
              sx={styles.init_button}
            />
          </Row>
          <Row justifyContent={"between"} sx={styles.input_row}>
            <Column sx={styles.first_input_column}>
              <SelectInput title="조직명" menuItems={{}} />
              <SelectInput title="업체승인" menuItems={{}} />
              <SelectInput title="지역" menuItems={{}} />
            </Column>

            <Column sx={styles.second_input_column}>
              <SelectInput title="소속명" menuItems={{}} />
              <SelectInput title="등록처" menuItems={{}} />
              <SelectInput
                title={
                  <>
                    <Row alignItems={"center"} wrap={"wrap"} sx={{ gap: 1 }}>
                      등록일
                      <Button
                        text="금일"
                        bgColor={"gray"}
                        fs={"h6"}
                        color={"primary.white"}
                        h={14}
                      />
                      <Button
                        text="어제"
                        bgColor={"gray"}
                        fs={"h6"}
                        color={"primary.white"}
                        h={14}
                      />
                      <Button
                        text="이번주"
                        bgColor={"gray"}
                        fs={"h6"}
                        color={"primary.white"}
                        h={14}
                      />
                      <Button
                        text="지난달"
                        bgColor={"gray"}
                        fs={"h6"}
                        color={"primary.white"}
                        h={14}
                      />
                    </Row>
                  </>
                }
                menuItems={{}}
              />
            </Column>

            <Box sx={styles.third_input_column}>
              <SelectInput title="담당자" w={styles.input} menuItems={{}} />
              <LabelUnderLineInput
                title="고객명"
                placeholder={"고객명으로 검색하실 수 있습니다."}
                w={styles.input}
              />
              <LabelUnderLineInput
                title="연락처"
                placeholder={"연락처로 검색하실 수 있습니다."}
                w={styles.input}
                sx={styles.phone_input}
              />
            </Box>

            <Column alignItems={"end"} sx={styles.fourth_input_column}>
              <Button
                variant="contained"
                bgColor="gray"
                text="초기화"
                color="primary.white"
                fs="h6"
                w={60}
                h={20}
                sx={styles.init_button2}
              />
              <LabelUnderLineInput
                w={"100%"}
                title="연락처"
                placeholder={"연락처로 검색하실 수 있습니다."}
                sx={{ ...styles.init_input, mt: 4 }}
              />
            </Column>
          </Row>
        </Column>

        <Column sx={{ mt: "15px" }}>
          <Row
            alignItems={"center"}
            justifyContent={"between"}
            sx={{ mb: "10px" }}
          >
            <Row sx={{ gap: "5px" }}>
              <OutLineSelectInput menuItems={{}} placeholder={"조직변경"} />
              {/* 협력사 */}
              <Button
                variant="contained"
                bgColor="skyblue"
                text="신규등록"
                color="primary.white"
                fs="h6"
                w={120}
                h={28}
                action={() => router.push("dna/new")}
              />
              <Button
                variant="contained"
                bgColor="excel"
                text="엑셀등록"
                color="primary.white"
                fs="h6"
                w={120}
                h={28}
              />
              <Button
                variant="contained"
                bgColor="primary"
                text="파일 업로드"
                color="primary.white"
                fs="h6"
                w={120}
                h={28}
                action={() => setVisible(true)}
              />
              <UploadModal visible={visible} setVisible={setVisible} />
              visible, setVisible
              {/* 그 외 */}
              <Button
                variant="contained"
                bgColor="primary"
                text="자동분배"
                color="primary.white"
                fs="h6"
                w={120}
                h={28}
              />
            </Row>
            <ExcelButton action={() => setExcel("1")} />
          </Row>
          <ReceptionStatusTable />
        </Column>
      </Column>
    </Layout>
  );
}
