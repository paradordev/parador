import { Box } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { NavContext, useHeaderImage, useHeaderImage2 } from "../utils/hooks";
import HeaderBot from "./HeaderBot";
import HeaderPop from "./HeaderPop";
import HeaderTop from "./HeaderTop";
import { useRouter } from "next/router";
import { includes } from "lodash";
import HeaderPopHotel from "./HeaderPopHotel";

const listPage = ["/", "special-offers", "meeting-events"];
const listPop = ["hotels", "dining"];

export default function Header({
  slug = "",
  data,
  hotelBrands = [],
  getHeight,
  isParador = false,
  color,
  isHomepage = true,
}) {
  const router = useRouter();

  const containerTop = useRef(null);
  const containerBot = useRef(null);

  const [containerHeight, setContainerHeight] = useState(100);
  const [isNavPop, setIsNavPop] = useState(false);
  const [navPosition, setNavPosition] = useState(router.route);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // !isParador && isNavPop ? 0 :
    setContainerHeight(containerTop.current.clientHeight + 56);
    getHeight(containerTop.current.clientHeight + 56);
  }, [containerTop, navPosition, isNavPop]);

  useEffect(() => {
    includes(listPop, navPosition) && setIsNavPop(true);
    includes(listPage, navPosition) && setIsNavPop(false);
  }, [navPosition, isNavPop]);

  useEffect(() => {
    listPage.map((v) => {
      router.route.includes(v) && setNavPosition(v);
    });
  }, []);

  const {
    images: headerImg,
    isError,
    isLoading,
  } = useHeaderImage({
    brand: "parador",
  });

  return (
    <NavContext.Provider
      value={{ navPosition, setNavPosition, isNavPop, setIsNavPop }}
    >
      {isParador ? (
        <Box display="initial">
          {!isNavPop && (
            <>
              <HeaderTop
                ref={containerTop}
                data={data}
                isHomepage={isHomepage}
              />
              <HeaderBot
                slug={slug}
                logo={data.logo_dark}
                topOffset={containerHeight}
                hotel_code={data.hotel_code}
                isParador={isParador}
                color={color}
                isHomepage={isHomepage}
              />
            </>
          )}

          {isNavPop && (
            <Box
              position="fixed"
              w="100%"
              zIndex={1001}
              h="100vh"
              bgImage={
                headerImg && !isError && !isLoading
                  ? `linear-gradient(0deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9)), url(${headerImg[0].url})`
                  : `grey`
              }
              bgSize="cover"
              bottom={0}
            >
              <Box />
              <Box
                zIndex={1002}
                position="absolute"
                right={12}
                top={20}
                cursor="pointer"
                onClick={() => {
                  setIsNavPop(false);
                  setNavPosition(router.route);
                }}
              >
                <IoCloseSharp size={32} color="white" />
              </Box>
              <HeaderTop isHomepage={true} ref={containerTop} data={data} />
              <HeaderPop hotelBrands={hotelBrands} isParador={isParador} />
            </Box>
          )}
        </Box>
      ) : (
        <Box display="initial">
          <HeaderTop ref={containerTop} data={data} isHomepage={isHomepage} />
          <HeaderBot
            logo={data.logo_dark}
            topOffset={containerHeight}
            hotel_code={data.hotel_code}
            isParador={isParador}
            color={color}
            isHomepage={isHomepage}
            slug={slug}
          />
        </Box>
      )}
    </NavContext.Provider>
  );
}

{
  /* <>
  <Box h={containerHeight}></Box>
  <Box
    position="fixed"
    top={0}
    bg={`${color}df`}
    w="100%"
    zIndex={1001}
    onMouseLeave={() => {
      setNavPosition("");
      setIsNavPop(false);
    }}
    className="all-animate"
  >
    {scrollPosition < containerHeight + 56 ? (
      <HeaderTop
        ref={containerTop}
        data={data}
        isHomepage={isHomepage}
      />
    ) : (
      <Box ref={containerTop} />
    )}
    <HeaderBot
      logo={data.logo_dark}
      topOffset={containerHeight}
      hotel_code={data.hotel_code}
      isParador={isParador}
      color={color}
      isHomepage={isHomepage}
      slug={data.slug}
    />
  </Box>
</> */
}
