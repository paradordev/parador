import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  ListItem,
  Select,
  Text,
  UnorderedList,
  useOutsideClick,
} from "@chakra-ui/react";
import { Markup } from "interweave";
import { filter, random } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { FaShare } from "react-icons/fa";
import {
  IoAddOutline,
  IoCalendarClearOutline,
  IoChevronBack,
  IoChevronDown,
  IoRemoveOutline,
} from "react-icons/io5";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { Autoplay, Pagination } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import Section from "../layout/Section";
import { monthEn, monthId } from "../utils/const";
import {
  convertImgHttps,
  formatRupiah,
  getAvailDate,
  objParserWP,
  timeConvertion,
} from "../utils/functions";
import { useGetListHotel } from "../utils/hooks";
import LinkTo from "./LinkTo";
import SharePopup from "./SharePopup";

export default function DetailPage({
  isParador = false,
  isHomepage = true,
  hotelName = "",
  hotelCode = "",
  hotelLoc = "",
  variant = "smooth",
  color = "black",
  headline,
  subHeadline,
  images = [],
  title,
  price,
  desc,
  date = [],
  benefits,
  tac,
  promo = "",
  rate = "",
  coupon = "",
  dest = "",
  arrive = "",
  depart = "",
  connectToSynxis,
  promoUrl = "#",
  backTo = "/special-offers",
}) {
  const router = useRouter();

  const { hotels } = useGetListHotel();

  const dates = date
    ? date.map((x) =>
        timeConvertion({
          UNIX_timestamp: x,
          months: router.locale == "id" ? monthId : monthEn,
        })
      )
    : null;

  const newBenefits = objParserWP(benefits, "benefit");
  const newTac = objParserWP(tac, "tac");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);

  const [isSharePop, setIsSharePop] = useState(false);

  const shareButtonRef = useRef(null);
  useOutsideClick({
    ref: shareButtonRef,
    handler: () => setIsSharePop(false),
  });

  const [selectedHotel, setSelectedHotel] = useState("");

  return (
    <>
      <Section variant={variant} bg="white" color={color}>
        <Box>
          <Heading
            mb={[5, null, null, 2]}
            as="h1"
            fontWeight={400}
            letterSpacing="wider"
            textAlign="center"
          >
            {headline}
          </Heading>
          <Flex
            justify="space-between"
            align="center"
            w="100%"
            mb={10}
            color="blackAlpha.700"
            fontSize="small"
            display={["none", null, null, "flex"]}
          >
            <Box flex={1}>
              <Flex align="center" w="100%">
                <LinkTo
                  activeColor="var(--chakra-colors-blackAlpha-500)"
                  onClick={() => router.back()}
                  // to={backTo}
                >
                  <Flex align="center" gap={1}>
                    <IoChevronBack />
                    {router.locale == "id"
                      ? `Kembali ke halaman Penawaran Spesial`
                      : `Back to Special Offers page`}
                  </Flex>
                </LinkTo>
              </Flex>
            </Box>
            <Flex flex={1} w="100%" justify="center">
              <Text>{subHeadline}</Text>
            </Flex>
            <Box flex={1}></Box>
          </Flex>
          <Flex
            direction={{ base: "column-reverse", lg: "row" }}
            h="100%"
            w="100%"
            gap={10}
          >
            <Box
              w={["full", null, null, "35%"]}
              fontSize="sm"
              color="blackAlpha.900"
            >
              <Heading
                fontSize="3xl"
                letterSpacing="widest"
                fontWeight={400}
                mb={2}
              >
                {title}
              </Heading>
              {!isParador && (
                <Text textTransform="capitalize">{hotelName}</Text>
              )}
              {price && price > 0 && (
                <Text mb={2}>
                  {router.locale == "id" ? "Harga mulai" : "Start from"}{" "}
                  <strong>{formatRupiah(price)}</strong>
                </Text>
              )}
              {/* <Text mb={3} whiteSpace="pre-line">
                {desc}
              </Text> */}
              <Box mb={3}>
                <Markup
                  className="white-space-enter"
                  content={desc.replace(/\\n/g, `<br>`) ?? ""}
                />
              </Box>
              {dates && (
                <Flex align="center" gap={2}>
                  <IoCalendarClearOutline />
                  <Text>
                    <span>
                      {router.locale == "id" ? "Tersedia: " : "Available: "}
                    </span>
                    {getAvailDate(dates)}
                  </Text>
                </Flex>
              )}

              <Box my={10}>
                {hotels && price > 0 && (
                  <Flex
                    h="100%"
                    w="100%"
                    align="center"
                    border={
                      isParador
                        ? `1px solid var(--chakra-colors-gray-700)`
                        : `none`
                    }
                  >
                    {isParador && (
                      <Select
                        h="100%"
                        border={0}
                        _focus={{}}
                        icon={<IoChevronDown opacity={0.5} size="10px" />}
                        placeholder="SELECT"
                        fontSize="sm"
                        onChange={(e) => {
                          setSelectedHotel(e.target.value);
                        }}
                        value={selectedHotel}
                      >
                        {hotelName
                          ? hotelName.map((name) => {
                              const tempHotel = filter(hotels, function (o) {
                                return o.name == name;
                              });
                              return (
                                <option
                                  key={name + random(1000)}
                                  value={tempHotel[0]?.hotel_code}
                                >
                                  {name}
                                </option>
                              );
                            })
                          : hotels.map(({ name, hotel_code }) => (
                              <option
                                key={name + random(1000)}
                                value={hotel_code}
                              >
                                {name}
                              </option>
                            ))}
                      </Select>
                    )}
                    <Button
                      h="100%"
                      variant="dark"
                      bg={color}
                      borderColor={color}
                      _hover={{
                        border: `1px solid ${color}`,
                        color: color,
                        bg: "white",
                      }}
                      onClick={() => {
                        connectToSynxis == "false"
                          ? window.open(promoUrl, `_blank`)
                          : window.open(
                              `https://be.synxis.com/?chain=28800&hotel=${
                                isParador ? selectedHotel : hotelCode
                              }&level=hotel&locale=id-ID&rate=${rate}&promo=${promo}&coupon=${coupon}&dest=${dest}&arrive=${arrive}&depart=${depart}&adult=2`,
                              `_blank`
                            );
                      }}
                    >
                      {router.locale == "id" ? "Pesan" : "Book Now"}
                    </Button>
                  </Flex>
                )}
              </Box>

              <Accordion defaultIndex={[0, 1, 2]} allowMultiple>
                <AccordionItem
                  position="relative"
                  _focus={{}}
                  ref={shareButtonRef}
                >
                  <h2>
                    <AccordionButton
                      _focus={{}}
                      onClick={() => {
                        setIsSharePop(!isSharePop);
                      }}
                    >
                      <Flex flex="1" align="center" gap={2}>
                        <FaShare />
                        <Text pl={0.5} fontWeight={600}>
                          {router.locale == "id" ? "Bagikan" : "Share"}
                        </Text>
                      </Flex>
                    </AccordionButton>
                  </h2>
                  {isSharePop && <SharePopup />}
                  <Box pb={6} />
                </AccordionItem>

                {newBenefits && newBenefits.length > 0 && (
                  <AccordionItem pt={0}>
                    {({ isExpanded }) => (
                      <>
                        <h2>
                          <AccordionButton>
                            <Flex flex="1" align="center" gap={2}>
                              {!isExpanded ? (
                                <IoAddOutline />
                              ) : (
                                <IoRemoveOutline />
                              )}
                              <Text pl={0.5} fontWeight={600}>
                                {router.locale == "id"
                                  ? "Keuntungan"
                                  : "Benefits"}
                              </Text>
                            </Flex>
                          </AccordionButton>
                        </h2>
                        <AccordionPanel py={6}>
                          <UnorderedList
                            display="flex"
                            flexDir="column"
                            gap={4}
                          >
                            {newBenefits.map((v) => (
                              <ListItem pl={2} ml={1} key={v}>
                                {v}
                              </ListItem>
                            ))}
                          </UnorderedList>
                        </AccordionPanel>
                      </>
                    )}
                  </AccordionItem>
                )}

                {newTac && newTac.length > 0 && (
                  <AccordionItem pt={0}>
                    {({ isExpanded }) => (
                      <>
                        <h2>
                          <AccordionButton>
                            <Flex flex="1" align="center" gap={2}>
                              {!isExpanded ? (
                                <IoAddOutline />
                              ) : (
                                <IoRemoveOutline />
                              )}
                              <Text pl={0.5} fontWeight={600}>
                                {router.locale == "id"
                                  ? "Syarat & Ketentuan"
                                  : "Terms & Conditions"}
                              </Text>
                            </Flex>
                          </AccordionButton>
                        </h2>
                        <AccordionPanel py={6}>
                          <UnorderedList
                            display="flex"
                            flexDir="column"
                            gap={4}
                          >
                            {newTac.map((v) => (
                              <ListItem pl={2} ml={1} key={v}>
                                {v}
                              </ListItem>
                            ))}
                          </UnorderedList>
                        </AccordionPanel>
                      </>
                    )}
                  </AccordionItem>
                )}
              </Accordion>
            </Box>
            <Box
              w={["full", null, null, "65%"]}
              h={["40vh", null, null, "100vh"]}
              position="relative"
              className="section-swiper-v2"
            >
              {
                <Swiper
                  centeredSlides={true}
                  loop={images.length > 1}
                  pagination={{
                    clickable: true,
                  }}
                  autoplay={{
                    delay: 8000,
                    pauseOnMouseEnter: true,
                    disableOnInteraction: true,
                  }}
                  modules={images.length > 1 ? [Autoplay, Pagination] : []}
                >
                  {images.map(({ url, id }, i) => (
                    <SwiperSlide key={id}>
                      <Box
                        w="100%"
                        h="100%"
                        position="relative"
                        cursor="pointer"
                        onClick={() => {
                          setIsModalOpen(true);
                          setPhotoIdx(i);
                        }}
                      >
                        <Image
                          alt={``}
                          src={convertImgHttps(url)}
                          layout="fill"
                          objectFit="contain"
                          objectPosition="top"
                        />
                      </Box>
                    </SwiperSlide>
                  ))}
                </Swiper>
              }
            </Box>
          </Flex>
        </Box>
      </Section>
      {isModalOpen && images.length > 0 && (
        <Lightbox
          mainSrc={images[photoIdx].url}
          nextSrc={images[(photoIdx + 1) % images.length]}
          prevSrc={images[(photoIdx + images.length - 1) % images.length]}
          onCloseRequest={() => setIsModalOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIdx((photoIdx + images.length - 1) % images.length)
          }
          onMoveNextRequest={() => setPhotoIdx((photoIdx + 1) % images.length)}
        />
      )}
    </>
  );
}
