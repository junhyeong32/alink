import { useState, useContext } from "react";
import { useRouter } from "next/router";
import Layout from "../src/components/Layout";
import Column from "../src/components/Box/Column";
import Row from "../src/components/Box/Row";
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

import BojangTable from "../src/components/Table/bojang";
import {
  select_title,
  area_input,
  headquarters_input,
  branch_input,
} from "../src/components/Table/data-status/ReceptionStatusList";
import TopLabelContents from "../src/components/Box/TopLableContents";
import RoundColorBox from "../src/components/Box/RoundColorBox";
import {
  status_list,
  status_bgcolor,
  rank_list,
  rank_bgcolor,
} from "../src/data/user";
import { argument_status } from "../src/data/share/MenuByTextList";
import ExcelButton from "../src/components/Button/Excel";
import { LabelUnderLineInput, DateInput, Date1 } from "../src/components/Input";
import SelectInput, {
  OutLineSelectInput,
} from "../src/components/Input/Select";
import Button from "../src/components/Button";
import { styles } from "../src/styles/bojang";
import { ModalContext } from "../src/contexts/ModalContext";
import originalMoment from "moment";
import { extendMoment } from "moment-range";
import { useEffect } from "react";
import Axios from "../src/utility/api";
import { getAccessToken } from "../src/utility/getCookie";
import GridBox from "../src/components/Box/Grid";

const moment = extendMoment(originalMoment);

export default function Db() {
  const router = useRouter();
  const [menu_detail, setMenuDetail] = useState([]);
  const [db_list, setDbList] = useState([]);

  const [headquarters, setHeadquarters] = useState("");
  const [branch, setBranch] = useState("");
  const [date_range, setDateRange] = useState(
    moment.range(moment().clone().subtract(7, "days"), moment().clone())
  );
  const [date, setDate] = useState(null);
  const { openModal, closeModal } = useContext(ModalContext);

  useEffect(() => {
    if (!router.isReady) return;

    const getDbDetail = async () => {
      const res = (
        await Axios.Get(`db/menu/${router.query.db}?token=${getAccessToken()}`)
      )?.data;

      if (res?.code === 200) setMenuDetail(res?.data);
    };

    getDbDetail();
  }, [router.isReady, router.query.db]);

  useEffect(() => {
    if (!router.isReady) return;

    const getDbDetail = async () => {
      const res = (
        await Axios.Get(`db/list`, {
          params: {
            token: getAccessToken(),
          },
        })
      )?.data;

      if (res?.code === 200) setDbList(res?.data?.result);
    };

    getDbDetail();
  }, [router.isReady, router.query.db]);

  //   useEffect(() => {
  //     if (!router.isReady) return;
  //     const getDbDetail = async () => {
  //       const res = (await Axios.Get(`db/list/4?token=${getAccessToken()}`))
  //         ?.data;

  //       console.log("res2", res);
  //     };

  //     getDbDetail();
  //   }, [router.isReady, router.query.db]);

  //인수상태, 조직명, 소속명, 업체승인, 지역, 등록일

  menu_detail?.fields
    ?.filter((d) => d?.is_filter_shown === 1)
    .map((fil) => console.log(fil?.property?.name));

  return (
    <Layout>
      <Column>
        {/* <Button variant="outlined" text="신청권한" fs="h6" w={80} h={20} /> */}
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
          <Row justifyContent={"end"} sx={{ gap: 1 }}>
            <Button
              variant="contained"
              bgColor="primary"
              text="검색"
              color="primary.white"
              fs="h6"
              w={60}
              h={25}
            />
            <Button
              variant="contained"
              bgColor="gray"
              text="초기화"
              color="primary.white"
              fs="h6"
              w={60}
              h={25}
            />
          </Row>
          <GridBox
            alignItems={"center"}
            wrap="wrap"
            itemCount={4}
            sx={{ width: "100%", gap: 1 }}
          >
            <SelectInput w="100%" title="조직명" menuItems={{}} />
            <SelectInput w="100%" title="업체승인" menuItems={{}} />
            <Row alignItems={"end"} sx={{ width: "100%" }}>
              <SelectInput
                title="지역"
                placeholder={"시도"}
                w={"50%"}
                menuItems={{}}
              />
              <SelectInput w={"50%"} placeholder={"지역상세"} menuItems={{}} />
            </Row>
            <SelectInput w="100%" title="소속명" menuItems={{}} />
            <SelectInput w="100%" title="등록처" menuItems={{}} />
            <DateInput
              value={date_range}
              setValue={setDateRange}
              textValue={date}
              w="100%"
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
            {menu_detail?.fields
              ?.filter((d) => d?.is_filter_shown === 1)
              ?.map((filter, key) => {
                console.log(filter);
                return (
                  <LabelUnderLineInput
                    key={key}
                    w={"100%"}
                    title={filter?.property?.name}
                    placeholder={"연락처로 검색하실 수 있습니다."}
                    // sx={{ ...styles.init_input, mt: 4 }}
                  />
                );
              })}
          </GridBox>

          {/* <Box sx={styles.third_input_column}>
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
            </Box> */}

          {/* <Column alignItems={"end"} sx={styles.fourth_input_column}>
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
            </Column> */}
        </Column>

        <Column sx={{ mt: "15px" }}>
          {/* <Row
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
          </Row> */}
          <BojangTable
            openModal={openModal}
            closeModal={closeModal}
            header={menu_detail}
            data={db_list}
          />
        </Column>
      </Column>
    </Layout>
  );
}