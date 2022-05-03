import Head from "next/head";
import Image from "next/image";
import Row from "../Box/Row";
import Column from "../Box/Column";
// import Circl
import { Typography, Box } from "@mui/material";
import { Children, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { routeList } from "./routerList";
import "animate.css";
import useRelativePx from "../../hooks/useRelativePx";

const circleArray = (screenWidth) => {
  let arr = [];
  for (let count = 0; count < screenWidth; count += 7) {
    arr.push(count);
  }

  return arr;
};

export default function Layout({ children }) {
  const router = useRouter();
  const [screenWidth, setScreenWidth] = useState();
  const [screenHeight, setScreenHeight] = useState();
  const [works, setWorks] = useState(false);
  const rw = useRelativePx().getRelativeWidthPx;
  const rh = useRelativePx().getRelativeHeightPx;

  useEffect(() => {
    setScreenWidth(document.body.clientWidth);
    setScreenHeight(document.body.clientHeight);
  }, []);

  useEffect(() => {
    if (
      router.asPath === "/reference" ||
      router.asPath === "/business-area" ||
      router.asPath === "/gallery"
    )
      setWorks(true);
  }, [router]);

  return (
    <Row
      alignItems={"start"}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        minWidth: screenWidth < 1280 ? 1280 : screenWidth,
      }}
    >
      <Column
        alignItems={"center"}
        justifyContent={"between"}
        sx={{
          width: "45%",
          p: `${rh(100)} ${rw(30)} ${rh(50)} ${rw(30)}`,
          height: "100%",
        }}
      >
        <Column
          sx={{ width: "60%" }}
          alignItems={"start"}
          justifyContent={"start"}
        >
          <Typography
            sx={{
              fontSize: "60px",
              lineHeight: "0.7",
              cursor: "pointer",
              fontFamily: "hanyg",
            }}
            onMouseOver={() => {
              router.push("/main");
            }}
          >
            LnC
          </Typography>
          <Typography variant="small" color="primary.gray">
            LEAD AND CREATIVE
          </Typography>
          <Typography variant="h2" mt={1}>
            <Typography component={"span"} variant="h2" color="primary.skyblue">
              DESIGN&nbsp;
            </Typography>
            GROUP
          </Typography>
          <Typography variant="small" style={{ fontWeight: "400" }}>
            BRING OUT THE BEST
          </Typography>
        </Column>

        <Column justifyContent={"center"} sx={{ width: "60%" }}>
          {routeList.map((list, key) => {
            return (
              <Typography
                key={key}
                className={
                  `/${Object.keys(list)}` === router.asPath &&
                  "animate__animated animate__bounce"
                }
                component={"div"}
                color={
                  list.works === "WORKS" ? "primary.purple" : "primary.skyblue"
                }
                onMouseOver={(e) => {
                  e.preventDefault();
                  Object.keys(list)[0] === "works"
                    ? setWorks(true)
                    : `/${router.push(Object.keys(list)[0])}`;
                }}
                sx={{
                  fontSize:
                    screenHeight < 800
                      ? "25px"
                      : screenWidth < 1400
                      ? "30px"
                      : "40px",
                  cursor: "pointer",
                  lineHeight: "1.5",
                  display: "flex",
                  alignItems: "center",
                  fontFamily: "Merriweather",
                }}
              >
                {router.asPath === `/${Object.keys(list)[0]}` && (
                  <Typography
                    className="animate__animated animate__bounce"
                    component={"div"}
                    sx={{
                      width: "8px",
                      height: "80%",
                      background: "#60B0BE",
                      mr: 1,
                    }}
                  />
                )}
                {list[Object.keys(list)[0]]}
              </Typography>
            );
          })}
          {works ? (
            <Box sx={{ ml: rw(64) }}>
              <Typography
                onClick={(e) => {
                  e.preventDefault();
                  router.push("business-area");
                }}
                color="primary.purple"
                sx={{
                  fontSize:
                    screenHeight < 800
                      ? "14px"
                      : screenWidth < 1400
                      ? "15px"
                      : "20px",
                  fontFamily: "Merriweather",
                  cursor: "pointer",
                }}
              >
                &gt; BUSINESS AREA
              </Typography>
              <Typography
                onClick={(e) => {
                  e.preventDefault();
                  router.push("reference");
                }}
                color="primary.purple"
                sx={{
                  fontSize:
                    screenHeight < 800
                      ? "14px"
                      : screenWidth < 1400
                      ? "15px"
                      : "20px",
                  fontFamily: "Merriweather",
                  cursor: "pointer",
                }}
              >
                &gt; REFERENCE
              </Typography>
              <Typography
                onClick={(e) => {
                  e.preventDefault();
                  router.push("gallery");
                }}
                color="primary.purple"
                sx={{
                  fontSize:
                    screenHeight < 800
                      ? "14px"
                      : screenWidth < 1400
                      ? "15px"
                      : "20px",
                  fontFamily: "Merriweather",
                  cursor: "pointer",
                }}
              >
                &gt; GALLERY
              </Typography>
            </Box>
          ) : null}
        </Column>
        <Column sx={{ width: "60%" }}>
          <Typography>
            LnC{" "}
            <Typography component={"span"} color="primary.skyblue">
              DESIGN
            </Typography>{" "}
            GROUP
          </Typography>
          <Typography>TEL . 02-3448-1118</Typography>
          <Typography>FAX . 02-3448-0399</Typography>

          <Column sx={{ width: "100%" }}>
            <Typography
              variant={screenHeight < 800 ? "h6" : "h2"}
              style={{
                color: "white",
                backgroundColor: "#5C5143",
                height: rh(37),
                display: "flex",
                alignItems: "center",
                paddingLeft: "8px",
              }}
            >
              LnC COMMUNITY
            </Typography>
            <Box
              sx={{
                backgroundImage: `url(/layout.jpg)`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                objectFit: "contain",
                width: "100%",
                height: rh(150),
              }}
            />
          </Column>

          <div style={{ border: "2px solid white", width: "201px" }} />
          <Column>
            <Typography variant="small">
              COPYRIGHTⓒ 2012 LnC . ALL RIGHTS RESERVED
            </Typography>
          </Column>
        </Column>
      </Column>

      <Box sx={{ border: "1px solid rgb(200,200,200)", height: "100%" }} />
      <Row sx={{ width: "100%", height: "100%" }}>{children}</Row>
      <Row
        wrap={"wrap"}
        sx={{
          border: "1px solid rgb(200,200,200)",
          height: "100vh",
          width: "180px !important",
          right: 0,
          gap: 2,
          p: 1,
          position: "sticky",
        }}
      >
        {circleArray(screenWidth).map((c, key) => (
          <Box
            key={c}
            className="fade"
            sx={{
              width: "20px",
              height: "20px",
              background: "#d7d7d7",
              borderRadius: "100%",
              animation: `fadein ${key - 0.7}s`,
              MozAnimation: `fadein ${key - 0.7}s`,
              WebkitAnimation: `fadein ${key - 0.7}s`,
              OAnimation: `fadein ${key - 0.7}s`,
            }}
          />
        ))}
      </Row>
    </Row>
  );
}
