import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Typography, FormControlLabel } from "@mui/material";
import UnderLineInput, {
  DateInput,
  DatePicker,
  OutLineInput,
} from "../../src/components/Input";
import { getAccessToken, getCookie } from "../../src/utility/getCookie";
import { getOrgHeadOffice } from "../../src/utility/organization/getOrgWithUnit";
import { useSnackbar } from "notistack";
import { styled } from "@mui/material/styles";
import Layout from "../../src/components/Layout";
import Column from "../../src/components/Box/Column";
import Row from "../../src/components/Box/Row";
import SelectInput, {
  OutLineSelectInput,
} from "../../src/components/Input/Select";
import Button from "../../src/components/Button";
import RowLabel from "../../src/components/Box/RowLabel";
import DisableBox from "../../src/components/Box/DisableBox";
import useGetArea from "../../src/hooks/setting/useGetArea";
import useGetOrganization from "../../src/hooks/share/useGetOrganization";
import Axios from "../../src/utility/api";
import RadioInput from "../../src/components/Radio";
import uploadFile from "../../src/utility/uploadFile";
import moment from "moment";
import { LoadingButton } from "@mui/lab";
import GridBox from "../../src/components/Box/Grid";

const Input = styled("input")({
  display: "none",
});

export default function NewDb() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const el = useRef(null);

  //data
  const [rank] = useState(getCookie("user_info")?.grade);
  const [user_info] = useState(getCookie("user_info"));
  const { sales } = useGetOrganization("sales");
  const { cooperation } = useGetOrganization("cooperation");
  const [menu_detail, setMenuDetail] = useState([]);

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
  const [date, setDate] = useState(null);
  const [dateAge, setDateAge] = useState("");
  const [age, setAge] = useState("");
  const [dateAgeChangeLog, setDateAgeChangeLog] = useState("");
  const [area, setArea] = useState([]);
  const [fileLoading, setFileLoading] = useState(false);

  const [transcript_file, setTranscriptFile] = useState("");

  //menuItmes
  const [headOfficeMenuList, setHeadOfficeMenuList] = useState({});
  const [headOfficeRankisCoopMenuList, setHeadOfficeRankisCoopMenuList] =
    useState({});
  const [orgMenuList, setOrgMenuList] = useState({});
  const [uploaderMenuList, setUploaderMenuList] = useState({});
  const [areaParentMenuList, setAreaParentMenuList] = useState({});
  const [areaChildMenuList, setAreaChildMenuList] = useState({});

  const handleClose = (e) => {
    if (el.current && !el.current.contains(e.target)) {
      document.querySelector(".rdrCalendarWrapper").style.display = "none";
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClose);
    return () => {
      window.removeEventListener("click", handleClose);
    };
  }, [el]);

  useEffect(() => {
    if (!date) return;
    document.querySelector(".rdrCalendarWrapper").style.display = "none";
    if (dateAge !== moment(date).format("YYYY-MM-DD"))
      setDateAge(moment(date).format("YYYY-MM-DD"));

    document.querySelector("#age").value =
      new Date().getFullYear() - date.getFullYear() + 1;
    setValues((prev) => {
      const newData = [...prev];
      const dataObj = newData.filter((data) => data.name === "나이");
      dataObj[0].value = moment(date).format("YYYY-MM-DD");

      return newData;
    });
  }, [date]);

  useEffect(() => {
    if (!dateAge) return;
    if (
      dateAge?.length === 10 &&
      dateAge?.includes("-", 5) &&
      dateAge?.includes("-", 7) &&
      new Date(dateAge) instanceof Date &&
      !isNaN(new Date(dateAge))
    ) {
      setDate(new Date(dateAge));
    } else {
      // setDateAge("");

      enqueueSnackbar("날짜형식을 올바르게 입력해주세요", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  }, [dateAgeChangeLog]);

  useEffect(() => {
    if (!date && age) {
      setValues((prev) => {
        const newData = [...prev];
        const dataObj = newData.filter((data) => data.name === "나이");
        dataObj[0].value = age;

        return newData;
      });
    }
  }, [age]);

  useEffect(() => {
    if (!router.isReady) return;

    const getDbMenu = async () => {
      const res = (
        await Axios.Get(
          `db/menu/${router.query.menu}?token=${getAccessToken()}`
        )
      )?.data;

      if (res?.code === 200) {
        setMenuDetail(res?.data);
        const head_org = {};

        setHeadOfficeMenuList((prev) => {
          const newData = { ...prev };

          res?.data?.organizations?.map((org, key) =>
            Object.assign(newData, { [org.code]: org.name })
          );

          return newData;
        });
        setHeadOfficeRankisCoopMenuList((prev) => {
          const newData = { ...prev };

          res?.data?.cooperation_organizations?.map((org, key) =>
            Object.assign(newData, { [org.code]: org.name })
          );

          return newData;
        });

        console.log("res?.data?.fields", res?.data?.fields);
        setValues((prev) => {
          const newData = [...prev];

          res?.data?.fields?.map(
            (menu, key) =>
              menu?.is_detail_shown === 1 &&
              newData.push({
                field_pk: menu?.pk,
                value: "",
                name: menu?.property?.name,
              })
          );

          return newData;
        });

        setArea(res?.data?.geomap);

        setAreaParentMenuList(() => {
          const parent = {};
          res?.data?.geomap?.map((d, key) => {
            Object.assign(parent, { [d.name]: d.name });
          });
          return parent;
        });
      }
    };

    getDbMenu();
  }, [router.isReady]);

  //상세지역구분
  useEffect(() => {
    if (!parent_area) return;

    setAreaChildMenuList(() => {
      const child = {};

      area
        ?.filter((geomap) => geomap.name === parent_area)
        ?.map((filter_area) => {
          filter_area?.children?.map((d) => {
            Object.assign(child, { [d]: d });
          });
        });

      return child;
    });
  }, [parent_area]);

  console.log(values);

  return (
    <Layout>
      <Column
        sx={{
          width: {
            lg: 463,
            md: 463,
            sm: "100%",
            xs: "100%",
          },
          gap: 2,
        }}
      >
        <Typography variant="h1">고객 정보</Typography>
        {rank !== "협력사" && rank !== "부협력사" && (
          <RowLabel label="조직" fs="h6">
            <OutLineSelectInput
              w={"100%"}
              menuItems={headOfficeMenuList}
              value={head_office_org_code}
              setValue={setHeadOfficeOrgCode}
            />
          </RowLabel>
        )}
        <RowLabel label="고객명" fs="h6">
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
        <RowLabel label="지역" fs="h6">
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
        <RowLabel label="연락처" fs="h6">
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
        <RowLabel label="나이" fs="h6">
          <div ref={el} style={{ width: "50%" }}>
            <DatePicker
              date={dateAge}
              setDate={setDateAge}
              value={date}
              setValue={setDate}
              w={"100%"}
              changeLog={dateAgeChangeLog}
              setChangeLog={setDateAgeChangeLog}
            />
          </div>
          <OutLineInput
            id="age"
            w={"50%"}
            onBlur={(e) => setAge(e.target.value)}
          />
        </RowLabel>
        <RowLabel label="성별" fs="h6">
          <FormControlLabel
            label="남자"
            control={
              <RadioInput
                checked={
                  values?.filter((v) => v.name === "성별")[0]?.value === "남자"
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
            label="여자"
            control={
              <RadioInput
                checked={
                  values?.filter((v) => v.name === "성별")[0]?.value === "여자"
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
        <RowLabel label="결혼여부" fs="h6">
          <FormControlLabel
            label="미혼"
            control={
              <RadioInput
                checked={
                  values?.filter((v) => v.name === "결혼여부")[0]?.value ===
                  "미혼"
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
                  values?.filter((v) => v.name === "결혼여부")[0]?.value ===
                  "기혼"
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
        <RowLabel label="특이사항" fs="h6">
          <OutLineInput
            text="text"
            w={"100%"}
            multiline
            rows={3}
            onBlur={(e) =>
              setValues((prev) => {
                const newData = [...prev];
                const dataObj = newData.filter(
                  (data) => data.name === "특이사항"
                );
                dataObj[0].value = e.target.value;

                return newData;
              })
            }
          />
        </RowLabel>
        <RowLabel label="녹취파일" fs="h6">
          {/* <Column sx={{ gap: 1 }}>
            <Row justifyContent={"end"} sx={{ gap: 1 }}>
              <label htmlFor="contained-button-file">
                <Input
                  accept="audio/*"
                  id="contained-button-file"
                  // multiple
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <Button
                  text="파일찾기"
                  fs="h6"
                  bgColor={"gray"}
                  color={"primary.white"}
                  h={25}
                  component={"span"}
                />
              </label>
              <Button text="업로드" fs="h6" h={25} />
            </Row>

            <DisableBox text="마우스로 파일을 끌어오세요." w={367} h={95} />
          </Column> */}
          <Row alignItems={"center"} sx={{ gap: 2 }}>
            <Row alignItems={"center"} justifyContent={"start"} sx={{ gap: 1 }}>
              <label htmlFor="contained-button-file">
                <Input
                  accept="audio/*"
                  id="contained-button-file"
                  // multiple
                  type="file"
                  onChange={(e) => setTranscriptFile(e.target.files[0])}
                />

                <Button
                  text="파일찾기"
                  fs="h6"
                  bgColor={"gray"}
                  color={"primary.white"}
                  h={25}
                  component={"span"}
                />
              </label>

              <UnderLineInput disabled value={transcript_file?.name} />
              <LoadingButton
                variant="contained"
                loading={fileLoading}
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  height: 28,
                  mt: 0.1,
                }}
                onClick={async () => {
                  if (!transcript_file)
                    return enqueueSnackbar("파일을 선택해주세요", {
                      variant: "error",
                      autoHideDuration: 2000,
                    });
                  setFileLoading(true);
                  const _uploadFile = await uploadFile(transcript_file);

                  if (_uploadFile) {
                    const getRecordField = menu_detail?.fields?.find(
                      (data) => data?.property.name === "녹취 파일"
                    );

                    setValues((prev) => {
                      const newData = [...prev];

                      const newObj = Object.assign(
                        {},
                        {
                          field_pk: getRecordField?.pk,
                          title: "녹취 파일",
                          value: _uploadFile,
                          created_date: new Date(+new Date() + 3240 * 10000)
                            .toISOString()
                            .replace("T", " ")
                            .replace(/\..*/, ""),
                        }
                      );
                      newData.push(newObj);

                      return newData;
                    });

                    setFileLoading(false);
                    if (!fileLoading) {
                      setTranscriptFile("");
                      document.querySelector("#contained-button-file").value =
                        "";

                      enqueueSnackbar("파일이 정상적으로 등록 되었습니다.", {
                        variant: "success",
                        autoHideDuration: 2000,
                      });
                    }
                  }
                }}
              >
                업로드
              </LoadingButton>
            </Row>
          </Row>
        </RowLabel>
      </Column>
      <GridBox
        itemCount={4}
        alignItems={"end"}
        sx={{ width: "100%", gap: 1, mt: 3, maxWidth: 1024 }}
      >
        {values?.map(
          (v, _key) =>
            v?.title === "녹취 파일" &&
            v?.value &&
            v?.value.includes("https") && (
              <Column
                sx={{
                  width: "100%",
                  p: 1,
                  border: "1px solid black",
                  borderRadius: "5px",
                }}
              >
                <Typography variant="h6" ml={3} mb={1}>
                  {v?.created_date}{" "}
                </Typography>
                <audio controls src={v?.value} style={{ width: "100%" }}>
                  Your browser does not support the
                  <code>audio</code> element.
                </audio>
              </Column>
            )
        )}
      </GridBox>

      <Row justifyContent={"center"} sx={{ width: "100%", mt: 10, gap: 1.5 }}>
        <Button
          text="등록"
          fs="h6"
          w={158}
          h={25}
          action={async () => {
            if (
              !head_office_org_code &&
              rank !== "협력사" &&
              rank !== "부협력사"
            )
              return enqueueSnackbar("조직을 선택해주세요.", {
                variant: "error",
                autoHideDuration: 2000,
              });

            // if(new)
            const newValues = values
              .filter((v) => v?.value !== "")
              .map((v) =>
                Object.assign(
                  {},
                  {
                    field_pk: v.field_pk,
                    value: v.value,
                  }
                )
              );

            values;
            const res = await Axios.Post("db/list", {
              token: getAccessToken(),
              db_pk: router.query.menu,
              organization_code: head_office_org_code,
              geo_parent: parent_area,
              geo_name: child_area,
              values: newValues,
            });
            if (res?.code === 200) {
              enqueueSnackbar("DB가 등록되었습니다.", {
                variant: "success",
                autoHideDuration: 2000,
              });
              router.back();
            } else {
              enqueueSnackbar("동일한 연락처의 DB가 존재합니다.", {
                variant: "success",
                autoHideDuration: 2000,
              });
            }
          }}
        />
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
