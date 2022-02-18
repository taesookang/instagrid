import "../styles/globals.scss";
import "react-multi-carousel/lib/styles.css";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { AuthContextProvider } from "../context/AuthContext";


type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <AuthContextProvider>
        {getLayout(<Component {...pageProps} />)}
    </AuthContextProvider>
  );
}
