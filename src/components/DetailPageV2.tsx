import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  Link,
  ListItem,
  SimpleGrid,
  Text,
  UnorderedList,
  useOutsideClick,
} from "@chakra-ui/react";
import { toNumber } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { FaRegFilePdf, FaShare } from "react-icons/fa";
import { IoAddOutline, IoChevronBack, IoRemoveOutline } from "react-icons/io5";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { Autoplay, Pagination } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import Section from "../layout/Section";
import {
  convertImgHttps,
  formatRupiah,
  objParserWP,
  objParserWPLv2,
} from "../utils/functions";
import { useLargeQuery } from "../utils/mediaQuery";
import LinkTo from "./LinkTo";
import SharePopup from "./SharePopup";

export default function DetailPageV2({
  headline,
  subHeadline,
  backTo,
  accordionItems,
  button,
  description,
  price,
  title,
  color,
  images,
}: {
  headline: string;
  subHeadline: string | null;
  backTo: { text: string; link: string } | null | undefined;
  button: { text: string; link: any; scroll?: any };
  title: string;
  price: string | null | undefined;
  description: string;
  accordionItems: {
    type: "share" | "download" | "list" | "capacity";
    title: string;
    items: any;
  }[];
  color: string;
  images: Array<any> | null | undefined;
}) {
  const { locale } = useRouter();

  const { isLarge } = useLargeQuery();

  const newTitle = title;

  const [isSharePop, setIsSharePop] = useState(false);

  const shareButtonRef = useRef(null);
  useOutsideClick({
    ref: shareButtonRef,
    handler: () => setIsSharePop(false),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);

  return (
    <Section bg="white" color={color}>
      <Box>
        <Heading
          mb={[6, 4, 2]}
          as="h1"
          fontWeight={400}
          letterSpacing="wider"
          textAlign="center"
        >
          {headline}
        </Heading>
        {isLarge && (
          <Flex
            justify="space-between"
            align="flex-start"
            w="100%"
            mb={10}
            color="blackAlpha.700"
            fontSize="small"
          >
            <Box flex={1}>
              {backTo && (
                <Flex align="center" w="100%">
                  <LinkTo
                    activeColor="var(--chakra-colors-blackAlpha-500)"
                    to={backTo.link}
                  >
                    <Flex align="center" gap={1}>
                      <IoChevronBack />
                      {locale == "id"
                        ? `Kembali ke Halaman ${backTo.text}`
                        : `Back to ${backTo.text} Page`}
                    </Flex>
                  </LinkTo>
                </Flex>
              )}
            </Box>
            <Flex flex={2} w="100%" justify="center">
              {subHeadline && <Text textAlign="center">{subHeadline}</Text>}
            </Flex>
            <Box flex={1}></Box>
          </Flex>
        )}
        <Flex
          direction={{ base: "column-reverse", lg: "row" }}
          h="100%"
          w="100%"
          gap={10}
        >
          <Box
            flex={6}
            w={["full", null, null, "33%"]}
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
            {price && toNumber(price) > 0 && (
              <Text mb={2}>
                {locale == "id" ? "Harga mulai" : "Start from"}{" "}
                <strong>{formatRupiah(price)}</strong>
              </Text>
            )}
            <Text mb={3}>{description}</Text>
            {/* {dates && (
              <Flex align="center" gap={2}>
                <IoCalendarClearOutline />
                <Text>
                  <span>Available: </span>
                  {getAvailDate(dates)}
                </Text>
              </Flex>
            )} */}

            <Box my={10}>
              <Button
                h="100%"
                variant="dark"
                bg={color}
                borderColor={color}
                _hover={{ bg: "white", color }}
                onClick={() => {
                  button.link(true);
                  if (button.scroll) {
                    window.scrollTo({
                      top: 300,
                      behavior: "smooth",
                    });
                  }
                }}
              >
                {button.text}
              </Button>
            </Box>

            <Accordion defaultIndex={[0, 1, 2, 3, 4]} allowMultiple>
              {accordionItems.map(({ type, items, title }, i) => {
                if (type == "share")
                  return (
                    <AccordionItem
                      key={i}
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
                              {title}
                            </Text>
                          </Flex>
                        </AccordionButton>
                      </h2>

                      {isSharePop && <SharePopup />}

                      <Box pb={6} />
                      {/* <AccordionPanel pb={6}></AccordionPanel> */}
                    </AccordionItem>
                  );
                else if (type == "capacity") {
                  const itemName = objParserWP(items, "item");
                  const itemTotal = objParserWPLv2(items, "total");

                  return (
                    <AccordionItem pt={0} key={i}>
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
                                  {title}
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
                              <SimpleGrid columns={3} rowGap={3}>
                                {itemName.map((v, i) => (
                                  <Flex key={i} flexDir="column">
                                    <Text>{v}</Text>
                                    <Text fontSize="xs">
                                      <span
                                        style={{
                                          fontSize:
                                            "var(--chakra-fontSizes-xl)",
                                        }}
                                      >
                                        {itemTotal[i]}
                                      </span>
                                      {locale == "id" ? ` Kursi` : ` Seats`}
                                    </Text>
                                  </Flex>
                                ))}
                              </SimpleGrid>
                            </UnorderedList>
                          </AccordionPanel>
                        </>
                      )}
                    </AccordionItem>
                  );
                } else if (type == "download") {
                  return (
                    <AccordionItem key={i}>
                      <h2>
                        <AccordionButton>
                          <Flex flex="1" align="center" gap={2}>
                            <FaRegFilePdf />
                            <Text pl={0.5} fontWeight={600}>
                              {title}
                            </Text>
                          </Flex>
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={6}>
                        <Flex flexDir="column" gap={4} ml={`1.6rem`}>
                          {items.map(({ name, item }: any, i: any) => {
                            if (item)
                              return (
                                <Link
                                  isExternal
                                  href={`http://docs.google.com/viewerng/viewer?url=${item.url}`}
                                  key={i}
                                >
                                  {name}
                                </Link>
                              );
                          })}
                        </Flex>
                      </AccordionPanel>
                    </AccordionItem>
                  );
                } else if (type == "list") {
                  const newItems = objParserWP(items, "item");
                  return (
                    <AccordionItem pt={0} key={i}>
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
                                  {title}
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
                              {newItems.map((v) => (
                                <ListItem pl={2} ml={1} key={v}>
                                  {v}
                                </ListItem>
                              ))}
                            </UnorderedList>
                          </AccordionPanel>
                        </>
                      )}
                    </AccordionItem>
                  );
                }
              })}
            </Accordion>

            {/* <Accordion defaultIndex={[0, 1, 2]} allowMultiple>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Flex flex="1" align="center" gap={2}>
                      <IoReturnUpForward />
                      <Text pl={0.5} fontWeight={600}>
                        Share
                      </Text>
                    </Flex>
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={6}></AccordionPanel>
              </AccordionItem>
              <AccordionItem pt={0}>
                <h2>
                  <AccordionButton>
                    <Flex flex="1" align="center" gap={2}>
                      <IoRemoveOutline />
                      <Text pl={0.5} fontWeight={600}>
                        Benefits
                      </Text>
                    </Flex>
                  </AccordionButton>
                </h2>
                <AccordionPanel py={6}>
                  <UnorderedList display="flex" flexDir="column" gap={4}>
                    {newBenefits.map((v) => (
                      <ListItem pl={2} ml={1} key={v}>
                        {v}
                      </ListItem>
                    ))}
                  </UnorderedList>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem pt={0}>
                <h2>
                  <AccordionButton>
                    <Flex flex="1" align="center" gap={2}>
                      <IoRemoveOutline />
                      <Text pl={0.5} fontWeight={600}>
                        Terms & Conditions
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
            </Accordion> */}
          </Box>

          <Box
            flex={12}
            w={["full", null, null, "66%"]}
            h={["50vh", null, null, "100vh"]}
            position="relative"
            className="section-swiper-v2"
          >
            {images && images.length > 0 ? (
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
                      h={["50vh", null, null, "100%"]}
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

            {isModalOpen && images && images.length > 0 && (
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
          </Box>
        </Flex>
      </Box>
    </Section>
  );
}
