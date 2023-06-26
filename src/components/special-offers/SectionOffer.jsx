import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Select,
  SimpleGrid,
  Text,
  useOutsideClick,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { IoChevronDown, IoGridOutline, IoListOutline } from "react-icons/io5";
import Section from "../../layout/Section";

export default function SectionOffer({
  isGroupOffer,
  limit = 3,
  isMainPage = false,
  hotel = "parador",
  color = "black",
  isParador = true,
  hotelCode,
}) {
  const router = useRouter();

  const [selectedCat, setSelectedCat] = useState(null);

  const params = isParador
    ? {
        _limit: limit ? limit : 0,
        cct_status: "publish",
        is_group_offer: isGroupOffer,
        is_private: "false",
      }
    : {
        _limit: limit ? limit : 0,
        cct_status: "publish",
        hotel_name: hotel,
        is_group_offer: isGroupOffer,
        is_private: "false",
      };

  const [offersData, isLoading, isError] = useFetchSWRv2(`special_offers`, {
    ...params,
    ...(selectedCat && selectedCat != "selected" && { category: selectedCat }),
    ...(selectedCat == "selected" && { _limit: 0 }),
  });

  const [data, setData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    async function f() {
      setDataLoading(true);
      if (await offersData) {
        const rawData = filter(offersData, function (o) {
          return o.is_private != "true";
        });

        if (isParador) {
          setData(rawData);
        } else {
          const temp = filter(rawData, function (o) {
            return o.hotel_name != "Parador";
          });

          setData(temp);
        }
      }
      setDataLoading(false);
    }

    f();
  }, [isParador, offersData, selectedCat]);

  useEffect(() => {
    !isGroupOffer && setSelectedCat("selected");
  }, []);

  useEffect(() => {
    async function f() {
      setDataLoading(true);

      if (await offersData) {
        if (selectedCat == "selected") {
          let temp = filter(offersData, function (o) {
            return o.is_selected == "true";
          });

          let temp2 = temp.concat(offersData);
          temp2 = [...new Set([...temp, ...offersData])];

          setData(limit ? temp2.slice(0, limit) : temp2);
        }
      }

      setDataLoading(false);
    }

    f();
  }, [isGroupOffer, offersData, selectedCat]);

  const { isLarge } = useLargeQuery();

  useEffect(() => {
    data && setViewAs(data.length > 2 || !isLarge ? "grid" : "list");
  }, [data, isLarge]);

  const [viewAs, setViewAs] = useState(null);

  return (
    <Section variant="flat" bg="white" overflowX="hidden">
      <Flex justify="space-between" gap={3} align="center">
        <Heading
          mb={2}
          as="h1"
          fontWeight={400}
          letterSpacing="wider"
          color={color}
          fontSize={["xl", "2xl", "2xl", "3xl"]}
          // whiteSpace={["unset", null, null, "nowrap"]}
          whiteSpace={"nowrap"}
        >
          {isGroupOffer
            ? router.locale == "id"
              ? `Penawaran Grup`
              : `Group Offers`
            : router.locale == "id"
            ? `Penawaran Hotel`
            : `Hotel Offers`}
        </Heading>
        <Flex align="center" color="blackAlpha.600" gap={4}>
          <Box
            onClick={() => setViewAs("list")}
            cursor="pointer"
            display={["none", null, null, "block"]}
          >
            <IoListOutline
              color={viewAs === "list" ? color : `inherit`}
              size={28}
            />
          </Box>
          <Box
            onClick={() => setViewAs("grid")}
            cursor="pointer"
            display={["none", null, null, "block"]}
          >
            <IoGridOutline
              color={viewAs === "grid" ? color : `inherit`}
              size={22}
            />
          </Box>
          <Center h="20px" display={["none", null, null, "block"]}>
            <Divider
              borderColor="blackAlpha.500"
              opacity={1}
              orientation="vertical"
            />
          </Center>
          <Select
            fontSize="sm"
            border="none"
            _focus={{}}
            value={selectedCat ?? "all"}
            onChange={(e) => {
              setSelectedCat(e.target.value == "all" ? null : e.target.value);
            }}
          >
            <option value="all">
              {router.locale == "id" ? "TERBARU" : "LATEST"}
            </option>
            <option value="foods">
              {router.locale == "id"
                ? "MAKANAN & MINUMAN"
                : "FOODS & BEVERAGES"}
            </option>
            <option value="partnership">
              {router.locale == "id" ? "KEMITRAAN" : "PARTNERSHIP"}
            </option>
            <option value="room">
              {router.locale == "id" ? "KAMAR" : "ROOMS"}
            </option>
            {!isGroupOffer && (
              <option value="selected">
                {router.locale == "id" ? "PILIHAN" : "SELECTED"}
              </option>
            )}
          </Select>
        </Flex>
      </Flex>

      {isLoading || dataLoading || !viewAs ? (
        <LoadingSpinner />
      ) : data && data.length > 0 ? (
        <>
          {viewAs === "grid" && (
            <SimpleGrid columns={[1, 1, 2, 2, 3]} spacing={[12, 10, 8]}>
              {data ? (
                data.map(
                  (
                    {
                      thumb,
                      title,
                      title_id,
                      desc_short,
                      desc_short_id,
                      start_from,
                      hotel_name,
                      hotel_names,
                      _ID,
                      rate,
                      promo,
                      connect_to_synxis,
                      promo_url,
                      coupon,
                      dest,
                      arrive,
                      depart,
                    },
                    i
                  ) => (
                    <OfferCardGrid
                      key={i}
                      img={thumb}
                      title={router.locale == "id" ? title_id ?? title : title}
                      desc={router.locale == "id" ? desc_short_id : desc_short}
                      hotel={isGroupOffer ? hotel_names : hotel_name}
                      price={start_from}
                      isGroupOffer={isGroupOffer}
                      id={_ID}
                      color={color}
                      isParador={isParador}
                      hotelCode={hotelCode}
                      rate={rate}
                      promo={promo}
                      connect_to_synxis={connect_to_synxis}
                      promo_url={promo_url}
                      coupon={coupon}
                      dest={dest}
                      arrive={arrive}
                      depart={depart}
                    />
                  )
                )
              ) : (
                <ItemNotFound />
              )}
            </SimpleGrid>
          )}

          {viewAs === "list" && (
            <Flex direction="column" gap={[6, 12]}>
              {data &&
                !isError &&
                !isLoading &&
                data.map(
                  (
                    {
                      thumb,
                      title,
                      title_id,
                      desc_short,
                      desc_short_id,
                      start_from,
                      hotel_name,
                      _ID,
                      rate,
                      promo,
                      hotel_names,
                      connect_to_synxis,
                      promo_url,
                      coupon,
                      dest,
                      arrive,
                      depart,
                    },
                    i
                  ) => (
                    <OfferCardList
                      key={i}
                      img={thumb}
                      title={router.locale == "id" ? title_id ?? title : title}
                      desc={router.locale == "id" ? desc_short_id : desc_short}
                      hotel={isGroupOffer ? hotel_names : hotel_name}
                      price={start_from}
                      isGroupOffer={isGroupOffer}
                      id={_ID}
                      color={color}
                      isParador={isParador}
                      hotelCode={hotelCode}
                      rate={rate}
                      promo={promo}
                      connect_to_synxis={connect_to_synxis}
                      promo_url={promo_url}
                      coupon={coupon}
                      dest={dest}
                      arrive={arrive}
                      depart={depart}
                    />
                  )
                )}
            </Flex>
          )}
        </>
      ) : (
        <ItemNotFound />
      )}
      {!isMainPage && (
        <Center mt={10}>
          <Button
            variant="dark"
            size="md"
            onClick={() => {
              router.push(
                `/special-offers/${isGroupOffer ? `group` : `hotels`}`
              );
            }}
          >
            {router.locale == "id" ? "Lebih Banyak" : "Load More"}
          </Button>
        </Center>
      )}
    </Section>
  );
}

import { filter } from "lodash";
import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import { formatRupiah } from "../../utils/functions";
import { useFetchSWRv2, useGetListHotel } from "../../utils/hooks";
import { useLargeQuery } from "../../utils/mediaQuery";
import DetailGroupPopup from "../DetailGroupPopup";
import ItemNotFound from "../ItemNotFound";
import LoadingSpinner from "../LoadingSpinner";

function OfferCardGrid({
  img,
  title,
  price,
  desc,
  hotel,
  isGroupOffer,
  id,
  color,
  isParador,
  hotelCode,
  rate,
  promo,
  connect_to_synxis,
  promo_url,
  coupon,
  dest,
  arrive,
  depart,
}) {
  const router = useRouter();
  const [isGroupPop, setIsGroupPop] = useState(false);
  const { hotels } = useGetListHotel();
  const optionRef = useRef(null);

  useOutsideClick({
    ref: optionRef,
    handler: () => setShowOptions(false),
  });

  const [showOptions, setShowOptions] = useState(false);
  const [hotelCode2, setHotelCode2] = useState();

  useEffect(() => {
    if (isGroupOffer || !isParador || !hotels) return;

    const tempHotel = filter(hotels, function (o) {
      return o.name == hotel;
    });

    setHotelCode2(tempHotel[0].hotel_code);
  }, [hotels]);

  return (
    <>
      <Flex
        direction="column"
        w="100%"
        justify="space-between"
        gap={4}
        letterSpacing="wide"
      >
        <Flex direction="column" gap={4} color="blackAlpha.700">
          <Box h={["30vh", null, null, "42vh"]} w="100%" position="relative">
            <Image layout="fill" alt="" src={img} objectFit="cover" />
          </Box>
          <Heading
            as="h2"
            fontWeight={400}
            fontSize="xl"
            letterSpacing={4}
            color="black"
            mt={3}
            className="max-text-1-line"
          >
            {title}
          </Heading>
          <Box>
            {!isGroupOffer && isParador && (
              <Text fontSize="sm" textTransform="capitalize">
                {hotel}
              </Text>
            )}
            {price > 0 && (
              <Text fontSize="sm">
                {router.locale == "id" ? "Harga mulai " : "Start from "}
                <strong>{formatRupiah(price)}</strong>
              </Text>
            )}
          </Box>
          <Text fontSize="sm" letterSpacing={0.2} lineHeight={1.2}>
            {desc}
          </Text>
        </Flex>
        <Flex gap={4}>
          {price > 0 && (
            <Box ref={optionRef} position="relative">
              <Button
                variant="dark"
                bg={color}
                borderColor={color}
                _hover={{
                  border: `1px solid ${color}`,
                  color: color,
                  bg: "white",
                }}
                onClick={() => {
                  isGroupOffer
                    ? setShowOptions(!showOptions)
                    : connect_to_synxis == "false"
                    ? window.open(promo_url, `_blank`)
                    : window.open(
                        `https://be.synxis.com/?chain=28800&hotel=${
                          hotelCode ?? hotelCode2
                        }&level=hotel&locale=id-ID&rate=${rate ?? ""}&promo=${
                          promo ?? ""
                        }&coupon=${coupon ?? ""}&dest=${dest ?? ""}&arrive=${
                          arrive ?? ""
                        }&depart=${depart ?? ""}&adult=2`,
                        `_blank`
                      );
                }}
              >
                {router.locale == "id" ? "Pesan" : "Book Now"}
                {isGroupOffer && (
                  <IoChevronDown style={{ marginLeft: 4 }} size={14} />
                )}
              </Button>
              {hotels && isGroupOffer && showOptions && (
                <Flex
                  position="absolute"
                  left={0}
                  top={12}
                  flexDir="column"
                  bg="white"
                  className="header-box-shadows"
                  gap={2}
                  p={3}
                  overflowY="scroll"
                  maxH={200}
                  zIndex={5}
                  w="max-content"
                >
                  {hotel
                    ? hotel.map((name) => {
                        const tempHotel = filter(hotels, function (o) {
                          return o.name == name;
                        });
                        return (
                          <Fragment key={name}>
                            <span
                              style={{
                                cursor: "pointer",
                                width: "100%",
                                wordBreak: "keep-all",
                              }}
                              onClick={() => {
                                setShowOptions(false);
                                connect_to_synxis == "false"
                                  ? window.open(promo_url, `_blank`)
                                  : window.open(
                                      `https://be.synxis.com/?chain=28800&hotel=${
                                        tempHotel[0]?.hotel_code
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
                              {name}
                            </span>
                            <Flex w="full">
                              <Divider orientation="horizontal" />
                            </Flex>
                          </Fragment>
                        );
                      })
                    : hotels.map((hotel) => {
                        const tempHotel = JSON.stringify(hotel);
                        return (
                          <Fragment key={hotel.name}>
                            <span
                              style={{
                                cursor: "pointer",
                                width: "100%",
                                wordBreak: "keep-all",
                              }}
                              onClick={() => {
                                setShowOptions(false);
                                connect_to_synxis == "false"
                                  ? window.open(promo_url, `_blank`)
                                  : window.open(
                                      `https://be.synxis.com/?chain=28800&hotel=${
                                        hotel.hotel_code
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
                              {hotel.name}
                            </span>
                            <Flex>
                              <Divider orientation="horizontal" />
                            </Flex>
                          </Fragment>
                        );
                      })}
                </Flex>
              )}
            </Box>
          )}
          <Button
            variant="outlineWhite"
            color={color}
            _hover={{ bg: color, color: "white" }}
            borderColor={color}
            onClick={() => {
              isGroupOffer
                ? (connect_to_synxis == "false" && promo_url != "") ? router.push(promo_url) : setIsGroupPop(true)
                : router.push(`/special-offers/${id}`);
            }}
          >
            {router.locale == "id" ? "Lebih Lengkap" : "See More"}
          </Button>
        </Flex>
      </Flex>
      {isGroupPop && (
        <DetailGroupPopup
          hotelName={hotel}
          color={color}
          id={id}
          isGroupOffer={isGroupOffer}
          hotelCode={isGroupOffer}
          setIsGroupPop={(isGroupPop) => setIsGroupPop(isGroupPop)}
        />
      )}
    </>
  );
}

function OfferCardList({
  img,
  title,
  price,
  desc,
  hotel,
  isGroupOffer,
  id,
  color,
  isParador,
  hotelCode,
  rate,
  promo,
  connect_to_synxis,
  promo_url,
  coupon,
  dest,
  arrive,
  depart,
}) {
  const router = useRouter();
  const [isGroupPop, setIsGroupPop] = useState(false);

  const { hotels } = useGetListHotel();

  const optionRef = useRef(null);

  useOutsideClick({
    ref: optionRef,
    handler: () => setShowOptions(false),
  });

  const [showOptions, setShowOptions] = useState(false);
  const [hotelCode2, setHotelCode2] = useState();

  useEffect(() => {
    if (isGroupOffer || !isParador || !hotels) return;

    const tempHotel = filter(hotels, function (o) {
      return o.name == hotel;
    });

    setHotelCode2(tempHotel[0].hotel_code);
  }, [hotels]);

  return (
    <>
      <Flex h="100%" w="100%" gap={8} letterSpacing="wide">
        <Flex h="60vh" w="60%" position="relative">
          <Image layout="fill" alt="" src={img} objectFit="cover" />
        </Flex>
        <Flex w="40%" alignItems="center">
          <Flex direction="column" gap={4} color="blackAlpha.700">
            <Heading
              as="h2"
              fontWeight={400}
              fontSize="xl"
              letterSpacing={4}
              color="black"
              mt={3}
            >
              {title}
            </Heading>
            <Box>
              {!isGroupOffer && isParador && (
                <Text fontSize="sm" textTransform="capitalize">
                  {hotel}
                </Text>
              )}
              {price > 0 && (
                <Text fontSize="sm">
                  {router.locale == "id" ? "Harga mulai " : "Start from "}
                  <strong>{formatRupiah(price)}</strong>
                </Text>
              )}
            </Box>
            <Text fontSize="sm" letterSpacing={0.2} lineHeight={1.2}>
              {desc}
            </Text>
            <Flex gap={4} mt={4}>
              {price > 0 && (
                <Box ref={optionRef} position="relative">
                  <Button
                    variant="dark"
                    bg={color}
                    borderColor={color}
                    onClick={() => {
                      isGroupOffer
                        ? setShowOptions(!showOptions)
                        : connect_to_synxis == "false"
                        ? window.open(promo_url, `_blank`)
                        : window.open(
                            `https://be.synxis.com/?chain=28800&hotel=${
                              hotelCode ?? hotelCode2
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
                    {router.locale == "id" ? "Pesan" : "Book Now"}
                    {isGroupOffer && (
                      <IoChevronDown style={{ marginLeft: 4 }} size={14} />
                    )}
                  </Button>
                  {hotels && isGroupOffer && showOptions && (
                    <Flex
                      position="absolute"
                      left={0}
                      top={12}
                      flexDir="column"
                      bg="white"
                      className="header-box-shadows"
                      gap={2}
                      p={3}
                      overflowY="scroll"
                      maxH={200}
                      zIndex={5}
                    >
                      {hotel
                        ? hotel.map((name) => {
                            const tempHotel = filter(hotels, function (o) {
                              return o.name == name;
                            });
                            return (
                              <Fragment key={name}>
                                <Text
                                  as="span"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setShowOptions(false);
                                    connect_to_synxis == "false"
                                      ? window.open(promo_url, `_blank`)
                                      : window.open(
                                          `https://be.synxis.com/?chain=28800&hotel=${
                                            tempHotel[0]?.hotel_code
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
                                  {name}
                                </Text>
                                <Flex>
                                  <Divider orientation="horizontal" />
                                </Flex>
                              </Fragment>
                            );
                          })
                        : hotels.map((hotel) => {
                            const tempHotel = JSON.stringify(hotel);
                            return (
                              <Fragment key={hotel.name}>
                                <Text
                                  as="span"
                                  value={tempHotel}
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setShowOptions(false);
                                    connect_to_synxis == "false"
                                      ? window.open(promo_url, `_blank`)
                                      : window.open(
                                          `https://be.synxis.com/?chain=28800&hotel=${
                                            hotel.hotel_code
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
                                  {hotel.name}
                                </Text>
                                <Flex>
                                  <Divider orientation="horizontal" />
                                </Flex>
                              </Fragment>
                            );
                          })}
                    </Flex>
                  )}
                </Box>
              )}
              <Button
                variant="outlineWhite"
                color={color}
                _hover={{ bg: color, color: "white" }}
                borderColor={color}
                onClick={() => {
                  isGroupOffer
                    ? (connect_to_synxis == "false" && promo_url != "") ? router.push(promo_url) : setIsGroupPop(true)
                    : router.push(`/special-offers/${id}`);
                }}
              >
                {router.locale == "id" ? "Lebih Lengkap" : "See More"}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      {isGroupPop && (
        <DetailGroupPopup
          hotelName={hotel}
          color={color}
          id={id}
          isGroupOffer={isGroupOffer}
          hotelCode={isGroupOffer}
          setIsGroupPop={(isGroupPop) => setIsGroupPop(isGroupPop)}
        />
      )}
    </>
  );
}
