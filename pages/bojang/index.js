import { useState, useContext } from "react";
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

import BojangTable from "../../src/components/Table/bojang";
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
import { argument_status } from "../../src/data/share/MenuByTextList";
import ExcelButton from "../../src/components/Button/Excel";
import {
  LabelUnderLineInput,
  DateInput,
  Date1,
} from "../../src/components/Input";
import SelectInput, {
  OutLineSelectInput,
} from "../../src/components/Input/Select";
import Button from "../../src/components/Button";
import { styles } from "../../src/styles/bojang";
import { ModalContext } from "../../src/contexts/ModalContext";
import originalMoment from "moment";
import { extendMoment } from "moment-range";
import { useEffect } from "react";
const moment = extendMoment(originalMoment);

export default function User() {
  const router = useRouter();
  const [area, setArea] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [branch, setBranch] = useState("");
  const [excel, setExcel] = useState("");
  const [date_range, setDateRange] = useState(
    moment.range(moment().clone().subtract(7, "days"), moment().clone())
  );
  const [date, setDate] = useState(null);

  const { openModal, closeModal } = useContext(ModalContext);
  useEffect(() => {
    setDate(
      `${date_range.start.format("YYYY-MM-DD")} ~ ${date_range.end.format(
        "YYYY-MM-DD"
      )}`
    );
  }, [date_range]);

  return (
    <Layout>
      <Column>
        <Button variant="outlined" text="신청권한" fs="h6" w={80} h={20} />
        <Column sx={{ rowGap: "15px", p: "40px 40px 0 40px" }}>
          <TopLabelContents
            title="인수상태"
            sx={styles.argument_status_contents}
          >
            {Object.entries(argument_status).map(
              ([list, color], key) =>
                key !== 6 && (
                  <FormControlLabel
                    key={key}
                    control={<Checkbox />}
                    label={
                      <RoundColorBox background={color}>
                        <Typography variant="h6">{list}</Typography>
                      </RoundColorBox>
                    }
                  />
                )
            )}
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
              <Row alignItems={"end"}>
                <SelectInput
                  title="지역"
                  placeholder={"시도"}
                  w={"50%"}
                  menuItems={{}}
                />
                <SelectInput
                  w={"50%"}
                  placeholder={"지역상세"}
                  menuItems={{}}
                />
              </Row>
            </Column>

            <Column sx={styles.second_input_column}>
              <SelectInput title="소속명" menuItems={{}} />
              <SelectInput title="등록처" menuItems={{}} />
              <DateInput
                value={date_range}
                setValue={setDateRange}
                textValue={date}
                title={
                  <>
                    <Row
                      alignItems={"center"}
                      wrap={"wrap"}
                      sx={{ gap: 1, whiteSpace: "nowrap" }}
                    >
                      등록일
                      <Button
                        text="금일"
                        bgColor={"gray"}
                        fs={"h6"}
                        color={"primary.white"}
                        h={14}
                        action={() => setDate(moment().format("YYYY-MM-DD"))}
                      />
                      <Button
                        text="어제"
                        bgColor={"gray"}
                        fs={"h6"}
                        color={"primary.white"}
                        h={14}
                        action={() =>
                          setDate(
                            moment().subtract(1, "days").format("YYYY-MM-DD")
                          )
                        }
                      />
                      <Button
                        text="이번주"
                        bgColor={"gray"}
                        fs={"h6"}
                        color={"primary.white"}
                        h={14}
                        action={() =>
                          setDate(
                            moment().subtract(7, "days").format("YYYY-MM-DD")
                          )
                        }
                      />
                      <Button
                        text="지난달"
                        bgColor={"gray"}
                        fs={"h6"}
                        color={"primary.white"}
                        h={14}
                        // action={() =>
                        //   setDate(
                        //     moment().subtract(7, "days").format("YYYY-MM-DD")
                        //   )
                        // }
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
              <Button
                variant="contained"
                bgColor="primary"
                text="조직변경"
                color="primary.white"
                fs="h6"
                w={90}
                h={28}
                action={() =>
                  openModal({
                    modal: "change",
                    content: {
                      contents: "자동분배를 진행하시겠습니까?",
                    },
                  })
                }
              />
              <Button
                variant="contained"
                bgColor="primary"
                text="자동분배"
                color="primary.white"
                fs="h6"
                w={90}
                h={28}
                action={() =>
                  openModal({
                    modal: "needConfirm",
                    content: {
                      contents: "자동분배를 진행하시겠습니까?",
                    },
                  })
                }
              />
            </Row>
            <ExcelButton action={() => setExcel("1")} />
          </Row>
          <BojangTable openModal={openModal} closeModal={closeModal} />
        </Column>
      </Column>
    </Layout>
  );
}
