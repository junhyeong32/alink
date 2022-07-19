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
  Input,
  FormControlLabel,
} from "@mui/material";
import { useState } from "react";
import ReceptionStatusTable from "../../src/components/Table/data-status/ReceptionStatusTable";
import {
  select_title,
  area_input,
  headquarters_input,
  branch_input,
} from "../../src/components/Table/data-status/ReceptionStatusList";
import TopLabelContents from "../../src/components/Box/TopLableContents";
import RowLabel from "../../src/components/Box/RowLabel";
import UnderLineInput, { OutLineInput } from "../../src/components/Input";
import Button from "../../src/components/Button";
import { OutLineSelectInput } from "../../src/components/Input/Select";
import { status, rank_list } from "../../src/data/share/MenuByTextList";
import RoundColorBox from "../../src/components/Box/RoundColorBox";
import { styles } from "../../src/styles/bojang";
const rowLabelWidth = {
  width: {
    lg: "40%",
    md: "60%",
    sm: "60%",
    xs: "100%",
  },
};

export default function Detail() {
  const [rank, setRank] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState("");
  const [excel, setExcel] = useState("");

  console.log(rank);

  //TODO
  // new-id랑 똑같이

  return (
    <Layout>
      <Column sx={{ p: "40px", gap: "20px" }}>
        <Typography variant="h1">신규 생성</Typography>
        <TopLabelContents
          title="상태"
          fs="h4"
          sx={{ ...styles.argument_status_contents }}
        >
          {Object.entries(status).map(([list, color], key) => {
            if (key === 1 || key === 2)
              return (
                <FormControlLabel
                  key={key}
                  control={<Checkbox />}
                  label={
                    <RoundColorBox background={color}>
                      <Typography variant="h6">{list}</Typography>
                    </RoundColorBox>
                  }
                />
              );
          })}
        </TopLabelContents>
        <TopLabelContents
          title="등급"
          fs="h4"
          sx={{
            width: { lg: "80%", xs: "100%" },
            ...styles.argument_status_contents,
          }}
        >
          {Object.entries(rank_list).map(
            ([list, color], key) =>
              key !== 0 && (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      onClick={() => setRank(list)}
                      checked={rank === list ? true : false}
                    />
                  }
                  label={
                    <RoundColorBox background={color}>
                      <Typography variant="h6">{list}</Typography>
                    </RoundColorBox>
                  }
                />
              )
          )}
        </TopLabelContents>

        {rank !== "협력사" ? (
          <>
            <RowLabel label="조직명" sx={rowLabelWidth} label_w={83}>
              <OutLineSelectInput w="50%" menuItems={{}} />
            </RowLabel>
            <RowLabel label="직급" sx={rowLabelWidth} label_w={83}>
              <OutLineInput w="50%" />
            </RowLabel>
            <RowLabel label="소속" sx={rowLabelWidth} label_w={83}>
              <OutLineInput w="50%" menuItems={{}} />
            </RowLabel>
            <RowLabel label="성명" sx={rowLabelWidth} label_w={83}>
              <OutLineInput w="50%" />
          </RowLabel>
          </>
        ) : (
          <RowLabel label="이용자명" sx={rowLabelWidth} label_w={83}>
            <OutLineInput w="50%" />
          </RowLabel>
        )}

        <RowLabel label="아이디" sx={rowLabelWidth} label_w={83}>
          <OutLineInput w="50%" />
          <Button
            text="중복체크"
            variant="contained"
            bgColor="gray"
            color="primary.white"
            h={20}
            fs="h6"
          />
        </RowLabel>
        <RowLabel label="신규 비밀번호" sx={rowLabelWidth} label_w={83}>
          <OutLineInput w="50%" />
        </RowLabel>
        <RowLabel label="비밀번호 확인" sx={rowLabelWidth} label_w={83}>
          <OutLineInput w="50%" />
        </RowLabel>
        <RowLabel label="이메일" sx={rowLabelWidth} label_w={83}>
          <OutLineInput w="50%" />
        </RowLabel>
        <RowLabel label="연락처" sx={rowLabelWidth} label_w={83}>
          <OutLineInput w="50%" />
        </RowLabel>
        {/* todo 
        date input
        */}
        {rank !== "협력사" && (
          <RowLabel label="생년월일" sx={rowLabelWidth} label_w={83}>
            <OutLineInput w="50%" />
          </RowLabel>
        )}
        <Row justifyContent={"center"} sx={{ width: "40%", gap: "15px" }}>
          <Button
            text="생성"
            variant="contained"
            bgColor="primary"
            color="primary.white"
            w={158}
            h={25}
            fs="h6"
          />
          <Button
            text="취소"
            variant="contained"
            bgColor="gray"
            color="primary.white"
            w={158}
            h={25}
            fs="h6"
          />
        </Row>
      </Column>

      {rank !== "협력사" && (
        <Column sx={{ p: "40px", gap: "20px" }}>
          <Typography variant="h1">DB 관리</Typography>
          <RowLabel label="보장할당" fs="h4" label_w={83}>
            <Row alignItems={"center"}>
              <OutLineInput w={90} />
              <Typography variant="h6" pl={1}>
                개
              </Typography>
            </Row>
          </RowLabel>
          <RowLabel label="재무할당" fs="h4" label_w={83}>
            <Row alignItems={"center"}>
              <OutLineInput w={90} />
              <Typography variant="h6" pl={1}>
                개
              </Typography>
            </Row>
          </RowLabel>
          <RowLabel label="유전자할당" fs="h4" label_w={83}>
            <Row alignItems={"center"}>
              <OutLineInput w={90} />
              <Typography variant="h6" pl={1}>
                개
              </Typography>
            </Row>
          </RowLabel>
          <Row justifyContent={"center"} sx={{ gap: "15px" }}>
            <Button
              text="생성"
              variant="contained"
              bgColor="primary"
              color="primary.white"
              w={158}
              h={25}
              fs="h6"
            />
            <Button
              text="취소"
              variant="contained"
              bgColor="gray"
              color="primary.white"
              w={158}
              h={25}
              fs="h6"
            />
          </Row>
        </Column>
      )}
    </Layout>
  );
}
