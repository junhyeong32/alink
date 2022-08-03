import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../src/components/Layout";
import Column from "../../src/components/Box/Column";
import Row from "../../src/components/Box/Row";
import { Typography, FormControlLabel } from "@mui/material";

import SelectInput, {
  OutLineSelectInput,
} from "../../src/components/Input/Select";
import Button from "../../src/components/Button";
import RowLabel from "../../src/components/Box/RowLabel";
import UnderLineInput, { OutLineInput } from "../../src/components/Input";
import MemoBox from "../../src/components/Box/Memo";
import DisableBox from "../../src/components/Box/DisableBox";
import { ModalContext } from "../../src/contexts/ModalContext";
import Axios from "../../src/utility/api";
import { getAccessToken, getCookie } from "../../src/utility/getCookie";
import useGetOrganization from "../../src/hooks/share/useGetOrganization";
import useGetArea from "../../src/hooks/setting/useGetArea";
import RadioInput from "../../src/components/Radio";
import { useSnackbar } from "notistack";
import uploadFile from "../../src/utility/uploadFile";

import { styled } from "@mui/material/styles";

const Input = styled("input")({
  display: "none",
});

export default function DbDetail() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [menu_detail, setMenuDetail] = useState([]);
  const { sales } = useGetOrganization("sales");
  const { area } = useGetArea();
  const [db_detail, setDbDetail] = useState([]);
  const [user_info] = useState(getCookie("user_info"));

  //change state
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(20);
  const [head_office_org_code, setHeadOfficeOrgCode] = useState("");
  const [org_code, setOrgCode] = useState("");
  const [status, setStatus] = useState("");
  const [org_status, setOrgStatus] = useState("");
  const [allocated_user, setAllocatedUser] = useState("");
  const [parent_area, setParentArea] = useState("");
  const [child_area, setChildArea] = useState("");
  const [created_date, setCreatedDate] = useState("");
  const [uploader, setUploader] = useState({});
  const [values, setValues] = useState([]);

  const [transcript_file, setTranscriptFile] = useState("");
  const [memo, setMemo] = useState("");

  //menuItmes
  const [headOfficeMenuList, setHeadOfficeMenuList] = useState({});
  const [orgMenuList, setOrgMenuList] = useState({});
  const [uploaderMenuList, setUploaderMenuList] = useState({});
  const [areaParentMenuList, setAreaParentMenuList] = useState({
    전체: "전체",
  });
  const [areaChildMenuList, setAreaChildMenuList] = useState({ 전체: "전체" });

  const [date_range, setDateRange] = useState(new Date());
  const { openModal, closeModal, modalContent } = useContext(ModalContext);

  //지역구분
  useEffect(() => {
    setAreaParentMenuList((prev) => {
      const parent = { ...prev };
      area?.map((d, key) => {
        Object.assign(parent, { [d.parent]: d.parent });
      });
      return parent;
    });

    setAreaChildMenuList((prev) => {
      const child = { ...prev };

      area?.map((filter_area) => {
        filter_area?.children?.map((d) => {
          Object.assign(child, { [d]: d });
        });
      });

      return child;
    });
  }, [area]);

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

      if (res?.code === 200) {
        const {
          allocated_user,
          created_date,
          geo_name,
          geo_parent,
          org_status,
          status,
          uploader,
          values,
          organization_code,
        } = res?.data;
        setDbDetail(res?.data);
        setAllocatedUser(allocated_user);
        setCreatedDate(created_date);
        setParentArea(geo_parent);
        setChildArea(geo_name);
        setOrgStatus(org_status);
        setStatus(status);
        setUploader(uploader);
        setValues(values);
        setOrgCode(organization_code);
      }
    };

    getDbDetail();
    setLoading(false);
  }, [router.isReady, router.query.db]);

  //상세지역구분
  useEffect(() => {
    if (!parent_area) return;

    setAreaChildMenuList((prev) => {
      const child = { ...prev };

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

  console.log(values);

  return (
    <Layout loading={loading}>
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
                          defaultValue={
                            values.filter((v) => v?.title === "고객명")?.[0]
                              ?.value
                          }
                          onBlur={(e) =>
                            setValues((prev) => {
                              const newData = [...prev];
                              const dataObj = newData.filter(
                                (data) => data.title === "고객명"
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
                          defaultValue={
                            values.filter((v) => v?.title === "연락처")?.[0]
                              ?.value
                          }
                          onBlur={(e) =>
                            setValues((prev) => {
                              const newData = [...prev];
                              const dataObj = newData.filter(
                                (data) => data.title === "연락처"
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
                          defaultValue={
                            values.filter((v) => v?.title === "나이")?.[0]
                              ?.value
                          }
                          onBlur={(e) =>
                            setValues((prev) => {
                              const newData = [...prev];
                              const dataObj = newData.filter(
                                (data) => data.title === "나이"
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
                                values.filter((v) => v?.title === "성별")?.[0]
                                  ?.value === "남자"
                              }
                              onClick={() =>
                                setValues((prev) => {
                                  const newData = [...prev];
                                  const dataObj = newData.filter(
                                    (data) => data.title === "성별"
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
                                values.filter((v) => v?.title === "성별")?.[0]
                                  ?.value === "여자"
                              }
                              onClick={() =>
                                setValues((prev) => {
                                  const newData = [...prev];
                                  const dataObj = newData.filter(
                                    (data) => data.title === "성별"
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
                                values.filter(
                                  (v) => v?.title === "결혼여부"
                                )?.[0]?.value === "미혼"
                              }
                              onClick={() =>
                                setValues((prev) => {
                                  const newData = [...prev];
                                  const dataObj = newData.filter(
                                    (data) => data.title === "결혼여부"
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
                                values.filter(
                                  (v) => v?.title === "결혼여부"
                                )?.[0]?.value === "기혼"
                              }
                              onClick={() =>
                                setValues((prev) => {
                                  const newData = [...prev];
                                  const dataObj = newData.filter(
                                    (data) => data.title === "결혼여부"
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
                  case "특이사항":
                    return (
                      <RowLabel label="특이사항" fs="h5" key={key}>
                        <OutLineInput
                          defaultValue={
                            values.filter((v) => v?.title === "특이사항")?.[0]
                              ?.value
                          }
                          onBlur={(e) =>
                            setValues((prev) => {
                              const newData = [...prev];
                              const dataObj = newData.filter(
                                (data) => data.title === "특이사항"
                              );
                              dataObj[0].value = e.target.value;

                              return newData;
                            })
                          }
                        />
                      </RowLabel>
                    );
                  case "등록일시":
                    return (
                      <RowLabel label="등록일시" fs="h5" key={key}>
                        <Typography variant="h5">
                          {db_detail?.created_date}
                        </Typography>
                      </RowLabel>
                    );
                }
              }
            })}

            <RowLabel label="지역" fs="h5">
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

            <RowLabel label="등록처" fs="h5">
              <Typography variant="h5">{db_detail?.uploader?.name}</Typography>
            </RowLabel>
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
                  <Row
                    alignItems={"center"}
                    justifyContent={"start"}
                    sx={{ gap: 1 }}
                  >
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
                              newData?.filter(
                                (data) => data?.title === "녹취 파일"
                              )[0]
                            );

                            newObj.value = _uploadFile;

                            newData.push(newObj);

                            return newData;
                          });
                          setTranscriptFile();
                          enqueueSnackbar(
                            "파일이 정상적으로 등록 되었습니다.",
                            {
                              variant: "success",
                              autoHideDuration: 2000,
                            }
                          );
                        }
                      }}
                    />
                  </Row>
                </Row>
                <Row sx={{ width: "100%", gap: 3, maxWidth: 1020 }}>
                  {values?.map(
                    (v, _key) =>
                      v?.title === "녹취 파일" &&
                      v?.value && (
                        <Column
                          sx={{
                            width: "auto",
                            p: 1,
                            border: "1px solid black",
                            borderRadius: "5px",
                          }}
                        >
                          <Typography variant="h6" ml={3} mb={1}>
                            {v?.created_date}{" "}
                          </Typography>
                          <audio controls src={v?.value}>
                            Your browser does not support the
                            <code>audio</code> element.
                          </audio>
                        </Column>
                      )
                  )}
                </Row>
              </Column>
            </>
          ))}

        {menu_detail?.fields
          ?.filter(
            (field) =>
              field?.is_detail_shown === 1 && field?.property?.name === "메모"
          )
          ?.map((filter_data, key) => (
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
                  action={() =>
                    setValues((prev) => {
                      setValues((prev) => {
                        const newData = [...prev];
                        const newObj = Object.assign(
                          {},
                          newData?.filter((data) => data?.title === "메모")[0]
                        );
                        newObj.created_date = new Date(
                          +new Date() + 3240 * 10000
                        )
                          .toISOString()
                          .replace("T", " ")
                          .replace(/\..*/, "");
                        newObj.value = memo;

                        newData.push(newObj);

                        return newData;
                      });
                      setMemo("");
                    })
                  }
                />
              </Row>
              <OutLineInput
                placeholder="메모를 입력해주세요."
                rows={4}
                multiline
                value={memo}
                setValue={setMemo}
              />
              <Row sx={{ width: "100%", gap: 3, maxWidth: 1020 }}>
                {values?.map(
                  (v, _key) =>
                    v?.title === "메모" &&
                    v?.value && (
                      <MemoBox time={v?.created_date} text={v?.value} />
                    )
                )}
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
                  modal: "needconfirm",
                  content: {
                    contents: "수정을 진행하시겠습니까? ",
                    action: async () => {
                      const newValue = values?.map((v) =>
                        Object.assign(
                          {},
                          {
                            pk: v.pk,
                            field_pk: v.field_pk,
                            value: v.value,
                          }
                        )
                      );
                      const res = await Axios.Post("db/list", {
                        token: getAccessToken(),
                        list_pk: router.query.db,
                        db_pk: router.query.menu,
                        organization_code: org_code,
                        user_pk: user_info?.pk,
                        geo_parent: parent_area,
                        geo_name: child_area,
                        values: [...newValue],
                      });

                      if (res?.code === 200) {
                        closeModal();
                        enqueueSnackbar("DB 수정이 완료되었습니다.", {
                          variant: "success",
                          autoHideDuration: 2000,
                        });
                        router.back();
                      }
                    },
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
                modal: "needconfirm",
                content: {
                  contents: "해당DB를 삭제하시겠습니까?",
                  buttonText: "삭제",
                  action: async () => {
                    const res = await Axios.Post("db/list/remove", {
                      token: getAccessToken(),
                      list_pk: router.query.db,
                    });

                    if (res?.code === 200) {
                      closeModal();
                      enqueueSnackbar("DB가 삭제되었습니다.", {
                        variant: "success",
                        autoHideDuration: 2000,
                      });
                      router.back();
                    }
                  },
                },
              })
            }
          />
        </Row>
      </Column>
    </Layout>
  );
}
