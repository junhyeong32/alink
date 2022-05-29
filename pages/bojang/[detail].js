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
import { LabelUnderLineInput, DateInput } from "../../src/components/Input";
import SelectInput, {
  OutLineSelectInput,
} from "../../src/components/Input/Select";
import Button from "../../src/components/Button";
import RowLabel from "../../src/components/Box/RowLabel";
import { OutLineInput } from "../../src/components/Input";
import MemoBox from "../../src/components/Box/Memo";
import DisableBox from "../../src/components/Box/DisableBox";
import { ModalContext } from "../../src/contexts/ModalContext";

export default function Detail() {
  const router = useRouter();
  const [area, setArea] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState("");
  const [excel, setExcel] = useState("");

  const [date_range, setDateRange] = useState(new Date());
  const { openModal, closeModal, modalContent } = useContext(ModalContext);

  return (
    <Layout>
      <Column justifyContent={"between"} sx={{ gap: 2.8 }}>
        <Row
          justifyContent={"start"}
          flexDirection={{
            lg: "row",
            md: "row",
            sm: "row",
            xs: "column",
          }}
          sx={{ columnGap: "100px", rowGap: 3 }}
        >
          <Column sx={{ width: "100%", maxWidth: 463, gap: 2.8 }}>
            <Typography variant="h1">고객 정보</Typography>
            <RowLabel label="고객명">
              <OutLineInput />
            </RowLabel>
            <RowLabel label="연락처">
              <OutLineInput />
            </RowLabel>
            <RowLabel label="나이">
              <OutLineInput />
            </RowLabel>
            <RowLabel label="성명"></RowLabel>
            <RowLabel label="결혼여부"></RowLabel>
            <RowLabel label="특이사항">
              <DisableBox text="text" h={90} />
            </RowLabel>
            <RowLabel label="등록일시">text</RowLabel>
            <RowLabel label="지역">
              <OutLineSelectInput menuItems={{}} />
              <OutLineSelectInput menuItems={{}} />
            </RowLabel>
            <RowLabel label="등록처">text</RowLabel>
          </Column>

          <Column sx={{ width: "100%", maxWidth: 463, gap: 2.8 }}>
            <Typography variant="h1">담당자 정보</Typography>
            <RowLabel label="인수상태">text</RowLabel>
            <RowLabel label="업체승인">
              <OutLineSelectInput menuItems={{}} />
            </RowLabel>
            <RowLabel label="조직">AFG</RowLabel>
            <RowLabel label="고객명">
              <OutLineSelectInput menuItems={{}} />
              <OutLineSelectInput menuItems={{}} />
            </RowLabel>
          </Column>
        </Row>
        <Typography variant="h4" color="primary.red">
          녹취파일 및 메모는 등록 후 삭제가 불가하며, 업로드 하지 않을 시 저장이
          되지 않습니다.
        </Typography>

        <Column sx={{ gap: 1 }}>
          <Row alignItems={"center"} sx={{ gap: 2 }}>
            <Typography variant="h1">녹취파일</Typography>
            <Button
              variant="contained"
              bgColor="gray"
              text="파일선택"
              color="primary.white"
              fs="h6"
              h={20}
            />

            <Button
              variant="contained"
              bgColor="primary"
              text="업로드"
              color="primary.white"
              fs="h6"
              h={20}
            />
          </Row>
        </Column>

        <Column sx={{ gap: 1, maxWidth: 1020 }}>
          <Row alignItems={"center"} sx={{ gap: 2 }}>
            <Typography variant="h1">메모관리</Typography>
            <Button
              variant="contained"
              bgColor="primary"
              text="메모추가"
              color="primary.white"
              fs="h6"
              h={20}
            />
          </Row>
          <OutLineInput placeholder="메모를 입력해주세요." rows={4} multiline />
          <Row sx={{ width: "100%", gap: 3, maxWidth: 1020 }}>
            <MemoBox time="2022-04-05  13:04:05" text="text" />
          </Row>
        </Column>
        <Row justifyContent={"between"} sx={{ gap: "12px", maxWidth: 1020 }}>
          <Button
            variant="contained"
            bgColor="print"
            text="인쇄"
            color="primary.white"
            fs="h6"
            h={25}
          />
          <Row sx={{ gap: 1 }}>
            <Button
              variant="contained"
              bgColor="primary"
              text="수정"
              color="primary.white"
              fs="h6"
              h={25}
              action={() =>
                openModal({
                  modal: "needConfirm",
                  content: {
                    contents: "수정을 진행하시겠습니까? ",
                  },
                })
              }
            />

            <Button
              variant="contained"
              bgColor="gray"
              text="목록보기"
              color="primary.white"
              fs="h6"
              h={25}
              action={() => router.back()}
            />
          </Row>
          <Button
            variant="contained"
            bgColor="red"
            text="삭제"
            color="primary.white"
            fs="h6"
            h={25}
            action={() =>
              openModal({
                modal: "needConfirm",
                content: {
                  contents: "해당DB를 삭제하시겠습니까?",
                  buttonText: "삭제",
                },
              })
            }
          />
        </Row>
      </Column>
    </Layout>
  );
}
