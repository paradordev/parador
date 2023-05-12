import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { capitalize, isEmpty, isString } from "lodash";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";

import Image from "next/image";
import "react-image-lightbox/style.css";
import { Autoplay, Pagination } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import FlipBook from "../../components/FlipBook";
import HeroV2 from "../../components/HeroV2";
import SectionDetailInfo from "../../components/SectionDetailInfo";
import SectionGallery from "../../components/SectionGallery";
import Helmet from "../../containers/Helmet";
import FooterHotel from "../../layout/FooterHotel";
import HeaderV3 from "../../layout/HeaderV3";
import { getHotelBrands, getHotelDetail, getWPDining } from "../../utils/api";
import { convertImgHttps, objParserWP, strParser } from "../../utils/functions";
import {
  safeMarginDesc,
  safeMarginX,
  safeMarginY,
  useLargeQuery,
} from "../../utils/mediaQuery";
import { IHeader, IHero } from "../../utils/types";

const afterProp = {
  bottom: -1,
  content: `""`,
  display: "block",
  height: "1px",
  left: "50%",
  position: "absolute",
  background: "white",
  transition: "all 0.3s ease 0s, left 0.3s ease 0s",
  width: 0,
};

const hoverProp = {
  _after: { width: "100%", left: 0 },
};

export default function DiningId({
  header,
  hotelBrands,
  dining,
  hero,
}: {
  header: IHeader;
  hotelBrands: any;
  dining: any;
  hero: IHero;
}) {
  const router = useRouter();

  const { isLarge } = useLargeQuery();

  const [headerHeight, setHeaderHeight] = useState(0);

  const { color_primary, slug, id, location, phone, logo_light } = header;
  const {
    headline,
    subheadline,
    name,
    hotel_name,
    showcase,
    id_showcase,
    id_subheadline,
    en_subheadline,
    operational_hours,
    operational_hours_id,
  } = dining;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);

  const [brochures, setBrochures] = useState<any>([]);

  useEffect(() => {
    setBrochures(Object.values(objParserWP(dining.menu)[0]));
  }, [router.isReady]);

  const [numPages, setNumPages] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
  }

  const [showSecondHeader, setShowSecondHeader] = useState(false);

  const [navPosition, setNavPosition] = useState("");

  const aboutRef = useRef<any>(null);
  const galleryRef = useRef<any>(null);
  const sectionRef = useRef<any>(null);

  const [heights, setHeights] = useState<any>([]);

  useEffect(() => {
    if (!(aboutRef || galleryRef || sectionRef)) return;

    let temp = [];

    temp[0] = aboutRef.current?.clientHeight;
    temp[1] = sectionRef.current?.clientHeight;
    temp[2] = sectionRef.current?.clientHeight;
    temp[3] = sectionRef.current?.clientHeight;
    temp[4] = galleryRef.current?.clientHeight;

    setHeights(temp);
  }, [aboutRef, galleryRef, sectionRef]);

  const [scrolling, setScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    if (!(heights.length > 0)) return;

    function onScroll() {
      let currentPosition = window.pageYOffset; // or use document.documentElement.scrollTop;

      let screenH = window.innerHeight - 150;

      if (currentPosition < screenH) {
        setNavPosition("");
      } else if (
        currentPosition >= screenH &&
        currentPosition < screenH + heights[0]
      ) {
        setNavPosition("about");
      } else if (
        currentPosition >= screenH + heights[0] &&
        currentPosition < screenH + heights[0] + heights[1]
      ) {
        setNavPosition("eat");
      } else if (
        currentPosition >= screenH + heights[0] + heights[1] &&
        currentPosition < screenH + heights[0] + heights[1] * 2
      ) {
        setNavPosition("drink");
      } else if (
        currentPosition >= screenH + heights[0] + heights[1] * 2 &&
        currentPosition < screenH + heights[0] + heights[1] * 3
      ) {
        setNavPosition("promotion");
      } else if (
        currentPosition >= galleryRef.current?.offsetTop - 150 &&
        currentPosition < galleryRef.current?.offsetTop + heights[4] - 150
      ) {
        setNavPosition("gallery");
      } else {
        setNavPosition("");
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollTop, heights]);

  return (
    <>
      <Helmet
        title={`${capitalize(name)} - Dining | ${capitalize(
          hotel_name
        )} | Parador Hotels & Resorts`}
      />
      <HeaderV3
        headerItem={header}
        isHomepage={true}
        hotelBrands={hotelBrands}
        isDining={true}
        getHeight={(headerHeight: any) => setHeaderHeight(headerHeight)}
      />

      {isLarge && (
        <Flex
          h="64px"
          position="fixed"
          bg={header.color_primary}
          top="60px"
          w="100%"
          zIndex={100}
          transition={"all 0.3s"}
          className="header-box-shadows"
          px={safeMarginX}
          justify="space-between"
          align="center"
          fontSize="small"
          fontWeight={500}
          textTransform="uppercase"
          color="white"
        >
          <Box flex={1}></Box>
          <Flex flex={5} gap={16} justify="center">
            <Text
              opacity={navPosition == "about" ? 1 : 0.5}
              cursor="pointer"
              position="relative"
              _after={afterProp}
              _hover={hoverProp}
              onClick={() => {
                window.scrollTo({
                  top: aboutRef.current?.offsetTop - 120,
                  behavior: "smooth",
                });
              }}
            >
              {router.locale == "id" ? "Tentang" : "About"}
            </Text>
            <Text
              opacity={navPosition == "eat" ? 1 : 0.5}
              cursor="pointer"
              position="relative"
              _after={afterProp}
              _hover={hoverProp}
              onClick={() => {
                window.scrollTo({
                  top: aboutRef.current?.offsetTop - 80 + heights[0],
                  behavior: "smooth",
                });
              }}
            >
              {router.locale == "id" ? "Restoran" : "Eat"}
            </Text>
            <Text
              opacity={navPosition == "drink" ? 1 : 0.5}
              cursor="pointer"
              position="relative"
              _after={afterProp}
              _hover={hoverProp}
              onClick={() => {
                window.scrollTo({
                  top: aboutRef.current?.offsetTop + heights[0] + heights[1],

                  behavior: "smooth",
                });
              }}
            >
              {router.locale == "id" ? "Minum" : "Drink"}
            </Text>
            <Text
              opacity={navPosition == "promotion" ? 1 : 0.5}
              cursor="pointer"
              position="relative"
              _after={afterProp}
              _hover={hoverProp}
              onClick={() => {
                window.scrollTo({
                  top:
                    aboutRef.current?.offsetTop +
                    60 +
                    heights[0] +
                    heights[1] * 2,

                  behavior: "smooth",
                });
              }}
            >
              {router.locale == "id" ? "Promosi" : "Promotion"}
            </Text>
            {/* <Text opacity={.5}>{router.locale == "id" ? "Chef" : "Chefs"}</Text> */}
            <Text
              opacity={navPosition == "gallery" ? 1 : 0.5}
              cursor="pointer"
              position="relative"
              _after={afterProp}
              _hover={hoverProp}
              onClick={() => {
                window.scrollTo({
                  top: galleryRef.current?.offsetTop - 80,
                  behavior: "smooth",
                });
              }}
            >
              {router.locale == "id" ? "Galeri" : "Gallery"}
            </Text>
          </Flex>
          <Flex flex={1} justify="flex-end">
            <Button
              variant="solid"
              bg="white"
              color={header.color_primary}
              onClick={() => {
                router.push(
                  `/${slug}/dining/reservation?selected=${router.query.dining_id}`
                );
              }}
            >
              {router.locale == "id" ? "RESERVASI MEJA" : "RESERVE"}
            </Button>
          </Flex>
        </Flex>
      )}

      <HeroV2
        hasFormNow={true}
        heroItem={hero}
        height={`calc(100vh - ${headerHeight}px)`}
      />

      <Center p={safeMarginDesc} flexDirection="column" gap={10} ref={aboutRef}>
        <Heading
          as="h1"
          fontWeight={400}
          letterSpacing="widest"
          color={color_primary}
          textAlign="center"
        >
          {name}
        </Heading>
        <Text maxW={{ base: "90%", md: "50%" }} align="center">
          {router.locale == "id" ? id_subheadline : en_subheadline}
        </Text>
      </Center>

      <Flex px={safeMarginX} py={safeMarginDesc} flexDir="column" gap={16}>
        {objParserWP(router.locale == "id" ? id_showcase : showcase).map(
          ({ title, desc, gallery }, i) => {
            return (
              <Flex
                ref={sectionRef}
                key={i}
                flexDir={[`column`, null, i % 2 === 0 ? `row` : `row-reverse`]}
                gap={12}
                position="relative"
              >
                <Box
                  w={["100%", null, "65%"]}
                  h={["50vh", null, "70vh"]}
                  bg={`${color_primary}40`}
                  position="relative"
                  className="section-swiper-v2"
                >
                  <Swiper
                    centeredSlides={true}
                    loop={
                      (isString(gallery) ? strParser(gallery) : gallery)
                        .length > 1
                    }
                    pagination={{
                      clickable: true,
                    }}
                    autoplay={{
                      delay: 8000,
                      pauseOnMouseEnter: true,
                      disableOnInteraction: true,
                    }}
                    modules={
                      (isString(gallery) ? strParser(gallery) : gallery)
                        .length > 1
                        ? [Autoplay, Pagination]
                        : []
                    }
                  >
                    {(isString(gallery) ? strParser(gallery) : gallery).map(
                      ({ url, id }: any) => (
                        <SwiperSlide key={id}>
                          <Box w="100%" h="100%" position="relative">
                            <Image
                              alt={``}
                              src={convertImgHttps(url)}
                              layout="fill"
                              objectFit="cover"
                            />
                          </Box>
                        </SwiperSlide>
                      )
                    )}
                  </Swiper>
                </Box>
                <Center
                  w={["100%", null, "35%"]}
                  flexDir="column"
                  alignItems="center"
                  textAlign="center"
                  gap={6}
                >
                  <Heading
                    as="h2"
                    maxW="70%"
                    fontWeight={500}
                    letterSpacing="wider"
                    fontSize="2xl"
                  >
                    {title}
                  </Heading>
                  <Text
                    fontSize={{ base: "sm", xl: "md" }}
                    maxW={["70%", "100%"]}
                  >
                    {desc.replace(/\\/g, "")}
                  </Text>
                  {i === 0 && (
                    <Fragment>
                      <Button
                        bg="white"
                        border={`1.5px solid ${color_primary}`}
                        color={color_primary}
                        // px={16}
                        _hover={{ bg: color_primary, color: "white" }}
                        w={260}
                        py={4}
                        fontWeight={500}
                        onClick={() => {
                          setIsModalOpen(true);
                          setPhotoIdx(0);
                        }}
                      >
                        {router.locale == "id"
                          ? "menu all day"
                          : "ALL DAY MENU"}
                      </Button>
                      <Button
                        bg="white"
                        border={`1.5px solid ${color_primary}`}
                        color={color_primary}
                        // px={16}
                        _hover={{ bg: color_primary, color: "white" }}
                        w={260}
                        py={4}
                        fontWeight={500}
                        onClick={() => {
                          isEmpty(dining.external_delivery_url)
                            ? router.push(
                                `/${slug}/dining/food-delivery?selected=${router.query.dining_id}`
                              )
                            : window.open(
                                dining.external_delivery_url,
                                `_blank`
                              );
                        }}
                      >
                        {router.locale == "id"
                          ? "Pesan Antar"
                          : "delivery order"}
                      </Button>
                      <Button
                        bg="white"
                        border={`1.5px solid ${color_primary}`}
                        color={color_primary}
                        // px={16}
                        _hover={{ bg: color_primary, color: "white" }}
                        w={260}
                        py={4}
                        fontWeight={500}
                        onClick={() => {
                          router.push(
                            `/${slug}/dining/reservation?selected=${router.query.dining_id}`
                          );
                        }}
                      >
                        {router.locale == "id"
                          ? "RESERVASI MEJA"
                          : "Book a Table"}
                      </Button>
                    </Fragment>
                  )}
                  {i === 1 && (
                    <Button
                      bg="white"
                      border={`1.5px solid ${color_primary}`}
                      color={color_primary}
                      // px={16}
                      _hover={{ bg: color_primary, color: "white" }}
                      w={260}
                      py={4}
                      fontWeight={500}
                      onClick={() => {
                        setIsModalOpen(true);
                        setPhotoIdx(1);
                      }}
                    >
                      {router.locale == "id" ? "menu minuman" : "Drink menu"}
                    </Button>
                  )}
                  {i === 2 && (
                    <Button
                      bg="white"
                      border={`1.5px solid ${color_primary}`}
                      color={color_primary}
                      // px={16}
                      _hover={{ bg: color_primary, color: "white" }}
                      w={260}
                      py={4}
                      fontWeight={500}
                      onClick={() => {
                        setIsModalOpen(true);
                        setPhotoIdx(3);
                      }}
                    >
                      {router.locale == "id" ? "Promosi" : "Promotion"}
                    </Button>
                  )}
                </Center>
              </Flex>
            );
          }
        )}
      </Flex>

      {isModalOpen && brochures.length > 0 && (
        <FlipBook
          link={brochures[photoIdx]}
          isModalOpen={(
            isModalOpen: boolean | ((prevState: boolean) => boolean)
          ) => setIsModalOpen(isModalOpen)}
        />
      )}

      <Flex px={safeMarginX}>
        <Divider orientation="horizontal" borderColor="blackAlpha.400" />
      </Flex>

      <Box ref={galleryRef}>
        <SectionGallery
          color={color_primary}
          id={router.query.dining_id}
          limit={null}
          slug={slug}
          type="dining"
        />
      </Box>

      <Flex px={safeMarginX}>
        <Divider orientation="horizontal" borderColor="blackAlpha.400" />
      </Flex>

      <SectionDetailInfo
        color={color_primary}
        location={location}
        phone={phone}
        hours={router.locale == "id" ? operational_hours_id : operational_hours}
      />

      <Center mb={safeMarginY}>
        <Button
          px={8}
          py={5}
          bg={color_primary}
          color="white"
          borderColor={color_primary}
          variant="dark"
          _hover={{ color: color_primary, bg: "white" }}
          onClick={() => router.push(`/${slug}/dining`)}
        >
          {router.locale == "id"
            ? "Kembali ke hotel restoran"
            : "Back to dining hotel"}
        </Button>
      </Center>

      <FooterHotel
        instagram={header.instagram}
        facebook={header.facebook}
        locationLink={header.location_url}
        location={header.location_long}
        email={header.email}
        phone={header.phone}
        bg={color_primary}
        color="white"
        logo={logo_light}
      />
    </>
  );
}

function ColoredButton({
  type = "outline",
  children,
  color = "black",
  onClick,
}: any) {
  return (
    <Button
      bg={type === "outline" ? "white" : color}
      border={`1.5px solid ${color}`}
      color={type === "outline" ? color : "white"}
      // px={16}
      _hover={{ bg: color, color: "white" }}
      w={260}
      py={4}
      fontWeight={500}
    >
      {children}
    </Button>
  );
}

export async function getStaticProps({ params, locale }: any) {
  const res: any = await getWPDining({
    _ID: params.dining_id,
    cct_status: "publish",
  });
  const dining: any = await res.data[0];

  const data: any = await getHotelDetail({
    name: await dining.hotel_name,
    cct_status: "publish",
  }).then((r) => r.data[0]);

  let temp = await data;
  let temp2 = await dining;

  if (locale == "id") {
    let x = JSON.stringify(data);
    let y = x.replace(/_id/g, "");
    temp = JSON.parse(y);

    let x2 = JSON.stringify(dining);
    let y2 = x2.replace(/id_/g, "");
    temp2 = JSON.parse(y2);
  } else {
    let x = JSON.stringify(data);
    let y = x.replace(/_en/g, "");
    temp = JSON.parse(y);

    let x2 = JSON.stringify(dining);
    let y2 = x2.replace(/en_/g, "");
    temp2 = JSON.parse(y2);
  }

  const {
    _ID,
    name,
    location_short,
    location_url,
    hotel_location,
    phone,
    logo_dark,
    logo_light,
    color_primary,
    color_secondary,
    is_parador,
    slug,
    hotel_code,
    location_short_en,
    has_dining,
    has_wedding,
    has_meeting_events,
    location_long,
    location_long_en,
    email,
  } = temp;

  const { headline, subheadline, slider, operational_hours } = temp2;

  const header: IHeader = {
    email: email,
    instagram: temp.instagram,
    facebook: temp.facebook,
    location_long: location_long ? location_long : location_long_en,
    id: _ID,
    name,
    color_primary,
    color_secondary,
    location: location_short ? location_short : location_short_en,
    location_url,
    hotel_location,
    phone,
    logo_dark,
    logo_light,
    is_parador: is_parador === "true",
    hotel_code: hotel_code == 0 ? null : hotel_code,
    slug,
    has_dining,
    has_wedding,
    has_meeting_events,
  };

  const hero: IHero = {
    id: _ID,
    banner: headline,
    sub_banner: subheadline,
    color_primary,
    name,
    hotel_code,
    slider: slider,
    is_parador: is_parador === "true",
  };

  const hotelBrands = await getHotelBrands();

  return {
    props: { dining, header, hotelBrands, hero },
    revalidate: parseInt(process.env.NEXT_PUBLIC_REVALIDATE_TIME ?? "200", 10), // In seconds
  };
}

export async function getStaticPaths({ locales }: any) {
  const res = await getWPDining({ cct_status: "publish" });
  const dining = await res.data;

  const paths = dining.map(function (d: any) {
    return { params: { dining_id: d._ID, cct_status: "publish" } };
  });
  return { paths, fallback: "blocking" };
}
