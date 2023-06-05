import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AnimatePresence } from "framer-motion";
import { Poppins, Inter } from "@next/font/google";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import Router from "next/router";

import { api } from "@/utils/api";

import "@/styles/globals.css";

const inter = Inter({
  weight: "variable",
  subsets: ["latin"],
  variable: "--inter-font",
});

const poppins = Poppins({
  subsets: ["latin"],
  // weight: "100 900",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: "normal",
  variable: "--poppins-font",
});

const handleRouteStart = () => nProgress.start();
const handleRouteDone = () => nProgress.done();

nProgress.configure({ showSpinner: false })
nProgress.configure({ easing: "ease in out", speed: 500 })
nProgress.configure({ trickleSpeed: 800 })

Router.events.on("routeChangeStart", () => handleRouteStart)
Router.events.on("routeChangeComplete", () => handleRouteDone)
Router.events.on("routeChangeError", () => handleRouteDone)

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <style jsx global>{`
          :root {
            --poppins-font: ${poppins.style.fontFamily};
            --inter-font: ${inter.style.fontFamily};
          }
      `}</style>
      <SessionProvider session={session}>
        <AnimatePresence mode="wait" initial={false}>
          <div className={poppins.variable}>
              <Component {...pageProps} />
          </div>
        </AnimatePresence>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
