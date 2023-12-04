import {
  AbsoluteCenter,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  ListItem,
  Spinner,
  Text,
  UnorderedList,
  useOutsideClick,
} from "@chakra-ui/react";
import { Markup } from "interweave";
import { filter } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import { IoChevronDown, IoClose } from "react-icons/io5";
import { monthEn, monthId } from "../utils/const";
import {
  formatRupiah,
  getAvailDate,
  objParserWP,
  timeConvertion,
} from "../utils/functions";
import { useFetchSWRv2, useGetListHotel } from "../utils/hooks";

export default function DetailGroupPopup({
  id,
  setIsGroupPop,
  isGroupOffer = true,
  hotelName,
  color = "black",
}: any) {
  const router = useRouter();

  const [data, isLoading] = useFetchSWRv2(`special_offers`, {
    _ID: id,
    cct_status: "publish",
  });
  const { hotels } = useGetListHotel();

  const optionRef = useRef(null);
  const popRef = useRef(null);

  const [showOptions, setShowOptions] = useState(false);
  const [hotelCode, setHotelCode] = useState<number | null>();

  useEffect(() => {
    if (hotels && !isGroupOffer) {
      const x = hotels.filter(function filterHotel(hotel: any) {
        if (hotel.name == hotelName) {
          return true;
        }
        return false;
      });

      setHotelCode(x[0].hotel_code);
    }
  }, [hotels]);

  useOutsideClick({
    ref: optionRef,
    handler: () => setShowOptions(false),
  });

  useOutsideClick({
    ref: popRef,
    handler: () => setIsGroupPop(false),
  });

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      zIndex={5}
      bg="blackAlpha.600"
      h="100vh"
      w="100vw"
    >
      <AbsoluteCenter
        ref={popRef}
        w={["90vw", "70vw", "75vw"]}
        h={["min(100%, 75vh)"]}
        overflowY="hidden"
        bg="white"
        borderRadius={0}
        zIndex={6}
      >
        {isLoading ? (
          <Center w="100%" h="100%" gap={10}>
            <Spinner color="black" size="xl" />
          </Center>
        ) : (
          <Center
            w="100%"
            h="100%"
            gap={10}
            position="relative"
            p={10}
            flexDir={{ base: "column", lg: "row" }}
            overflowY="scroll"
          >
            <Box
              position="absolute"
              right={0}
              top={-10}
              color="white"
              cursor="pointer"
              onClick={() => setIsGroupPop(false)}
            >
              <IoClose size={32} />
            </Box>
            <Flex
              w={{ base: "full", lg: "35%" }}
              h="full"
              flexDir="column"
              gap={5}
              color="blackAlpha.700"
              fontSize="sm"
              my={[6, null, null, 0]}
            >
              <Box>
                <Heading
                  fontSize="2xl"
                  letterSpacing="widest"
                  fontWeight={400}
                  mb={2}
                >
                  {data[0].title}
                </Heading>
                {data[0].start_from > 0 && (
                  <Text mb={2}>
                    {router.locale == "id" ? "Harga mulai" : "Start from"}{" "}
                    {data[0].start_from && (
                      <strong>{formatRupiah(data[0].start_from)}</strong>
                    )}
                  </Text>
                )}
              </Box>
              <Box>
                <Markup
                  className="white-space-enter"
                  content={
                    router.locale == "id"
                      ? data[0].desc_long_id.replace(/\\n/g, `<br>`) ?? ""
                      : data[0].desc_long.replace(/\\n/g, `<br>`) ?? ""
                  }
                />
              </Box>
              {/* <Text>
                {router.locale == "id"
                  ? data[0].desc_long_id
                  : data[0].desc_long}
              </Text> */}
              <Box>
                <Text fontWeight={500}>
                  {router.locale == "id" ? "Keuntungan" : "Benefits"}
                </Text>
                <UnorderedList display="flex" flexDir="column" gap={0}>
                  {router.locale == "id"
                    ? objParserWP(data[0].benefits_id, "benefit").map((v) => (
                        <ListItem pl={2} ml={1} key={v}>
                          {v}
                        </ListItem>
                      ))
                    : objParserWP(data[0].benefits, "benefit").map((v) => (
                        <ListItem pl={2} ml={1} key={v}>
                          {v}
                        </ListItem>
                      ))}
                </UnorderedList>
              </Box>
              <Flex align="center" gap={2}>
                <Box>
                  <Text>
                    {router.locale == "id" ? "Tersedia: " : "Available: "}
                  </Text>
                  {data[0].date_start && data[0].date_end ? (
                    <Text>
                      {getAvailDate(
                        [data[0].date_start, data[0].date_end].map((x) =>
                          timeConvertion({
                            UNIX_timestamp: x,
                            months: router.locale == "id" ? monthId : monthEn,
                          })
                        )
                      )}
                    </Text>
                  ) : (
                    <Text>-</Text>
                  )}
                </Box>
              </Flex>

              <Flex gap={4} pb={6}>
                {data[0].start_from > 0 && (
                  <Box position="relative">
                    <Button
                      variant="dark"
                      bg={color}
                      mb={[6, 6, 8, 10]}
                      onClick={() => {
                        isGroupOffer
                          ? setShowOptions(!showOptions)
                          : data[0].connect_to_synxis == "false"
                          ? window.open(data[0].promo_url, `_blank`)
                          : window.open(
                              `https://be.synxis.com/?chain=28800&hotel=${hotelCode}&level=hotel&locale=id-ID&rate=${
                                data[0].rate ?? ""
                              }&promo=${data[0].promo ?? ""}&coupon=${
                                data[0].coupon ?? ""
                              }&dest=${data[0].dest ?? ""}&arrive=${
                                data[0].arrive ?? ""
                              }&depart=${data[0].depart ?? ""}&adult=2`,
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
                        ref={optionRef}
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
                      >
                        {data[0].hotel_names
                          ? data[0].hotel_names.map((name: any) => {
                              const tempHotel = filter(
                                hotels,
                                function (o: any) {
                                  return o.name == name;
                                }
                              );
                              return (
                                <Fragment key={name}>
                                  <Text
                                    as="span"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      setShowOptions(false);
                                      data[0].connect_to_synxis == "false"
                                        ? window.open(
                                            data[0].promo_url,
                                            `_blank`
                                          )
                                        : window.open(
                                            `https://be.synxis.com/?chain=28800&hotel=${
                                              tempHotel[0]?.hotel_code
                                            }&level=hotel&locale=id-ID&rate=${
                                              data[0].rate ?? ""
                                            }&promo=${
                                              data[0].promo ?? ""
                                            }&coupon=${
                                              data[0].coupon ?? ""
                                            }&dest=${
                                              data[0].dest ?? ""
                                            }&arrive=${
                                              data[0].arrive ?? ""
                                            }&depart=${
                                              data[0].depart ?? ""
                                            }&adult=2`,
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
                          : hotels.map((hotel: any) => {
                              const tempHotel = JSON.stringify(hotel);
                              return (
                                <Fragment key={hotel.name}>
                                  <Text
                                    as="span"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      setShowOptions(false);
                                      data[0].connect_to_synxis == "false"
                                        ? window.open(
                                            data[0].promo_url,
                                            `_blank`
                                          )
                                        : window.open(
                                            `https://be.synxis.com/?chain=28800&hotel=${
                                              hotel.hotel_code
                                            }&level=hotel&locale=id-ID&rate=${
                                              data[0].rate ?? ""
                                            }&promo=${
                                              data[0].promo ?? ""
                                            }&coupon=${
                                              data[0].coupon ?? ""
                                            }&dest=${
                                              data[0].dest ?? ""
                                            }&arrive=${
                                              data[0].arrive ?? ""
                                            }&depart=${
                                              data[0].depart ?? ""
                                            }&adult=2`,
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
                  borderColor={color}
                  onClick={() => router.push(`/special-offers/${id}`)}
                >
                  {router.locale == "id" ? "Detail" : "Details"}
                </Button>
              </Flex>
            </Flex>
            <Box
              w={{ base: "full", lg: "65%" }}
              h={{ base: "500px", lg: "full" }}
              position="relative"
            >
              <Image
                src={data[0].thumb}
                alt=""
                layout="fill"
                objectFit="cover"
              />
            </Box>
          </Center>
        )}
      </AbsoluteCenter>
    </Box>
  );
}
