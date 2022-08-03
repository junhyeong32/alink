import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../src/components/Layout";
import Column from "../../src/components/Box/Column";
import Row from "../../src/components/Box/Row";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import SelectInput, {
  OutLineSelectInput,
} from "../../src/components/Input/Select";
import Button from "../../src/components/Button";
import RowLabel from "../../src/components/Box/RowLabel";
import { OutLineInput } from "../../src/components/Input";
import MemoBox from "../../src/components/Box/Memo";
import DisableBox from "../../src/components/Box/DisableBox";
import { ModalContext } from "../../src/contexts/ModalContext";
import Axios from "../../src/utility/api";
import { getAccessToken } from "../../src/utility/getCookie";
import useGetOrganization from "../../src/hooks/share/useGetOrganization";
import useGetArea from "../../src/hooks/setting/useGetArea";
import RadioInput from "../../src/components/Radio";

export default function DbDetail() {
  const router = useRouter();

  const [menu_detail, setMenuDetail] = useState([]);
  const { sales } = useGetOrganization("sales");
  const { area } = useGetArea();
  const [db_detail, setDbDetail] = useState([]);

  //change state
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(20);
  const [head_office_org_code, setHeadOfficeOrgCode] = useState("");
  const [org_code, setOrgCode] = useState("");
  const [status, setStatus] = useState("");
  const [org_status, setOrgStatus] = useState("");
  const [allocated_user, setAllocatedUser] = useState("");
  const [parent_area, setParentArea] = useState("");
  const [child_area, setChildArea] = useState("");
  const [values, setValues] = useState([]);

  //menuItmes
  const [headOfficeMenuList, setHeadOfficeMenuList] = useState({});
  const [orgMenuList, setOrgMenuList] = useState({});
  const [uploaderMenuList, setUploaderMenuList] = useState({});
  const [areaParentMenuList, setAreaParentMenuList] = useState({});
  const [areaChildMenuList, setAreaChildMenuList] = useState({});

  const [date_range, setDateRange] = useState(new Date());
  const { openModal, closeModal, modalContent } = useContext(ModalContext);

  useEffect(() => {
    if (!router.isReady) return;

    const getDbMenu = async () => {
      const res = (
        await Axios.Get(
          `db/menu/${router.query.menu}?token=${getAccessToken()}`
        )
      )?.data;

      if (res?.code === 200) setMenuDetail(res?.data);
    };

    getDbMenu();
  }, [router.isReady, router.query.menu]);

  useEffect(() => {
    if (!router.isReady) return;
    const getDbDetail = async () => {
      const res = (
        await Axios.Get(`db/list/${router.query.db}?token=${getAccessToken()}`)
      )?.data;

      if (res?.code === 200) setDbDetail(res?.data);
    };

    getDbDetail();
  }, [router.isReady, router.query.db]);

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
            {menu_detail?.fields?.map((field, key) => {
              if (field?.is_detail_shown === 1) {
                switch (field?.property?.name) {
                  case "고객명":
                    return (
                      <RowLabel label="고객명" fs="h5" key={key}>
                        <OutLineInput
                          onBlur={(e) =>
                            setValues((prev) => {
                              const newData = [...prev];
                              const dataObj = newData.filter(
                                (data) => data.name === "고객명"
                              );
                              dataObj[0].value = e.target.value;

                              return newData;
                            })
                          }
                        />
                      </RowLabel>
                    );
                  case "연락처":
                    return (
                      <RowLabel label="연락처" fs="h5" key={key}>
                        <OutLineInput
                          onBlur={(e) =>
                            setValues((prev) => {
                              const newData = [...prev];
                              const dataObj = newData.filter(
                                (data) => data.name === "연락처"
                              );
                              dataObj[0].value = e.target.value;

                              return newData;
                            })
                          }
                        />
                      </RowLabel>
                    );
                  case "나이":
                    return (
                      <RowLabel label="나이" fs="h5" key={key}>
                        <OutLineInput
                          onBlur={(e) =>
                            setValues((prev) => {
                              const newData = [...prev];
                              const dataObj = newData.filter(
                                (data) => data.name === "나이"
                              );
                              dataObj[0].value = e.target.value;

                              return newData;
                            })
                          }
                        />
                      </RowLabel>
                    );
                  case "성별":
                    return (
                      <RowLabel label="성별" fs="h5" key={key}>
                        <FormControlLabel
                          label="남"
                          control={
                            <RadioInput
                              checked={
                                values?.filter((v) => v.name === "성별")[0]
                                  ?.value === "남자"
                              }
                              onClick={() =>
                                setValues((prev) => {
                                  const newData = [...prev];
                                  const dataObj = newData.filter(
                                    (data) => data.name === "성별"
                                  );
                                  dataObj[0].value = "남자";

                                  return newData;
                                })
                              }
                            />
                          }
                        />
                        <FormControlLabel
                          label="여"
                          control={
                            <RadioInput
                              checked={
                                values?.filter((v) => v.name === "성별")[0]
                                  ?.value === "여자"
                              }
                              onClick={() =>
                                setValues((prev) => {
                                  const newData = [...prev];
                                  const dataObj = newData.filter(
                                    (data) => data.name === "성별"
                                  );
                                  dataObj[0].value = "여자";

                                  return newData;
                                })
                              }
                            />
                          }
                        />
                      </RowLabel>
                    );
                  case "결혼여부":
                    return (
                      <RowLabel label="결혼여부" fs="h5" key={key}>
                        <FormControlLabel
                          label="미혼"
                          control={
                            <RadioInput
                              checked={
                                values?.filter((v) => v.name === "결혼여부")[0]
                                  ?.value === "미혼"
                              }
                              onClick={() =>
                                setValues((prev) => {
                                  const newData = [...prev];
                                  const dataObj = newData.filter(
                                    (data) => data.name === "결혼여부"
                                  );
                                  dataObj[0].value = "미혼";

                                  return newData;
                                })
                              }
                            />
                          }
                        />
                        <FormControlLabel
                          label="기혼"
                          control={
                            <RadioInput
                              checked={
                                values?.filter((v) => v.name === "결혼여부")[0]
                                  ?.value === "기혼"
                              }
                              onClick={() =>
                                setValues((prev) => {
                                  const newData = [...prev];
                                  const dataObj = newData.filter(
                                    (data) => data.name === "결혼여부"
                                  );
                                  dataObj[0].value = "기혼";

                                  return newData;
                                })
                              }
                            />
                          }
                        />
                      </RowLabel>
                    );
                  case "등록일시":
                    return (
                      <RowLabel label="등록일시" fs="h5" key={key}>
                        <OutLineInput />
                      </RowLabel>
                    );
                  case "분배일시":
                    return (
                      <RowLabel label="분배일시" fs="h5" key={key}>
                        <OutLineInput />
                      </RowLabel>
                    );
                  case "지역":
                    return (
                      <RowLabel label="지역" fs="h5" key={key}>
                        <OutLineSelectInput
                          title="지역"
                          placeholder={"시도"}
                          w={"50%"}
                          menuItems={areaParentMenuList}
                          value={parent_area}
                          setValue={setParentArea}
                        />
                        <OutLineSelectInput
                          w={"50%"}
                          placeholder={"지역상세"}
                          menuItems={areaChildMenuList}
                          value={child_area}
                          setValue={setChildArea}
                        />
                      </RowLabel>
                    );
                }
              }
            })}
          </Column>
        </Row>
        {menu_detail?.fields
          ?.filter(
            (field) =>
              field?.is_detail_shown === 1 &&
              field?.property?.name === "녹취 파일"
          )
          ?.map((filter_data) => (
            <>
              <Typography variant="h4" color="primary.red">
                녹취파일 및 메모는 등록 후 삭제가 불가하며, 업로드 하지 않을 시
                저장이 되지 않습니다.
              </Typography>

              <Column sx={{ gap: 1 }}>
                <Row alignItems={"center"} sx={{ gap: 2 }}>
                  <Typography variant="h1">녹취파일</Typography>
                  <Button
                    variant="contained"
                    bgColor="gray"
                    text="파일선택"
                    color="primary.white"
                    fs="h5"
                    h={20}
                  />

                  <Button
                    variant="contained"
                    bgColor="primary"
                    text="업로드"
                    color="primary.white"
                    fs="h5"
                    h={20}
                  />
                </Row>
              </Column>
            </>
          ))}

        {menu_detail?.fields
          ?.filter(
            (field) =>
              field?.is_detail_shown === 1 &&
              field?.property?.name === "특이사항"
          )
          ?.map((filter_data) => (
            <Column sx={{ gap: 1, maxWidth: 1020 }} key={key}>
              <Row alignItems={"center"} sx={{ gap: 2 }}>
                <Typography variant="h1">메모관리</Typography>
                <Button
                  variant="contained"
                  bgColor="primary"
                  text="메모추가"
                  color="primary.white"
                  fs="h5"
                  h={20}
                />
              </Row>
              <OutLineInput
                placeholder="메모를 입력해주세요."
                rows={4}
                multiline
              />
              <Row sx={{ width: "100%", gap: 3, maxWidth: 1020 }}>
                <MemoBox time="2022-04-05  13:04:05" text="text" />
              </Row>
            </Column>
          ))}
        <Row justifyContent={"between"} sx={{ gap: "12px", maxWidth: 1020 }}>
          <Button
            variant="contained"
            bgColor="print"
            text="인쇄"
            color="primary.white"
            fs="h5"
            h={25}
          />
          <Row sx={{ gap: 1 }}>
            <Button
              variant="contained"
              bgColor="primary"
              text="수정"
              color="primary.white"
              fs="h5"
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
              fs="h5"
              h={25}
              action={() => router.back()}
            />
          </Row>
          <Button
            variant="contained"
            bgColor="red"
            text="삭제"
            color="primary.white"
            fs="h5"
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
