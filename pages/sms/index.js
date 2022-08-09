import { useState, useEffect } from "react";
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

export default function Sms() {
  const router = useRouter();
  const [menu, setMenu] = useState("popup");
  const [page, setPage] = useState("");
  const [count, setCount] = useState("");
  const [user_name, setuserName] = useState("");
  const [created_date_start, setcreatedDateStart] = useState("");
  const [created_date_end, setCreatedDateEnd] = useState("");

  const [notification_list, setNotificationList] = useState([]);

  useEffect(() => {
    const getNotification = async () => {
      const res = (
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
        // setCoopMenuItems(org);
      }
    };

    getNotification();
  }, []);

  return (
    <Layout>
      <Column sx={{ gap: "25px" }}>
        <Row
          justifyContent={"between"}
          alignItems={"end"}
          wrap={"wrap"}
          sx={styles.filter_row}
        >
          <SelectInput title="발송일" menuItems={{}} w={styles.input} />
          <LabelUnderLineInput
            title="담당자"
            placeholder={"담당자로 검색하실 수 있습니다"}
            w={styles.input}
            value={user_name}
            setValue={setuserName}
          />
          <LabelUnderLineInput
            title="연락처"
            placeholder={"연락처로 검색하실 수 있습니다"}
            w={styles.input}
            // value={phone}
            // setValue={setPhone}
          />
          <Button
            text="초기화"
            bgColor={"gray"}
            variant={"contained"}
            color="primary.white"
            w={60}
            h={20}
            fs="h6"
          />
          {/* <Typography variant="h6">보유 포인트 : </Typography> */}
        </Row>
        <SmsTable data={notification_list} />
      </Column>
    </Layout>
  );
}
