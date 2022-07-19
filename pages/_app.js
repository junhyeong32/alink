import * as React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../src/theme";
import createEmotionCache from "../src/components/createEmotionCache";
import "../styles/globals.css";
import { SnackbarProvider } from "notistack";
import { OrganizationProvider } from "../src/contexts/OrganizationListContext";
import { ModalProvider } from "../src/contexts/ModalContext";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}) {
  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      maxSnack={10}
    >
      <CacheProvider value={emotionCache}>
        <Head>
          <title>AFG ALINK</title>
          <meta
            name="viewport"
            content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width"
          />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ModalProvider>
            <OrganizationProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Component {...pageProps} />
              </LocalizationProvider>
            </OrganizationProvider>
          </ModalProvider>
        </ThemeProvider>
      </CacheProvider>
    </SnackbarProvider>
  );
}
