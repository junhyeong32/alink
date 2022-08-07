import Layout from "../src/components/Layout";
import Column from "../src/components/Box/Column";
import Row from "../src/components/Box/Row";
import { Container, Typography, Select, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import ReceptionStatusTable from "../src/components/Table/data-status/ReceptionStatusTable";
import {
  select_title,
  area_input,
  headquarters_input,
  branch_input,
} from "../src/components/Table/data-status/ReceptionStatusList";
import {
  LabelOutLineSelectInput,
  OutLineSelectInput,
} from "../src/components/Input/Select";
import Button from "../src/components/Button";
import Image from "next/image";
import Axios from "../src/utility/api";
import { getAccessToken, getCookie } from "../src/utility/getCookie";

export default function DbStatus() {
  const [area, setArea] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState("");
  const [rank] = useState(getCookie("user_info")?.grade);

  useEffect(() => {
    const a = async () => {
      const res = await Axios.Get(
        `user/db/history?token=${getAccessToken()}?type=new`
      );
      console.log(res);
    };

    a();
  }, []);

  return (
    <Layout>
      <Column>
        {rank !== "본부장" &&
          rank !== "지점장" &&
          rank !== "팀장" &&
          rank !== "담당자" && (
            <>
              <Row justifyContent={"end"}>
                <Button
                  h={20}
                  variant="contained"
                  bgColor={"gray"}
                  fs="h6"
                  color="primary.white"
                  text="초기화"
                />
              </Row>

              <Row
                justifyContent={"between"}
                alignItems={"center"}
                sx={{ borderBottom: "1px solid black", pb: 1 }}
              >
                <Typography sx={{ fontSize: "30px" }}>분배 가능 DB</Typography>

                <Row sx={{ gap: "21px", mt: 1 }}>
                  {select_title.map((title, key) => (
                    <LabelOutLineSelectInput
                      key={key}
                      title={title}
                      value={
                        title === "지역"
                          ? area
                          : title === "본부"
                          ? headquarters
                          : branch
                      }
                      menuItems={
                        title === "지역"
                          ? area_input[0]
                          : title === "본부"
                          ? headquarters_input[0]
                          : branch_input[0]
                      }
                    />
                  ))}
                </Row>
              </Row>

              <Row
                alignItems={"center"}
                justifyContent={"around"}
                sx={{ mt: 2 }}
              >
                <Image
                  src="/left_arrow.png"
                  width={31}
                  height={35}
                  layout="fixed"
                  alt="left"
                />
                <Column alignItems={"center"}>
                  <Typography sx={{ fontSize: 25, fontWeight: 350 }}>
                    보장
                  </Typography>
                  <Typography sx={{ fontSize: 30, fontWeight: 350 }}>
                    100
                  </Typography>
                </Column>
                <Column alignItems={"center"}>
                  <Typography sx={{ fontSize: 25, fontWeight: 350 }}>
                    재무
                  </Typography>
                  <Typography sx={{ fontSize: 30, fontWeight: 350 }}>
                    100
                  </Typography>
                </Column>
                <Column alignItems={"center"}>
                  <Typography sx={{ fontSize: 25, fontWeight: 350 }}>
                    유전자
                  </Typography>
                  <Typography sx={{ fontSize: 30, fontWeight: 350 }}>
                    100
                  </Typography>
                </Column>
                <Image
                  src="/right_arrow.png"
                  width={31}
                  height={35}
                  layout="fixed"
                  alt="right"
                />
              </Row>
            </>
          )}

        <Column
          sx={{
            mt:
              rank !== "본부장" &&
              rank !== "지점장" &&
              rank !== "팀장" &&
              rank !== "담당자"
                ? 10
                : 0,
          }}
        >
          <Row
            alignItems={"center"}
            justifyContent={"between"}
            sx={{ mb: "10px" }}
          >
            <Typography sx={{ fontSize: "30px" }}>접수 현황</Typography>
            <OutLineSelectInput menuItems={{}} />
          </Row>

          <ReceptionStatusTable />
        </Column>
      </Column>
    </Layout>
  );
}
