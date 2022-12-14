import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Layout from "../../../src/components/Layout";
import Column from "../../../src/components/Box/Column";
import Row from "../../../src/components/Box/Row";
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

import Input, { DateInput, OutLineInput } from "../../../src/components/Input";
import SelectInput, {
  OutLineSelectInput,
} from "../../../src/components/Input/Select";
import Button from "../../../src/components/Button";
import RowLabel from "../../../src/components/Box/RowLabel";
import RadioInput from "../../../src/components/Radio";
import Editor from "../../../src/components/Editor";
import Axios from "../../../src/utility/api";
import { getAccessToken } from "../../../src/utility/getCookie";
import { useTransition } from "react";
import useGetOrganization from "../../../src/hooks/share/useGetOrganization";
import { getOrgHeadOffice } from "../../../src/utility/organization/getOrgWithUnit";
import { useSnackbar } from "notistack";
import moment from "moment";

export default function Popup() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [orgMenuList, setOrgMenuList] = useState({});
  const el = useRef(null);

  const [title, setTitle] = useState("");
  const [size, setSize] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [position, setPosition] = useState("");
  const [activate, setActivate] = useState("");
  const [content, setContent] = useState("");
  const [pk, setPk] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);
  const [count, setCount] = useState(1);

  const [org_code, setOrgCode] = useState("전체");

  const [popup_detail, setPopupDeail] = useState([]);
  const [isPending, startTransition] = useTransition();

  const { sales } = useGetOrganization("sales");

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
    if (date[0].startDate && !date[0].endDate) return;
    if (date[0].startDate)
      setStartDate(moment(date[0].startDate).format("YYYY-MM-DD"));
    if (date[0].endDate && String(date[0].endDate) !== "Invalid date")
      setEndDate(moment(date[0].endDate).format("YYYY-MM-DD"));
  }, [date]);

  useEffect(() => {
    if (sales?.length === 0) return;
    const head_org = {};

    getOrgHeadOffice(sales, head_org);

    setOrgMenuList(head_org);
  }, [sales]);

  const getPopupDetail = async () => {
    if (!router.isReady) return;
    const res = (
      await Axios.Get(`popup/${router.query.detail}?token=${getAccessToken()}`)
    )?.data;

    if (res?.code === 200)
      startTransition(() => {
        const {
          activate,
          content,
          organization_name,
          position,
          size,
          title,
          pk,
        } = res?.data;

        const resize = size.split("/");
        const rePostion = position.split("/");

        if (activate.split("~").length === 2) {
          setActivate("활성화(기간 설정)");
          setStartDate(activate.split("~")[0]);
          setEndDate(activate.split("~")[1]);
        } else {
          setActivate(activate);
        }

        document.querySelector(".ql-editor").innerHTML = content;

        setContent(content);
        setOrgCode(organization_name);
        setPosition(rePostion?.length === 1 ? position : "custom");
        setSize(resize?.length === 1 ? size : "custom");
        setWidth(resize.length === 1 ? "" : resize?.[0]);
        setHeight(resize.length === 1 ? "" : resize?.[1]);
        setX(rePostion.length === 1 ? "" : rePostion?.[0]);
        setY(rePostion.length === 1 ? "" : rePostion?.[1]);

        setTitle(title);
        setPk(pk);
      });
  };

  useEffect(() => {
    if (sales.length === 0) return;
    const findOrg = Object.keys(orgMenuList).find(
      (key) => orgMenuList[key] === org_code
    );

    setOrgCode(findOrg);
  }, [orgMenuList]);

  useEffect(() => {
    getPopupDetail();
  }, [router.isReady]);

  return (
    <Layout>
      <Column sx={{ gap: 2, maxWidth: 927 }}>
        <RowLabel label="조직" fs="h4" label_w={45}>
          <OutLineSelectInput
            menuItems={orgMenuList}
            value={org_code}
            setValue={setOrgCode}
          />
        </RowLabel>
        <RowLabel label="제목" fs="h4" label_w={45}>
          <OutLineInput
            w="70%"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </RowLabel>
        <RowLabel label="위치" fs="h4" label_w={45}>
          <OutLineSelectInput
            value={position}
            setValue={setPosition}
            menuItems={{
              좌측상단: "좌측상단",
              중앙: "중앙",
              우측상단: "우측상단",
              custom: "사용자 지정",
            }}
          />
          {position === "custom" && (
            <Row justifyContent={"start"} sx={{ width: "100%", gap: 1 }}>
              <Row alignItems={"center"}>
                <Typography variant="h6">가로 좌표</Typography>
                <OutLineInput
                  w={65}
                  sx={{ ml: 1, mr: 0.5 }}
                  value={x}
                  onChange={(e) => setX(e.target.value)}
                />
              </Row>
              <Row alignItems={"center"}>
                <Typography variant="h6">세로 좌표</Typography>
                <OutLineInput
                  w={65}
                  sx={{ ml: 1, mr: 0.5 }}
                  value={y}
                  onChange={(e) => setY(e.target.value)}
                />
              </Row>
            </Row>
          )}
        </RowLabel>
        <RowLabel label="크기" fs="h4" label_w={45}>
          <Column>
            <Row wrap={"wrap"}>
              <FormControlLabel
                label="대(가로:600, 세로:800)"
                control={
                  <RadioInput
                    checked={size === "대"}
                    onClick={() => setSize("대")}
                  />
                }
              />
              <FormControlLabel
                label="중(가로:500, 세로:300)"
                control={
                  <RadioInput
                    checked={size === "중"}
                    onClick={() => setSize("중")}
                  />
                }
              />
              <FormControlLabel
                label="소(가로:250, 세로:300)"
                control={
                  <RadioInput
                    checked={size === "소"}
                    onClick={() => setSize("소")}
                  />
                }
              />
              <FormControlLabel
                label="사용자 지정"
                control={
                  <RadioInput
                    checked={size === "custom"}
                    onClick={() => setSize("custom")}
                  />
                }
              />
            </Row>
            {size === "custom" && (
              <Row justifyContent={"end"} sx={{ width: "100%", gap: 1 }}>
                <Row alignItems={"center"}>
                  <Typography variant="h6">가로</Typography>
                  <OutLineInput
                    w={65}
                    sx={{ ml: 1, mr: 0.5 }}
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                  />
                  <Typography variant="h6">px</Typography>
                </Row>
                <Row alignItems={"center"}>
                  <Typography variant="h6">세로</Typography>
                  <OutLineInput
                    w={65}
                    sx={{ ml: 1, mr: 0.5 }}
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                  <Typography variant="h6">px</Typography>
                </Row>
              </Row>
            )}
          </Column>
        </RowLabel>
        <RowLabel label="활성화" fs="h4" label_w={45}>
          <OutLineSelectInput
            value={activate}
            setValue={setActivate}
            menuItems={{
              "활성화(매일)": "활성화(매일)",
              "활성화(기간 설정)": "활성화(기간 설정)",
              비활성화: "비활성화",
            }}
          />
          {activate === "활성화(기간 설정)" && (
            <div ref={el}>
              <DateInput
                value={date}
                setValue={setDate}
                textValue={date}
                startValue={start_date}
                endValue={end_date}
              />
            </div>
          )}
        </RowLabel>

        <Editor
          onBlur={(e, t, c) => {
            setContent(c.getHTML());
          }}
        />

        <Row
          justifyContent={"center"}
          sx={{ mt: "70px", maxWidth: "1039px", gap: 1 }}
        >
          <Button
            variant="contained"
            bgColor="primary"
            text="등록"
            color="primary.white"
            fs="h6"
            w={160}
            h={25}
            action={async () => {
              setCount(count + 1);
              if (count === 2) {
                const res = await Axios.Post("popup", {
                  token: getAccessToken(),
                  organization_code: org_code === "전체" ? "all" : org_code,
                  popup_pk: pk,
                  title: title,
                  size: size === "custom" ? width + "/" + height : size,
                  position: position === "custom" ? x + "/" + y : position,
                  activate:
                    activate === "활성화(기간 설정)"
                      ? `${start_date}~${end_date}`
                      : activate,
                  content: content,
                });

                if (res?.code === 200) {
                  enqueueSnackbar("팝업이 수정되었습니다.", {
                    variant: "success",
                    autoHideDuration: 2000,
                  });
                  router.back();
                }
              }
            }}
          />
          <Button
            variant="contained"
            bgColor="gray"
            text="취소"
            color="primary.white"
            fs="h6"
            w={160}
            h={25}
            action={() => router.push("/setting")}
          />
        </Row>
      </Column>
    </Layout>
  );
}
