import {
    Box,
    Center,
    Divider,
    Flex,
    Heading,
    SimpleGrid,
    Text
} from "@chakra-ui/react";
import { includes, toNumber } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Autoplay, Pagination } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Helmet from "../../../containers/Helmet";
import FooterHotel from "../../../layout/FooterHotel";
import HeaderV3 from "../../../layout/HeaderV3";
import Section from "../../../layout/Section";
import { getHotelDetail } from "../../../utils/api";
import { convertImgHttps, objParserWP } from "../../../utils/functions";
import { useFetchSWRv2 } from "../../../utils/hooks";
import { safeMarginY } from "../../../utils/mediaQuery";
import { IHeader } from "../../../utils/types";

export default function LocalArea({ header }: { header: IHeader }) {
  const { locale, isReady } = useRouter();

  const [item, isLoading] = useFetchSWRv2(`local_area`, {
    hotel_name: header.name,
    cct_status: "publish",
  });

  const [contents, setContents] = useState<any[]>([]);
  const [titles, setTitles] = useState<any[]>([]);

  useEffect(() => {
    if (!item) return;

    // let temp;
    // if (locale == "id") {
    //   let x = JSON.stringify(item[0]);
    //   let y = x.replace(/_id/g, "");
    //   temp = JSON.parse(y);
    // } else {
    //   let x = JSON.stringify(item[0]);
    //   let y = x.replace(/_en/g, "");
    //   temp = JSON.parse(y);
    // }

    let contentTemp: any = [];
    contentTemp = objParserWP(
      locale == "id" ? item[0].contents_id : item[0].contents_en
    );
    contentTemp.map(({ area_category, area_categor }: any) => {
      if (!includes(titles, locale == "id" ? area_categor : area_category)) {
        let y = [...titles];
        y.push(locale == "id" ? area_categor : area_category);
        setTitles([...y]);
      }
    });

    setContents([...contentTemp]);
  }, [item, locale, titles, isReady]);

  useEffect(() => {
    setTitles([]);
  }, [locale]);

  return (
    <>
      <Helmet
        title={`Local Area - ${header.name} | Parador Hotels & Resorts`}
      />
      <HeaderV3
        headerItem={header}
        isHomepage={false}
        hotelBrands={undefined}
      />

      {isLoading || !(contents.length > 0) ? (
        <LoadingSpinner />
      ) : (
        <Section>
          <Box className="section-swiper">
            <Swiper
              centeredSlides={true}
              loop={true}
              pagination={{
                clickable: true,
              }}
              autoplay={{
                delay: 8000,
                pauseOnMouseEnter: true,
                disableOnInteraction: true,
              }}
              modules={[Autoplay, Pagination]}
              className="mySwiper"
            >
              {item[0].gallery.map(({ url, id }: any) => {
                return (
                  <SwiperSlide key={id}>
                    <Flex direction="column" color="black">
                      <Box
                        h={["30vh", "50vh", "75vh"]}
                        w="100%"
                        position="relative"
                      >
                        <Image
                          layout="fill"
                          objectFit="cover"
                          src={convertImgHttps(url)}
                          alt={id}
                        />
                      </Box>
                    </Flex>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Box>
          <Center flexDirection="column" py={safeMarginY}>
            <Text maxW={{ base: "90%", md: "50%" }} align="center">
              {locale == "id" ? item[0].description_id : item[0].description_en}
            </Text>
          </Center>

          {titles.map((title) => {
            if (title)
              return (
                <Flex key={title} flexDir="column" gap={6}>
                  <Flex>
                    <Divider
                      orientation="horizontal"
                      borderColor="blackAlpha.400"
                    />
                  </Flex>

                  <Heading
                    mb={2}
                    as="h2"
                    fontWeight={400}
                    letterSpacing="wider"
                    fontSize="3xl"
                  >
                    {title}
                  </Heading>

                  <SimpleGrid
                    columns={[1, 1, 2, 2, 3]}
                    columnGap={10}
                    rowGap={6}
                  >
                    {contents.map(
                      (
                        {
                          name,
                          distance,
                          description,
                          area_category,
                          area_categor,
                          area_website_link,
                          area_google_maps_link,
                        }: any,
                        i: any
                      ) => {
                        if (area_category == title || area_categor == title)
                          return (
                            <Box key={i} color="blackAlpha.700">
                              <Text
                                fontSize="sm"
                                fontWeight={600}
                                _hover={{
                                  textDecoration: area_google_maps_link
                                    ? `underline`
                                    : `none`,
                                }}
                                cursor={
                                  area_google_maps_link ? "pointer" : "text"
                                }
                                onClick={() => {
                                  area_google_maps_link &&
                                    window.open(
                                      area_google_maps_link,
                                      `_blank`
                                    );
                                }}
                              >
                                {distance}{" "}
                                {locale == "id"
                                  ? "KILOMETER"
                                  : toNumber(distance) > 1
                                  ? "KILOMETERS"
                                  : "KILOMETER"}
                              </Text>
                              <Text
                                fontSize="xl"
                                color="black"
                                _hover={{
                                  textDecoration: area_website_link
                                    ? `underline`
                                    : `none`,
                                }}
                                mb={1}
                                cursor={area_website_link ? "pointer" : "text"}
                                onClick={() => {
                                  area_website_link &&
                                    window.open(area_website_link, `_blank`);
                                }}
                              >
                                {name}
                              </Text>
                              <Text fontSize="sm">{description}</Text>
                            </Box>
                          );
                      }
                    )}
                  </SimpleGrid>
                </Flex>
              );
          })}
        </Section>
      )}

      <Box w={20} />

      <FooterHotel
        instagram={header.instagram}
        facebook={header.facebook}
        locationLink={header.location_url}
        location={header.location_long}
        email={header.email}
        phone={header.phone}
        bg={header.color_primary}
        color="white"
        logo={header.logo_light}
      />
    </>
  );
}

export async function getStaticProps({ locale, params }: any) {
  let temp;

  const data: any = await getHotelDetail({
    slug: params.hid,
    cct_status: "publish",
  }).then((r) => r.data[0]);

  temp = await data;

  if (locale == "id") {
    let x = JSON.stringify(data);
    let y = x.replace(/_id/g, "");
    temp = JSON.parse(y);
  } else {
    let x = JSON.stringify(data);
    let y = x.replace(/_en/g, "");
    temp = JSON.parse(y);
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
    wedding_headline,
    wedding_slider,
    location_short_en,
    wedding_subheadline,
    has_dining,
    has_wedding,
    has_meeting_events,
    location_long,
    location_long_en,
    email,
  } = temp;

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

  return {
    props: {
      header,
    },
    revalidate: parseInt(process.env.NEXT_PUBLIC_REVALIDATE_TIME ?? "200", 10), // In seconds
  };
}

export async function getStaticPaths() {
  const res = await getHotelDetail();
  const hotels = await res.data;

  const paths = hotels
    .filter(function (hotel: any) {
      if (
        hotel.slug == "parador" ||
        !hotel.slug ||
        hotel.cct_status !== "publish"
      ) {
        return false; // skip
      }
      return true;
    })
    .map(function (hotel: any) {
      return { params: { hid: hotel.slug } };
    });

  return { paths, fallback: "blocking" };
}
