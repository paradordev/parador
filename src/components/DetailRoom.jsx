import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Link,
  ListItem,
  SimpleGrid,
  Text,
  UnorderedList,
  useOutsideClick,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import {
  FaBed,
  FaBox,
  FaHandHoldingWater,
  FaLaptop,
  FaRegFilePdf,
  FaRegSnowflake,
  FaRulerCombined,
  FaShare,
  FaTv,
  FaUser,
  FaWifi,
} from "react-icons/fa";
import { IoChevronBack, IoRemoveOutline } from "react-icons/io5";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { Autoplay, Pagination } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import Section from "../layout/Section";
import { convertImgHttps, formatRupiah, objParserWP } from "../utils/functions";
import { useGetListHotel } from "../utils/hooks";
import { safeMarginX, safeMarginY, useLargeQuery } from "../utils/mediaQuery";
import FormBookNowTop from "./FormBookNowTop";
import LinkTo from "./LinkTo";
import SharePopup from "./SharePopup";

export default function DetailRoom({
  variant = "smooth",
  slug = "",
  color = "black",
  headline,
  subHeadline,
  images = [],
  title,
  price,
  desc,
  featured = [],
  benefits,
  tac,
  thumb,
  includes,
  layout,
  brochure,
  hotelCode,
}) {
  const router = useRouter();

  const { isXLarge } = useLargeQuery();
  const { hotels } = useGetListHotel();

  const newTac = objParserWP(tac, "item");
  const newIncudes = objParserWP(includes, "item");

  const [isSharePop, setIsSharePop] = useState(false);

  const shareButtonRef = useRef(null);
  useOutsideClick({
    ref: shareButtonRef,
    handler: () => setIsSharePop(false),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const formBookNowRef = useRef(null);
  useOutsideClick({
    ref: formBookNowRef,
    handler: () => setIsFormOpen(false),
  });

  function benefitSplit(str) {
    if (str.includes("/")) {
      const temp = str.split("/");
      if (router.locale == "id") return temp[1];
      else return temp[0];
    } else {
      return str;
    }
  }

  return (
    <Section
      variant={variant}
      bg="white"
      color={color}
      px={safeMarginX}
      py={safeMarginY}
    >
      <Box>
        <Heading
          mb={2}
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
        >
          <Box flex={[2, null, 1]}>
            <Flex align="center" w="100%">
              <LinkTo
                activeColor="var(--chakra-colors-blackAlpha-500)"
                to={`/${slug}/rooms`}
              >
                <Flex align="center" gap={1} whiteSpace="nowrap">
                  <IoChevronBack />
                  {router.locale == "id"
                    ? `Kembali ke Halaman Kamar`
                    : `Back to Rooms page`}
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
            w={["full", null, null, "40%", null, "33%"]}
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

            <Text color="blackAlpha.700" mb={2}>
              {/* {router.locale == "id" ? `Harga mulai ` : `Start from `} */}
              {<strong>{formatRupiah(price)}</strong>}
            </Text>

            <Text color="blackAlpha.700" my={6}>
              {desc}
            </Text>

            <Flex my={3}>
              <Divider orientation="horizontal" borderColor="blackAlpha.400" />
            </Flex>

            <Flex align="center" color="blackAlpha.800" gap={6} my={3}>
              <Flex align="center" fontSize="small" gap={2}>
                <FaUser color="inherit" size={12} />
                <Text>{featured[0]}</Text>
              </Flex>
              <Flex align="center" fontSize="small" gap={2}>
                <FaBed color="inherit" size={16} />
                <Text>{featured[1]}</Text>
              </Flex>
              <Flex align="center" fontSize="small" gap={2}>
                <FaRulerCombined color="inherit" size={12} />
                <Text>{featured[2]} m²</Text>
              </Flex>
            </Flex>

            <Box position="relative" ref={formBookNowRef}>
              <Button
                variant="dark"
                bg={color}
                mt={3}
                mb={10}
                borderColor={color}
                _hover={{
                  border: `1px solid ${color}`,
                  color: color,
                  bg: "white",
                }}
                onClick={() => {
                  setIsFormOpen(!isFormOpen);
                }}
              >
                {router.locale == "id" ? "Pesan" : "Book Now"}
              </Button>
              {isFormOpen && (
                <Box
                  position="absolute"
                  w={["min(min-content, 360)", null, null, "unset"]}
                  top={[14, null, null, 2]}
                  left={[0, null, null, 32]}
                  ml={[0, 0, 0, 6]}
                  zIndex={99}
                >
                  <FormBookNowTop colorPrimary={color} hotelCode={hotelCode} />
                </Box>
              )}
            </Box>

            <Accordion
              defaultIndex={[0, 1, 2, 3, 4]}
              allowMultiple
              color="blackAlpha.700"
            >
              <AccordionItem
                position="relative"
                _focus={{}}
                ref={shareButtonRef}
              >
                <h2>
                  <AccordionButton
                    pl={[0, null, null, 4]}
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

              <AccordionItem>
                <h2>
                  <AccordionButton pl={[0, null, null, 4]}>
                    <Flex flex="1" align="center" gap={2}>
                      <FaRegFilePdf />
                      <Text pl={0.5} fontWeight={600}>
                        {router.locale == "id" ? "Unduh" : "Downloads"}
                      </Text>
                    </Flex>
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={6}>
                  <Flex flexDir="column" gap={4} ml={`1.6rem`}>
                    {brochure && brochure.url && (
                      <Link
                        href={`http://docs.google.com/viewerng/viewer?url=${brochure.url}`}
                        isExternal
                      >
                        {router.locale == "id" ? "Brosur" : "Brochure"}
                      </Link>
                    )}
                    {layout && layout.url && (
                      <Link
                        href={`http://docs.google.com/viewerng/viewer?url=${layout.url}`}
                        isExternal
                      >
                        {router.locale == "id" ? "Tata Ruang" : "Layout"}
                      </Link>
                    )}
                  </Flex>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem pt={0}>
                <h2>
                  <AccordionButton pl={[0, null, null, 4]}>
                    <Flex flex="1" align="center" gap={2}>
                      <FaUser />
                      <Text pl={0.5} fontWeight={600}>
                        {router.locale == "id" ? "Keuntungan" : "Benefits"}
                      </Text>
                    </Flex>
                  </AccordionButton>
                </h2>
                <AccordionPanel py={6}>
                  <UnorderedList display="flex" flexDir="column" gap={4}>
                    <SimpleGrid columns={3} spacing={10} color="blackAlpha.600">
                      {benefits[0]?.includes("Shower") && (
                        <Flex flexDir="column" align="center" gap={1}>
                          <FaHandHoldingWater size={20} />
                          <Text>{benefitSplit(benefits[0])}</Text>
                        </Flex>
                      )}
                      {benefits[1]?.includes("Desk") && (
                        <Flex flexDir="column" align="center" gap={1}>
                          <FaLaptop size={20} />
                          <Text>{benefitSplit(benefits[1])}</Text>
                        </Flex>
                      )}

                      {benefits[2]?.includes("LED TV") && (
                        <Flex flexDir="column" align="center" gap={1}>
                          <FaTv size={20} />
                          <Text>{benefitSplit(benefits[2])}</Text>
                        </Flex>
                      )}
                      {benefits[3]?.includes("WI-FI") && (
                        <Flex flexDir="column" align="center" gap={1}>
                          <FaWifi size={20} />
                          <Text>{benefitSplit(benefits[3])}</Text>
                        </Flex>
                      )}
                      {benefits[4]?.includes("AC") && (
                        <Flex flexDir="column" align="center" gap={1}>
                          <FaRegSnowflake size={20} />
                          <Text>{benefitSplit(benefits[4])}</Text>
                        </Flex>
                      )}
                      {benefits[5]?.includes("Safety") && (
                        <Flex flexDir="column" align="center" gap={1}>
                          <FaBox size={20} />
                          <Text>{benefitSplit(benefits[5])}</Text>
                        </Flex>
                      )}
                    </SimpleGrid>
                  </UnorderedList>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem pt={0}>
                <h2>
                  <AccordionButton pl={[0, null, null, 4]}>
                    <Flex flex="1" align="center" gap={2}>
                      <IoRemoveOutline />
                      <Text pl={0.5} fontWeight={600}>
                        {router.locale == "id"
                          ? "Sudah Termasuk"
                          : "Stay Includes"}
                      </Text>
                    </Flex>
                  </AccordionButton>
                </h2>
                <AccordionPanel py={6}>
                  <UnorderedList display="flex" flexDir="column" gap={4}>
                    {newIncudes.map((v) => (
                      <ListItem pl={2} ml={1} key={v}>
                        {v}
                      </ListItem>
                    ))}
                  </UnorderedList>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem pt={0}>
                <h2>
                  <AccordionButton pl={[0, null, null, 4]}>
                    <Flex flex="1" align="center" gap={2}>
                      <IoRemoveOutline />
                      <Text pl={0.5} fontWeight={600}>
                        {router.locale == "id"
                          ? "Syarat & Ketentuan"
                          : "Terms & Conditions"}
                      </Text>
                    </Flex>
                  </AccordionButton>
                </h2>
                <AccordionPanel py={6}>
                  <UnorderedList display="flex" flexDir="column" gap={4}>
                    {newTac.map((v) => (
                      <ListItem pl={2} ml={1} key={v}>
                        {v}
                      </ListItem>
                    ))}
                  </UnorderedList>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>

          <Flex
            flexDir="column"
            w={["full", null, null, "60%", null, "66%"]}
            h="100%"
            gap={6}
          >
            <Box
              position="relative"
              w="100%"
              h={["50vh", null, "60vh", "65vh"]}
              className="section-swiper-v2"
            >
              {images.length > 0 ? (
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
                          objectFit="cover"
                        />
                      </Box>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <Box h="100%" w="100%" color={color} opacity={0.2} />
              )}
            </Box>

            {isModalOpen && images.length > 0 && (
              <Lightbox
                mainSrc={images[photoIdx].url}
                nextSrc={images[(photoIdx + 1) % images.length]}
                prevSrc={images[(photoIdx + images.length - 1) % images.length]}
                onCloseRequest={() => setIsModalOpen(false)}
                onMovePrevRequest={() =>
                  setPhotoIdx((photoIdx + images.length - 1) % images.length)
                }
                onMoveNextRequest={() =>
                  setPhotoIdx((photoIdx + 1) % images.length)
                }
              />
            )}

            {isXLarge && (
              <Box position="relative" w="100%" h="65vh">
                {thumb ? (
                  <Image src={thumb} alt="" layout="fill" objectFit="cover" />
                ) : (
                  <Box h="100%" w="100%" color={color} opacity={0.2} />
                )}
              </Box>
            )}
          </Flex>
        </Flex>
      </Box>
    </Section>
  );
}
