import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Layout from "../../src/components/Layout";
import Column from "../../src/components/Box/Column";
import Row from "../../src/components/Box/Row";
import Input, {
  DateInput,
  LabelUnderLineInput,
} from "../../src/components/Input";
import SelectInput, {
  OutLineSelectInput,
} from "../../src/components/Input/Select";
import Button from "../../src/components/Button";
import Image from "next/image";
import SmsTable from "../../src/components/Table/sms";
import { styles } from "../../src/styles/sms";
import Axios from "../../src/utility/api";
import { getAccessToken } from "../../src/utility/getCookie";
import moment from "moment";

export default function Sms() {
  const router = useRouter();

  const el = useRef(null);

  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");

  const [menu, setMenu] = useState("popup");
  const [page, setPage] = useState("");
  const [count, setCount] = useState("");
  const [user_name, setuserName] = useState("");
  const [created_date_start, setcreatedDateStart] = useState("");
  const [created_date_end, setCreatedDateEnd] = useState("");
  const [notification_list, setNotificationList] = useState([]);

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

  const getNotification = async (is_init) => {
    const res = is_init
      ? await Axios.Get("notification", {
          params: {
            token: getAccessToken(),
          },
        })
      : (
          await Axios.Get("notification", {
            params: {
              token: getAccessToken(),
              page: page,
              count: count,
              user_name: user_name,
              created_date_start: created_date_start,
              created_date_end: created_date_end,
            },
          })
        )?.data;

    console.log("res", res);

    if (res?.code === 200) {
      setNotificationList(res?.data?.result);
    }
  };

  useEffect(() => {
    getNotification();
  }, []);

  return (
    <Layout>
      <Column sx={{ gap: "25px" }}>
        <Row justifyContent={"end"} sx={{ width: "100%", gap: 1 }}>
          <Button
            text="초기화"
            bgColor={"gray"}
            variant={"contained"}
            color="primary.white"
            w={60}
            h={28}
            fs="h6"
            action={() => {
              getNotification(true);
              setuserName("");
            }}
          />
          <Button
            text="검색"
            bgColor={"primary"}
            variant={"contained"}
            color="primary.white"
            w={60}
            h={28}
            fs="h6"
            action={getNotification}
          />
        </Row>
        <Row
          justifyContent={"start"}
          alignItems={"end"}
          wrap={"wrap"}
          sx={{ gap: 2 }}
        >
          <div ref={el}>
            <DateInput
              value={date}
              setValue={setDate}
              textValue={date}
              startValue={start_date}
              endValue={end_date}
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
                      action={() =>
                        setDate([
                          {
                            ...date.key,
                            startDate: new Date(),
                            endDate: new Date(),
                          },
                        ])
                      }
                    />
                    <Button
                      text="어제"
                      bgColor={"gray"}
                      fs={"h6"}
                      color={"primary.white"}
                      h={14}
                      action={() =>
                        setDate([
                          {
                            ...date.key,
                            startDate: new Date(
                              new Date().setDate(new Date().getDate() - 1)
                            ),
                            endDate: new Date(),
                          },
                        ])
                      }
                    />
                    <Button
                      text="이번주"
                      bgColor={"gray"}
                      fs={"h6"}
                      color={"primary.white"}
                      h={14}
                      action={() =>
                        setDate([
                          {
                            ...date.key,
                            startDate: new Date(
                              new Date().setDate(new Date().getDate() - 7)
                            ),
                            endDate: new Date(),
                          },
                        ])
                      }
                    />
                    <Button
                      text="지난달"
                      bgColor={"gray"}
                      fs={"h6"}
                      color={"primary.white"}
                      h={14}
                      action={() =>
                        setDate([
                          {
                            ...date.key,
                            startDate: new Date(
                              new Date().setMonth(new Date().getMonth() - 1)
                            ),
                            endDate: new Date(),
                          },
                        ])
                      }
                    />
                  </Row>
                </>
              }
            />
          </div>
          <LabelUnderLineInput
            title="담당자"
            placeholder={"담당자로 검색하실 수 있습니다"}
            w={styles.input}
            value={user_name}
            setValue={setuserName}
          />

          {/* <Typography variant="h6">보유 포인트 : </Typography> */}
        </Row>
        <SmsTable data={notification_list} />
      </Column>
    </Layout>
  );
}
