import { Fade, Box, Slide, SlideFade } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { IoChevronUpOutline } from "react-icons/io5";
import { safeMarginX } from "../utils/mediaQuery";
import ScrollToTop from "react-scroll-up";

export default function ToTop() {
  const [offsetHeader, setOffsetHeader] = useState(false);

  useEffect(() => {
    headerClass();
    window.onscroll = function () {
      headerClass();
    };
  }, []);

  const headerClass = () => {
    if (window.scrollY > 500) {
      setOffsetHeader(true);
    } else {
      setOffsetHeader(false);
    }
  };

  return (
    <></>
    // <ScrollToTop
    //   showUnder={160}
    //   // style={{
    //   //   position: "fixed",
    //   //   bottom: 100,
    //   //   right: 100,
    //   //   cursor: "pointer",
    //   //   transitionDuration: "0.3s",
    //   //   transitionTimingFunction: "ease",
    //   //   transitionDelay: "0.5s",
    //   // }}
    // >
    //   <Box
    //     // position="fixed"
    //     // zIndex={9999}
    //     // bottom={10}
    //     right={safeMarginX}
    //     h={42}
    //     w={42}
    //     bg="white"
    //     borderRadius="50%"
    //     className="header-box-shadows"
    //     p={1}
    //     // cursor={`pointer`}
    //     // onClick={() => {
    //     //   window.scroll({
    //     //     top: 0,
    //     //     left: 0,
    //     //     behavior: "smooth",
    //     //   });
    //     // }}
    //   >
    //     <IoChevronUpOutline size="fill" />
    //   </Box>
    // </ScrollToTop>
  );
}
