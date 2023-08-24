import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  // Image,
  Select,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { find, random } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { Autoplay, Pagination } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import Section from "../layout/Section";
import { getSpecialOffer } from "../utils/api";
import { capEachWord, convertImgHttps, formatRupiah } from "../utils/functions";
import { useFetchSWRv2, useGetListHotel } from "../utils/hooks";
import { safeMarginX, safeMarginY, useLargeQuery } from "../utils/mediaQuery";

export default function SectionSpecialOffer({
  isParador = false,
  isHomepage = true,
  hotelName,
  hotelLoc,
  variant = "smooth",
  color = "black",
  limit = 5,
  slug = "",
  hotelCode,
  hotel,
}) {
  const router = useRouter();

  const params = isParador
    ? { _limit: limit, cct_status: "publish", is_group_offer: true }
    : { _limit: limit, cct_status: "publish", hotel_name: hotelName };

  const [offersData, isLoading, isError] = useFetchSWRv2(
    `special_offers`,
    params
  );

  const [isAllLoading, setIsAllLoading] = useState(true);

  const [data, setData] = useState(null);

  useEffect(() => {
    if (offersData) {
      if (isParador) {
        setData(offersData);
      } else {
        getSpecialOffer({
          _limit: limit,
          cct_status: "publish",
          is_private: "false",
          hotel_name: hotel,
          is_group_offer: false,
          is_selected: "true"
        }).then((res) => {
          setData(res.data);
        });
      }
    }
  }, [offersData]);

  const { hotels } = useGetListHotel();
  const { is2XLarge, isXLarge } = useLargeQuery();
  // const bulletsRef = useRef(null);

  const [selectedHotel, setSelectedHotel] = useState();

  const [selectedPlaceholder, setSelectedPlaceholder] = useState();
  const [selectedPlaceholder2, setSelectedPlaceholder2] = useState();

  const [defaultSelected, setDefaultSelected] = useState([]);
  useEffect(() => {
    if (!data || !hotels) return;

    const temp = data.map(({ hotel_name, hotel_names }, i) => {
      return find(hotels, function (o) {
        return o.name == hotel_names ? hotel_names[0] : hotel_name;
      });
    });

    setDefaultSelected(temp);
  }, [data, hotels]);

  useEffect(() => {
    if (!isLoading && data !== null) {
      setIsAllLoading(false);
    }
  }, [isLoading, data]);

  return (
    <Section
      className="section-special-offers"
      variant="zero"
      bg="white"
      color={color}
      py={safeMarginY}
    >
      <Box>
        <Heading
          mb={2}
          as="h1"
          fontWeight={400}
          letterSpacing="wider"
          px={safeMarginX}
        >
          {router.locale == "id"
            ? `Promo Spesial`
            : isParador
            ? `Special Offers`
            : `Hotel Offers`}
        </Heading>
        <Text mb={8} color="blackAlpha.800" px={safeMarginX}>
          {isParador
            ? router.locale == "id"
              ? `Dapatkan penawaran eksklusif untuk menikmati pengalaman menginap di seluruh hotel kami di Indonesia.`
              : `Get the exclusive promotions to experience our hotels all across Indonesia.`
            : `${
                router.locale == "id"
                  ? `Dapatkan penawaran eksklusif dari`
                  : `Exciting offers and promotions from`
              } ${capEachWord(hotelName)} ${capEachWord(hotelLoc)}.`}
        </Text>
        {isLoading || isAllLoading ? (
          <Center h="60vh">
            <Spinner size="xl" />
          </Center>
        ) : (
          <Swiper
            speed={1000}
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
            {data &&
              !isError &&
              !isLoading &&
              data.map(
                (
                  {
                    thumb,
                    slug,
                    title,
                    title_id,
                    desc_short,
                    desc_short_id,
                    start_from,
                    rate,
                    promo,
                    hotel_names,
                    connect_to_synxis,
                    promo_url,
                    is_private,
                    coupon,
                    dest,
                    arrive,
                    depart,
                  },
                  i
                ) => {
                  if (is_private === true || is_private === "true") return null;
                  return (
                    <SwiperSlide key={i}>
                      <Flex direction="column" color="black">
                        <Box
                          h={["30vh", "50vh", "75vh"]}
                          w="100%"
                          position="relative"
                        >
                          <Image
                            layout="fill"
                            objectFit="cover"
                            src={convertImgHttps(thumb)}
                            alt={slug}
                          />
                        </Box>
                        <Grid
                          px={safeMarginX}
                          templateRows={{
                            base: "repeat(3, minmax(min-content))",
                            lg: "repeat(4, minmax(min-content))",
                          }}
                          templateColumns={{
                            base: "1fr",
                            lg: "10% 40% 40% 10%",
                            xl: "15% 35% 35% 15%",
                            "2xl": "repeat(4, 1fr)",
                          }}
                          rowGap={2}
                          mt={12}
                        >
                          {isXLarge && <GridItem rowSpan={1} colSpan={1} />}
                          <GridItem rowSpan={1} colSpan={1}>
                            <Heading
                              as="h2"
                              size="lg"
                              fontWeight={400}
                              letterSpacing="wide"
                            >
                              {router.locale == "id"
                                ? title_id ?? title
                                : title}
                            </Heading>
                          </GridItem>
                          <GridItem rowSpan={1} colSpan={1}>
                            <Text
                              color="gray.700"
                              textAlign={isXLarge && `justify`}
                              className="max-text-5-line"
                            >
                              {router.locale == "id"
                                ? desc_short_id
                                : desc_short}
                            </Text>
                          </GridItem>
                          {isXLarge && <GridItem rowSpan={1} colSpan={1} />}
                          {isXLarge && <GridItem rowSpan={1} colSpan={1} />}
                          <GridItem rowSpan={1} colSpan={1}>
                            {start_from > 0 && (
                              <Text
                                textTransform="capitalize"
                                color="gray.700"
                                mt={!isXLarge && 2}
                              >
                                {router.locale == "id"
                                  ? `Harga mulai`
                                  : `Start from`}{" "}
                                <strong>{formatRupiah(start_from)}</strong>
                              </Text>
                            )}
                          </GridItem>
                          {isXLarge && <GridItem rowSpan={1} colSpan={1} />}
                          {isXLarge && <GridItem rowSpan={1} colSpan={1} />}
                          {isXLarge && <GridItem rowSpan={1} colSpan={1} />}
                          <GridItem
                            rowSpan={1}
                            colSpan={isXLarge ? 2 : 1}
                            mt={8}
                          >
                            {hotels && (
                              <Flex
                                h="100%"
                                w="100%"
                                align="center"
                                boxSizing="border-box"
                                border={
                                  isParador && start_from > 0
                                    ? `1px solid var(--chakra-colors-gray-700)`
                                    : `none`
                                }
                              >
                                {isParador &&
                                  start_from > 0 &&
                                  (hotel_names ? (
                                    <Select
                                      h="100%"
                                      border={0}
                                      _focus={{}}
                                      icon={
                                        <IoChevronDown
                                          opacity={0.5}
                                          size="10px"
                                        />
                                      }
                                      onChange={(e) => {
                                        setSelectedHotel(
                                          JSON.parse(e.target.value)
                                        );
                                      }}
                                      value={selectedPlaceholder}
                                    >
                                      {hotel_names.map((n) => {
                                        const tempHotel = find(
                                          hotels,
                                          function (o) {
                                            return o.name == n;
                                          }
                                        );
                                        return (
                                          <option
                                            key={n}
                                            value={JSON.stringify(tempHotel)}
                                          >
                                            {n}
                                          </option>
                                        );
                                      })}
                                    </Select>
                                  ) : (
                                    <Select
                                      h="100%"
                                      border={0}
                                      _focus={{}}
                                      icon={
                                        <IoChevronDown
                                          opacity={0.5}
                                          size="10px"
                                        />
                                      }
                                      onChange={(e) => {
                                        const temp = JSON.parse(e.target.value);
                                        setSelectedHotel(temp);
                                      }}
                                      value={JSON.stringify(selectedHotel)}
                                    >
                                      {hotels.map((hotel) => {
                                        const tempHotel = JSON.stringify(hotel);
                                        return (
                                          <option
                                            key={hotel.name + random(1000)}
                                            value={tempHotel}
                                          >
                                            {hotel.name}
                                          </option>
                                        );
                                      })}
                                    </Select>
                                  ))}
                                <Box
                                  w={
                                    isParador && start_from > 0
                                      ? "unset"
                                      : "100%"
                                  }
                                >
                                  <Button
                                    h="100%"
                                    w={
                                      (!isParador || start_from == 0) && `100%`
                                    }
                                    variant="dark"
                                    boxSizing="border-box"
                                    bg={color}
                                    borderColor={color}
                                    _hover={{
                                      opacity: 0.8,
                                    }}
                                    onClick={() => {
                                      connect_to_synxis == "false"
                                        ? window.open(
                                            promo_url,
                                            start_from > 0 ? `_blank` : `_self`
                                          )
                                        : window.open(
                                            `https://be.synxis.com/?chain=28800&hotel=${
                                              isParador
                                                ? selectedHotel
                                                  ? selectedHotel.hotel_code
                                                  : defaultSelected[i]
                                                      .hotel_code
                                                : hotelCode
                                            }&level=hotel&locale=id-ID&rate=${
                                              rate ?? ""
                                            }&promo=${promo ?? ""}&coupon=${
                                              coupon ?? ""
                                            }&dest=${dest ?? ""}&arrive=${
                                              arrive ?? ""
                                            }&depart=${depart ?? ""}&adult=2`,
                                            `_blank`
                                          );
                                    }}
                                  >
                                    {router.locale == "id"
                                      ? "Pesan"
                                      : "Book Now"}
                                  </Button>
                                </Box>
                              </Flex>
                            )}
                          </GridItem>
                          {isXLarge && <GridItem rowSpan={1} colSpan={1} />}
                        </Grid>
                      </Flex>
                    </SwiperSlide>
                  );
                }
              )}
          </Swiper>
        )}
      </Box>
      {isHomepage && (
        <Center mt={4}>
          <Button
            variant="dark"
            _hover={{
              bg: "white",
              color,
              borderColor: color,
              borderWidth: 1,
            }}
            borderColor={color}
            onClick={() =>
              router.push(
                isParador ? "/special-offers" : `/${slug}/hotel-offers`
              )
            }
            bg={color}
          >
            {router.locale == "id" ? `Lebih Banyak` : `See More`}
          </Button>
        </Center>
      )}
    </Section>
  );
}
