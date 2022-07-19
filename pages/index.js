import Layout from "../src/components/Layout";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home({ getCookies }) {
  const router = useRouter();
  useEffect(() => {
    !getCookies && router.replace("/login");
  }, []);
  return <Layout />;
}

export async function getServerSideProps(context) {
  return {
    props: {
      getCookies: context.req.cookies.user_info || null,
    },
  };
}
