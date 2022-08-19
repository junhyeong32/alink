import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Typography, FormControlLabel } from "@mui/material";
import UnderLineInput, { OutLineInput } from "../../src/components/Input";
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

const Input = styled("input")({
  display: "none",
});

export default function NewDb() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  //data
  const [rank] = useState(getCookie("user_info")?.grade);
  const [user_info] = useState(getCookie("user_info"));
  const { sales } = useGetOrganization("sales");
  const { cooperation } = useGetOrganization("cooperation");
  const { area } = useGetArea();
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

  const [transcript_file, setTranscriptFile] = useState("");

  //menuItmes
  const [headOfficeMenuList, setHeadOfficeMenuList] = useState({});
  const [headOfficeRankisCoopMenuList, setHeadOfficeRankisCoopMenuList] =
    useState({});
  const [orgMenuList, setOrgMenuList] = useState({});
  const [uploaderMenuList, setUploaderMenuList] = useState({});
  const [areaParentMenuList, setAreaParentMenuList] = useState({});
  const [areaChildMenuList, setAreaChildMenuList] = useState({});

  //지역구분
  useEffect(() => {
    setAreaParentMenuList(() => {
      const parent = {};
      area?.map((d, key) => {
        Object.assign(parent, { [d.parent]: d.parent });
      });
      return parent;
    });
  }, [area]);

  //소속
  useEffect(() => {
    if (sales?.length === 0) return;
    const head_org = {};

    getOrgHeadOffice(sales, head_org);

    setHeadOfficeMenuList(head_org);
  }, [sales]);

  useEffect(() => {
    if (!router.isReady) return;

    const getDbMenu = async () => {
      const res = (
        await Axios.Get(
          `db/menu/${router.query.menu}?token=${getAccessToken()}`
        )
      )?.data;

      if (res?.code === 200) {
        setHeadOfficeRankisCoopMenuList((prev) => {
          const newData = { ...prev };

          res?.data?.organizations?.map((org, key) =>
            Object.assign(newData, { [org.code]: org.name })
          );

          return newData;
        });
        setValues((prev) => {
          const newData = [...prev];

          res?.data?.fields?.map((menu, key) =>
            newData.push({
              field_pk: menu?.pk,
              value: "",
              name: menu?.property?.name,
            })
          );

          return newData;
        });
      }
    };

    getDbMenu();
  }, [router.isReady]);

  console.log("headOfficeRankisCoopMenuList", headOfficeRankisCoopMenuList);

  //상세지역구분
  useEffect(() => {
    if (!parent_area) return;

    setAreaChildMenuList(() => {
      const child = {};

      area
        ?.filter((geomap) => geomap.parent === parent_area && geomap.name)
        ?.map((filter_area) => {
          filter_area?.children?.map((d) => {
            Object.assign(child, { [d]: d });
          });
        });

      return child;
    });
  }, [parent_area]);

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
        <RowLabel label="등록처" fs="h6">
          {user_info?.name}
        </RowLabel>
        <RowLabel label="조직" fs="h6">
          <OutLineSelectInput
            w={"100%"}
            menuItems={
              rank === "협력사" || rank === "부협력사"
                ? headOfficeRankisCoopMenuList
                : headOfficeMenuList
            }
            value={head_office_org_code}
            setValue={setHeadOfficeOrgCode}
          />
        </RowLabel>
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
          <OutLineInput
            onBlur={(e) =>
              setValues((prev) => {
                const newData = [...prev];
                const dataObj = newData.filter((data) => data.name === "나이");
                dataObj[0].value = e.target.value;

                return newData;
              })
            }
          />
        </RowLabel>
        <RowLabel label="성별" fs="h6">
          <FormControlLabel
            label="남"
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
            label="여"
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
              <Button
                text="업로드"
                fs="h6"
                h={25}
                sx={{ mt: 0.1 }}
                action={async () => {
                  const _uploadFile = await uploadFile(transcript_file);

                  if (_uploadFile) {
                    setValues((prev) => {
                      const newData = [...prev];
                      const newObj = Object.assign(
                        {},
                        newData?.filter((data) => data?.name === "녹취 파일")[0]
                      );

                      newObj.value = _uploadFile;

                      newData.push(newObj);

                      return newData;
                    });
                    setTranscriptFile();
                    enqueueSnackbar("파일이 정상적으로 등록 되었습니다.", {
                      variant: "success",
                      autoHideDuration: 2000,
                    });
                  }
                }}
              />
            </Row>
          </Row>
        </RowLabel>
      </Column>

      <Row justifyContent={"center"} sx={{ width: "100%", mt: 10, gap: 1.5 }}>
        <Button
          text="등록"
          fs="h6"
          w={158}
          h={25}
          action={async () => {
            // console.log(
            //   "hi",
            //   values.map((v) =>
            //     Object.assign(
            //       {},
            //       {
            //         pk: v.pk,
            //         field_pk: v.field_pk,
            //         value: v.value,
            //       }
            //     )
            //   )
            // );
            if (!head_office_org_code)
              return enqueueSnackbar("조직을 선택해주세요.", {
                variant: "error",
                autoHideDuration: 2000,
              });
            const newValue = values.map((v) =>
              Object.assign(
                {},
                {
                  field_pk: v.field_pk,
                  value: v.value,
                }
              )
            );
            const res = await Axios.Post("db/list", {
              token: getAccessToken(),
              db_pk: router.query.menu,
              organization_code: head_office_org_code,
              user_pk:
                user_info?.grade === "관리자" ? user_info?.pk : undefined,
              geo_parent: parent_area,
              geo_name: child_area,
              values: newValue,
            });
            if (res?.code === 200) {
              enqueueSnackbar("DB가 등록되었습니다.", {
                variant: "success",
                autoHideDuration: 2000,
              });
              router.back();
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
