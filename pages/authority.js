import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../src/components/Layout";
import Column from "../src/components/Box/Column";
import Row from "../src/components/Box/Row";
import Button from "../src/components/Button";
import AuthorityTable from "../src/components/Table/authority";
import OrganizationList from "../src/components/OrganizationList/List";
import useGetGroupList from "../src/hooks/share/useGetGroupList";

export default function Authority() {
  const router = useRouter();
  //   const group_list = useGetGroupList();

  return (
    <Layout>
      <Row sx={{ width: "100%" }}>
        {/* <OrganizationList group_list={group_list} /> */}
        <Column sx={{ width: "80%" }}>
          <Row justifyContent={"end"} sx={{ width: "100%" }}>
            <Button
              text="입금 완료"
              variant={"contained"}
              color={"primary.white"}
              bgColor={"primary"}
              fs={"h6"}
            />
            <Button
              text="입금 미완료"
              variant="contained"
              color={"primary.white"}
              bgColor={"orange"}
              fs={"h6"}
            />
            <Button
              text="승인"
              variant="contained"
              color={"primary.white"}
              bgColor={"primary"}
              fs={"h6"}
            />
            <Button
              text="미승인"
              variant="contained"
              color={"primary.white"}
              bgColor={"orange"}
              fs={"h6"}
            />
          </Row>
          <AuthorityTable />
        </Column>
      </Row>
    </Layout>
  );
}
