import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Layout from "../../src/components/Layout";
import Column from "../../src/components/Box/Column";
import Row from "../../src/components/Box/Row";
import Input, {
  DateInput,
  LabelUnderLineInput,
} from "../../src/components/Input";
import Button from "../../src/components/Button";
import SmsTable from "../../src/components/Table/sms";
import { styles } from "../../src/styles/sms";
import Axios from "../../src/utility/api";
import { getAccessToken } from "../../src/utility/getCookie";
import moment from "moment";
import { Pagination } from "@mui/material";

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
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(20);
  const [user_name, setuserName] = useState("");
  const [created_date_start, setcreatedDateStart] = useState("");
  const [created_date_end, setCreatedDateEnd] = useState("");
  const [notification_list, setNotificationList] = useState([]);
  const [totalCount, setTotalCount] = useState();

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
              created_date_start: start_date
                ? new Date(start_date).getTime()
                : undefined,
              created_date_end: end_date
                ? new Date(end_date).getTime()
                : undefined,
            },
          })
        )?.data;

    if (res?.code === 200) {
      setTotalCount(Math.ceil(res?.data.total_count / 20));
      setNotificationList(res?.data?.result);
    }
  };

  useEffect(() => {
    getNotification();
  }, [page]);

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
            action={() => getNotification(false)}
          />
        </Row>
        <Row
          justifyContent={"start"}
          alignItems={"end"}
          wrap={"wrap"}
          sx={{ gap: 2 }}
        >
          <div ref={el} id="dateInput">
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
                    발송일
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
                            endDate: new Date().setDate(
                              new Date().getDate() + 1
                            ),
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
            w={{
              lg: "25%",
              md: "25%",
              sm: "100%",
              xs: "100%",
            }}
            value={user_name}
            setValue={setuserName}
          />

          {/* <Typography variant="h6">보유 포인트 : </Typography> */}
        </Row>
        <SmsTable data={notification_list} page={page} />
      </Column>
      <Row justifyContent={"center"} sx={{ width: "100%", mt: 5 }}>
        <Pagination
          component="div"
          page={page}
          count={totalCount}
          onChange={(subject, newPage) => {
            setPage(newPage);
          }}
          color="primary"
          // hidePrevButton
          // hideNextButton
        />
      </Row>
    </Layout>
  );
}
