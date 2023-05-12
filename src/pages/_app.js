import { Box, ChakraProvider } from "@chakra-ui/react";
import Script from "next/script";

import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";

import NextNProgress from "nextjs-progressbar";
import { IoChevronUpOutline } from "react-icons/io5";
import ScrollToTop from "react-scroll-up";

import { useRouter } from "next/router";
import { useEffect } from "react";
import "../assets/main.scss";
import theme from "../assets/theme";
import { safeMarginX, useLargeQuery } from "../utils/mediaQuery";

function MyApp({ Component, pageProps }) {
  const { events } = useRouter();
  const { isLarge } = useLargeQuery();

  useEffect(() => {
    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(process.env.NEXT_PUBLIC_FACEBOOK_PIXEL);
        ReactPixel.pageView();

        router.events.on("routeChangeComplete", () => {
          ReactPixel.pageView();
        });
      });
  }, [events]);

  return (
    <ChakraProvider theme={theme}>
      <Script
        async
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
        `}
      </Script>
      <Script id="google-analytics-prod" strategy="afterInteractive">
        {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_PROD}');
        `}
      </Script>

      <NextNProgress
        color="rgba(150,150,150,0.4)"
        options={{ easing: "ease", showSpinner: true }}
      />
      <ScrollToTop
        showUnder={200}
        duration={1250}
        easing="easeInOutExpo"
        style={{
          position: "fixed",
          bottom: isLarge ? 60 : 20,
          right: isLarge ? 100 : 20,
          cursor: "pointer",
          transitionDuration: "1s",
          transitionTimingFunction: "ease-out",
          transitionDelay: "0s",
          zIndex: 1999,
        }}
      >
        <Box
          right={safeMarginX}
          h={42}
          w={42}
          bg="white"
          borderRadius="50%"
          className="header-box-shadows"
          p={1}
        >
          <IoChevronUpOutline size="100%" />
        </Box>
      </ScrollToTop>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
