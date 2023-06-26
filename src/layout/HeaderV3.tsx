import { SearchIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Input,
  InputGroup,
  Select,
  Slide,
  Spinner,
  Text,
  useMediaQuery,
  useOutsideClick
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  createContext,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from "react";
import { FaGripLines } from "react-icons/fa";
import {
  IoCallOutline,
  IoChevronBackCircleOutline,
  IoChevronDown,
  IoChevronUp,
  IoClose,
  IoGlobeOutline,
  IoLocationOutline,
  IoPerson,
  IoPersonOutline
} from "react-icons/io5";
import FormBookNowTop from "../components/FormBookNowTop";
import InputSelect from "../components/Input/InputSelect";
import LoginSelect from "../components/Input/LoginSelect";
import LinkTo from "../components/LinkTo";
import { convertImgHttps } from "../utils/functions";
import { useNextDining, usePopUpBackground } from "../utils/hooks";

import { safeMarginX, useLargeQuery } from "../utils/mediaQuery";
import { IHeader } from "../utils/types";

export const NavContext = createContext<any>(null);

export default function HeaderV3({
  headerItem,
  isHomepage,
  getHeight,
  hotelBrands,
  isDining = false,
}: {
  headerItem: IHeader;
  isHomepage: boolean;
  getHeight?: any;
  hotelBrands: any;
  isDining?: any;
}) {
  const { route, asPath, push, locales, locale, pathname, query, isReady } =
    useRouter();

  const {
    id,
    name,
    color_primary,
    color_secondary = "white",
    location,
    location_url,
    phone,
    logo_dark,
    logo_light,
    slug,
    hotel_code = 36461,
    is_parador,
    has_dining,
    has_meeting_events,
    has_wedding,
  } = headerItem;

  const { isLarge, is2XLarge } = useLargeQuery();

  const container = useRef(null);
  const headerContainer = useRef<any>(null);

  const [offsetHeader, setOffsetHeader] = useState(false);
  const [offsetBookNow, setOffsetBookNow] = useState(false);

  const [isNavPop, setIsNavPop] = useState(false);
  const [navPosition, setNavPosition] = useState<any>(asPath);
  const [isMobilePop, setIsMobilePop] = useState(false);
  const [showBookNowTop, setShowBookNowTop] = useState(false);
  const [showBookNowTopMobile, setShowBookNowTopMobile] = useState(false);

  useEffect(() => {
    if (!container) return;
    headerClass();
    window.onscroll = function () {
      headerClass();
    };

    if (!getHeight) return;

    if (
      headerContainer &&
      headerContainer.current &&
      headerContainer.current.offsetHeight
    ) {
      getHeight(headerContainer.current.offsetHeight);
    } else {
      getHeight(0);
    }
  }, [isReady]);

  const headerClass = () => {
    if (isDining) {
      if (window.scrollY > 162) {
        setOffsetBookNow(true);
        setOffsetHeader(true);
      } else {
        setOffsetBookNow(false);
        setOffsetHeader(false);
      }
    } else {
      if (window.scrollY > 162) {
        setOffsetHeader(true);
      } else {
        setOffsetHeader(false);
      }
      if (window.scrollY > Math.round(window.innerHeight) * 0.8) {
        setOffsetBookNow(true);
      } else {
        setOffsetBookNow(false);
      }
    }
  };

  function handleBook() {
    setShowBookNowTop(!showBookNowTop);
  }

  function handleActiveColor() {
    if (isHomepage && !offsetHeader) return "white";
    if (is_parador && !isHomepage) return "black";
    return color_primary.toString();
  }

  const { popUpBackground } = usePopUpBackground({
    _ID: id ? id : 1,
  });

  //search
  const [serachValue, setSearchValue] = useState("");
  const handleSearch = (event: any) => {
    if (event.key === "Enter") {
      push(`/search?keyword=${serachValue}`);
    }
  };

  const bookNowTopRef = useRef(null);
  useOutsideClick({
    ref: bookNowTopRef,
    handler: () => setShowBookNowTop(false),
  });

  const bookNowTopMobileRef = useRef(null);
  useOutsideClick({
    ref: bookNowTopMobileRef,
    handler: () => setShowBookNowTopMobile(false),
  });

  if (isNavPop) {
    return (
      <>
        <Box h="143px" bg="black" />
        <Box
          position="fixed"
          top={0}
          h="100vh"
          w="100%"
          bg="black"
          opacity={0.9}
          color="white"
          zIndex={9999}
          transition="all .5s ease-in-out"
          // bgImage={
          //   popUpBackground
          //     ? `linear-gradient(0deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9)), url(${popUpBackground})`
          //     : `linear-gradient(0deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9)))`
          // }
          bgSize="cover"
        >
          <Flex
            zIndex={1000}
            position="relative"
            top={0}
            w="100%"
            justify="space-between"
            align="flex-start"
            px={safeMarginX}
            pt={6}
            fontSize="x-small"
          >
            <Box
              display={{ base: "none", md: "flex" }}
              flex={1}
              justifyContent="flex-start"
              flexDir="column"
              gap={2}
            >
              <Flex alignItems="center" gap={2}>
                <IoLocationOutline />
                <Text>{location}</Text>
              </Flex>
              <Flex alignItems="center" gap={2}>
                <IoCallOutline />
                <Text>{phone}</Text>
              </Flex>
            </Box>
            <Center flex={1}>
              <Box
                position="relative"
                h={{ base: "35px", lg: "55px" }}
                w="100%"
                maxW={{ base: "100px", lg: "160px" }}
              >
                <Image
                  onClick={() => {
                    push(is_parador ? `/` : `/${slug}`);
                  }}
                  style={{ cursor: "pointer" }}
                  src={convertImgHttps(logo_light)}
                  layout="fill"
                  objectFit="contain"
                  alt={`${name} logo`}
                />
              </Box>
            </Center>
            <Box
              flex={1}
              display={{ base: "none", md: "flex" }}
              justifyContent="flex-end"
            >
              <Flex alignItems="center" justifyContent="flex-end" gap={4}>
                <Flex alignItems="center" gap={1}>
                  <Box mr={-1}>
                    <LoginSelect
                      icon={<IoPersonOutline size={16} />}
                      items={[
                        { name: "Individual", value: "en" },
                        { name: "Company", value: "id" },
                      ]}
                      placeHolder={locale == "id" ? "Masuk" : "Log In"}
                    />
                  </Box>
                </Flex>
                <Center height="16px">
                  <Divider
                    borderColor={
                      isHomepage ? `whiteAlpha.700` : `blackAlpha.700`
                    }
                    orientation="vertical"
                  />
                </Center>
                <Box mr={-1}>
                  <InputSelect
                    icon={<IoGlobeOutline size={18} />}
                    items={[
                      { name: "English", value: "en" },
                      { name: "Bahasa", value: "id" },
                    ]}
                    placeHolder={locale == "id" ? "Bahasa" : "English"}
                  />
                </Box>
              </Flex>
            </Box>
          </Flex>
          <HeaderPop
            hotelBrands={hotelBrands}
            hotelCode={hotel_code}
            setNavPop={(isNavPop: SetStateAction<any>) => setIsNavPop(isNavPop)}
            navPosition={navPosition}
            setNavPosition={(navPosition: SetStateAction<string>) =>
              setNavPosition(navPosition)
            }
            slug={is_parador ? `` : slug}
          />
        </Box>
      </>
    );
  }

  if (isMobilePop) {
    return (
      <>
        <Slide direction="left" in={isMobilePop} style={{ zIndex: 9999 }}>
          <Flex
            h="100vh"
            w="full"
            bg={color_primary}
            color={color_secondary ?? `white`}
            // opacity={0.9}
            flexDir="column"
            p={safeMarginX}
            overflow="scroll"
          >
            <Flex justify="space-between" px={4}>
              {is_parador ? (
                <InputGroup display="flex" alignItems="center">
                  <SearchIcon fontSize="2xl" color="inherit" />
                  <Input
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={handleSearch}
                    variant="filled"
                    bg="transparent"
                    color="inherit"
                    type="text"
                    placeholder={locale === "id" ? `CARI` : `SEARCH`}
                    borderRadius={0}
                    _focus={{ borderRadius: 0 }}
                    _hover={{}}
                    mx={2}
                    pl={2}
                  />
                </InputGroup>
              ) : (
                <Box />
              )}
              <Box onClick={() => setIsMobilePop(false)}>
                <IoClose size={40} />
              </Box>
            </Flex>
            <Flex flexDir="column" gap={2} textTransform="uppercase" mt={4}>
              <Accordion
                allowToggle
                _focus={{}}
                allowMultiple={false}
                className="accordion-uppercase mobile-accordion"
              >
                {is_parador && (
                  <AccordionItem _focus={{}} py={2}>
                    <span>
                      <AccordionButton _focus={{}}>
                        <a>{locale === "id" ? `Hotel` : `Hotels`}</a>
                        <AccordionIcon />
                      </AccordionButton>
                    </span>
                    <AccordionPanel pb={4}>
                      <Flex
                        flexWrap="wrap"
                        gap={3}
                        fontSize="sm"
                        flexDir="column"
                        color="whiteAlpha.700"
                      >
                        {hotelMobileList.list.map((item: any, i: any) => {
                          return (
                            <Box key={i}>
                              <LinkTo to={`/${hotelMobileList.target[i]}`}>
                                {item}
                              </LinkTo>
                            </Box>
                          );
                        })}
                      </Flex>
                    </AccordionPanel>
                  </AccordionItem>
                )}
                {!is_parador && (
                  <AccordionItem _focus={{}} py={2}>
                    <AccordionButton
                      _focus={{}}
                      onClick={() => push(`/${slug}/rooms`)}
                    >
                      <a>{locale === "id" ? `Kamar` : `Rooms`}</a>
                    </AccordionButton>
                  </AccordionItem>
                )}
                {is_parador && (
                  <AccordionItem _focus={{}} py={2}>
                    <AccordionButton
                      _focus={{}}
                      onClick={() => push(`/special-offers`)}
                    >
                      <a>
                        {locale === "id" ? `Promo Spesial` : `Special Offers`}
                      </a>
                    </AccordionButton>
                  </AccordionItem>
                )}
                {!is_parador && (
                  <AccordionItem _focus={{}} py={2}>
                    <AccordionButton
                      _focus={{}}
                      onClick={() => push(`/${slug}/hotel-offers`)}
                    >
                      <a>{locale === "id" ? `Promo` : `Offers`}</a>
                    </AccordionButton>
                  </AccordionItem>
                )}

                {is_parador && (
                  <AccordionItem _focus={{}} py={2}>
                    <span>
                      <AccordionButton _focus={{}}>
                        <a> {locale === "id" ? `Restoran` : `Dining`}</a>
                        <AccordionIcon />
                      </AccordionButton>
                    </span>
                    <AccordionPanel pb={4}>
                      <Flex
                        flexWrap="wrap"
                        gap={3}
                        fontSize="sm"
                        flexDir="column"
                        color="whiteAlpha.700"
                      >
                        {diningMobileListV2.map(
                          ({ hotel, dining, slug }: any) => {
                            return (
                              <Fragment key={hotel}>
                                <Box>
                                  <LinkTo to={`/${slug}/dining`}>
                                    {hotel}
                                  </LinkTo>
                                </Box>
                                {dining.map(({ id, name }: any) => {
                                  return (
                                    <Box key={id} ml={4}>
                                      <LinkTo to={`/dining/${id}`}>
                                        {name}
                                      </LinkTo>
                                    </Box>
                                  );
                                })}
                                <Flex w="100%">
                                  <Divider
                                    orientation="horizontal"
                                    opacity={0.2}
                                  />
                                </Flex>
                              </Fragment>
                            );
                          }
                        )}
                      </Flex>
                    </AccordionPanel>
                  </AccordionItem>
                )}

                {!is_parador && has_dining === "true" && (
                  <AccordionItem _focus={{}} py={2}>
                    <AccordionButton
                      _focus={{}}
                      onClick={() => push(`/${slug}/dining`)}
                    >
                      <a> {locale === "id" ? `Restoran` : `Dining`}</a>
                    </AccordionButton>
                  </AccordionItem>
                )}

                {(is_parador || has_meeting_events === "true") && (
                  <AccordionItem _focus={{}} py={2}>
                    <AccordionButton
                      _focus={{}}
                      onClick={() =>
                        push(
                          is_parador
                            ? `/meeting-events`
                            : `/${slug}/meeting-events`
                        )
                      }
                    >
                      <a>
                        {locale === "id" ? `Rapat & Acara` : `Meeting & Events`}
                      </a>
                    </AccordionButton>
                  </AccordionItem>
                )}

                {!is_parador && (
                  <AccordionItem _focus={{}} py={2}>
                    <AccordionButton
                      _focus={{}}
                      onClick={() => push(`/${slug}/facilities`)}
                    >
                      <a>{locale === "id" ? `Fasilitas` : `Facilities`}</a>
                    </AccordionButton>
                  </AccordionItem>
                )}

                {(is_parador || has_wedding === "true") && (
                  <AccordionItem _focus={{}} py={2}>
                    <AccordionButton
                      _focus={{}}
                      onClick={() =>
                        push(is_parador ? `/wedding` : `/${slug}/wedding`)
                      }
                    >
                      <a>{locale === "id" ? `Pernikahan` : `Wedding`}</a>
                    </AccordionButton>
                  </AccordionItem>
                )}

                {is_parador && (
                  <AccordionItem _focus={{}} py={2}>
                    <AccordionButton
                      _focus={{}}
                      onClick={() =>
                        push(is_parador ? `/gallery` : `/${slug}/gallery`)
                      }
                    >
                      <a> {locale === "id" ? `Galeri` : `gallery`}</a>
                    </AccordionButton>
                  </AccordionItem>
                )}

                {is_parador && (
                  <AccordionItem _focus={{}} py={2}>
                    <span>
                      <AccordionButton
                        _focus={{}}
                        onClick={() =>
                          push(
                            locale == "id"
                              ? "https://www.shop.parador-hotels.com/id/"
                              : "https://www.shop.parador-hotels.com/"
                          )
                        }
                      >
                        <a>{locale == "id" ? "Belanja" : "Shop"}</a>
                      </AccordionButton>
                    </span>
                    {/* <AccordionPanel pb={4}>
                      <Flex
                        flexWrap="wrap"
                        gap={3}
                        fontSize="sm"
                        flexDir="column"
                        color="whiteAlpha.700"
                      >
                        <Box>
                          <LinkTo
                            to={
                              locale == "id"
                                ? "https://www.shop.parador-hotels.com/id/"
                                : "https://www.shop.parador-hotels.com/"
                            }
                          >
                            {locale == "id" ? "Belanja" : "Shop"}
                          </LinkTo>
                        </Box>
                        <Box>
                          <LinkTo to="/gift-card">
                            {locale == "id" ? "Kartu Hadiah" : "Gift Card"}
                          </LinkTo>
                        </Box>
                      </Flex>
                    </AccordionPanel> */}
                  </AccordionItem>
                )}

                {!is_parador && (
                  <AccordionItem _focus={{}} py={2}>
                    <AccordionButton
                      _focus={{}}
                      onClick={() => push(`/${slug}/local-area`)}
                    >
                      <a>{locale === "id" ? `Area Lokal` : `Local Area`}</a>
                    </AccordionButton>
                  </AccordionItem>
                )}

                <AccordionItem _focus={{}} py={2}>
                  <AccordionButton
                    _focus={{}}
                    onClick={() =>
                      push(is_parador ? `/contact` : `/${slug}/contact`)
                    }
                  >
                    <a>{locale === "id" ? `Kontak` : `Contact Us`}</a>
                  </AccordionButton>
                </AccordionItem>
              </Accordion>
            </Flex>
          </Flex>
        </Slide>
      </>
    );
  }

  return (
    <Box
      display={"initial"}
      position="relative"
      top={0}
      color={isHomepage ? color_secondary : color_primary}
      ref={headerContainer}
      className={!isHomepage ? `header-box-shadows` : ``}
    >
      {is2XLarge ? (
        <Flex
          bg={isHomepage ? color_primary : `white`}
          color={isHomepage ? `white` : `blackAlpha.900`}
          zIndex={1000}
          position="relative"
          top={0}
          w="100%"
          justify="space-between"
          align="flex-start"
          px={safeMarginX}
          pt={6}
          fontSize="x-small"
        >
          <Box
            display={{ base: "none", md: "flex" }}
            flex={1}
            justifyContent="flex-start"
            flexDir="column"
            gap={2}
          >
            <Box w="max-content">
              <Flex
                alignItems="center"
                gap={2}
                cursor="pointer"
                onClick={() => window.open(location_url, `_blank`)}
              >
                <IoLocationOutline />
                <Text>{location}</Text>
              </Flex>
            </Box>
            <Box w="max-content">
              <Flex
                alignItems="center"
                gap={2}
                cursor="pointer"
                onClick={() => window.open(`tel:${phone}`)}
              >
                <IoCallOutline />
                <Text>{phone}</Text>
              </Flex>
            </Box>
          </Box>
          <Center flex={1}>
            <Box
              position="relative"
              h={{ base: "35px", lg: "55px" }}
              w="100%"
              maxW={"160px"}
            >
              <Image
                onClick={() => {
                  push(is_parador ? `/` : `/${slug}`);
                }}
                style={{ cursor: "pointer" }}
                src={
                  isHomepage
                    ? convertImgHttps(logo_light)
                    : convertImgHttps(logo_dark)
                }
                layout="fill"
                objectFit="contain"
                alt={`${name} logo`}
              />
            </Box>
          </Center>
          <Box
            flex={1}
            display={{ base: "none", md: "flex" }}
            justifyContent="flex-end"
          >
            <Flex alignItems="center" justifyContent="flex-end" gap={4}>
              {!is_parador && (
                <>
                  <Flex
                    alignItems="center"
                    gap={1}
                    cursor="pointer"
                    onClick={() => {
                      push(`/`);
                    }}
                  >
                    <IoChevronBackCircleOutline
                      style={{ marginBottom: 1 }}
                      size={15}
                    />
                    <Text>Parador</Text>
                  </Flex>
                  <Center height="16px">
                    <Divider
                      borderColor={
                        isHomepage ? `whiteAlpha.700` : `blackAlpha.700`
                      }
                      orientation="vertical"
                    />
                  </Center>
                </>
              )}
              <Flex alignItems="center" gap={1}>
                <Box mr={-1}>
                  <LoginSelect
                    icon={<IoPersonOutline size={16} />}
                    items={[
                      { name: "Individual", value: "en" },
                      { name: "Company", value: "id" },
                    ]}
                    placeHolder={locale == "id" ? "Masuk" : "Log In"}
                  />
                </Box>
              </Flex>
              <Center height="16px">
                <Divider
                  borderColor={isHomepage ? `whiteAlpha.700` : `blackAlpha.700`}
                  orientation="vertical"
                />
              </Center>
              <Box mr={-1}>
                <InputSelect
                  icon={<IoGlobeOutline size={18} />}
                  items={[
                    { name: "English", value: "en" },
                    { name: "Bahasa", value: "id" },
                  ]}
                  placeHolder={locale == "id" ? "Bahasa" : "English"}
                />
              </Box>
            </Flex>
          </Box>
        </Flex>
      ) : (
        <Flex
          justify="space-between"
          align="center"
          bg={isHomepage ? color_primary : `white`}
          color={isHomepage ? color_secondary ?? `white` : color_primary}
          pt={[4]}
          px={safeMarginX}
          zIndex={999}
        >
          <Box position="relative" w={is_parador ? "80px" : "50px"} h={"50px"}>
            <Image
              onClick={() => {
                push(is_parador ? `/` : `/${slug}`);
              }}
              style={{ cursor: "pointer" }}
              src={
                isHomepage
                  ? convertImgHttps(logo_light)
                  : convertImgHttps(logo_dark)
              }
              layout="fill"
              objectFit="contain"
              alt={`${name} logo`}
            />
          </Box>
          <Flex align="center" gap={4}>
            {!is_parador && (
              <>
                <Box onClick={() => push(`/`)}>
                  <IoChevronBackCircleOutline size={20} />
                </Box>
                <Center height="20px">
                  <Divider
                    orientation="vertical"
                    borderColor="inherit"
                    opacity={1}
                  />
                </Center>
              </>
            )}
            {false && (
              <>
                <Select
                  border="none"
                  icon={<IoPerson size={16} />}
                  _focus={{}}
                  // color="transparent"
                  // _placeholder={{ color: "transparent" }}
                  // textColor="transparent"
                  // className="reset-select-mobile"
                  onChange={(e) =>
                    push({ pathname, query }, asPath, {
                      locale: e.target.value,
                    })
                  }
                >
                  <option
                    onClick={() => {
                      window.open("google.com", "_blank");
                    }}
                  ></option>
                </Select>
                <Center height="20px">
                  <Divider
                    orientation="vertical"
                    borderColor="inherit"
                    opacity={1}
                  />
                </Center>
              </>
            )}
            <Select
              border="none"
              icon={<></>}
              _focus={{}}
              className="reset-select-mobile"
              onChange={(e) =>
                push({ pathname, query }, asPath, { locale: e.target.value })
              }
            >
              <option selected={locale == "en"} value="en">
                ENG
              </option>
              <option selected={locale == "id"} value="id">
                BHS
              </option>
            </Select>
          </Flex>
        </Flex>
      )}
      <Flex
        // bg={offsetHeader || !isHomepage ? `white` : color_primary}
        // bg="red"
        bg={offsetHeader || !isHomepage ? `white` : color_primary}
        color={offsetHeader || !isHomepage ? color_primary : `white`}
        zIndex={999}
        position="sticky"
        top={0}
        w="100%"
        px={safeMarginX}
        py={3}
        justify="space-between"
        align="flex-start"
        className={`nav-container ${
          offsetHeader || (!isHomepage && is2XLarge) ? `header-box-shadows` : ``
        }`}
      >
        {is2XLarge ? (
          <Flex flexDir="column" w="100%">
            <Flex
              alignItems="center"
              w="100%"
              color="inherit"
              pb={navPosition == "store" ? 14 : 0}
              // transition="padding-bottom .5s ease-in-out"
            >
              <>
                <Box flex={1} w="100%">
                  {is_parador ? (
                    <InputGroup display="flex" alignItems="center">
                      <SearchIcon fontSize="xl" color="inherit" />
                      <Input
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={handleSearch}
                        variant="filled"
                        bg="transparent"
                        color="inherit"
                        type="text"
                        placeholder={locale === "id" ? `CARI` : `SEARCH`}
                        borderRadius={0}
                        _focus={{ borderRadius: 0 }}
                        _hover={{}}
                        mx={2}
                        pl={2}
                      />
                    </InputGroup>
                  ) : (
                    offsetHeader && (
                      <Flex
                        justify="flex-start"
                        position="relative"
                        h="40px"
                        w="50px"
                        cursor="pointer"
                        onClick={() => push(`/${slug}`)}
                      >
                        <Image
                          src={logo_dark}
                          alt="logo"
                          layout="fill"
                          objectFit="contain"
                        />
                      </Flex>
                    )
                  )}
                </Box>
                <Flex flex={5} mx={is_parador ? 6 : 0}>
                  <Flex
                    color="inherit"
                    gap={is_parador ? 10 : 6}
                    fontSize="sm"
                    fontWeight={500}
                    justifyContent="space-between"
                    alignItems="center"
                    w="100%"
                    h="40px"
                    textTransform="uppercase"
                    wordBreak="keep-all"
                    whiteSpace="nowrap"
                  >
                    {is_parador ? (
                      <LinkTo
                        activeColor={handleActiveColor}
                        onClick={(e: Event) => {
                          setNavPosition("hotels");
                          setIsNavPop(true);
                          e.preventDefault();
                        }}
                        className="link-with-icon"
                      >
                        {locale === "id" ? `Hotel` : `Hotels`}
                        <IoChevronDown
                          color={handleActiveColor
                            .toString()
                            .replace("#", "%23")}
                        />
                      </LinkTo>
                    ) : (
                      <LinkTo
                        active={navPosition.includes("rooms")}
                        activeColor={handleActiveColor}
                        to={`/${slug}/rooms`}
                      >
                        {locale === "id" ? `Kamar` : `Rooms`}
                      </LinkTo>
                    )}
                    {is_parador ? (
                      <LinkTo
                        active={navPosition.includes("special-offer")}
                        activeColor={handleActiveColor}
                        to={`/special-offers`}
                      >
                        {locale === "id" ? `Promo Spesial` : `Special Offers`}
                      </LinkTo>
                    ) : (
                      <LinkTo
                        active={navPosition.includes("hotel-offer")}
                        activeColor={handleActiveColor}
                        to={`/${slug}/hotel-offers`}
                      >
                        {locale === "id" ? `Promo` : `Offers`}
                      </LinkTo>
                    )}

                    {(has_dining === "true" || is_parador) && (
                      <LinkTo
                        activeColor={handleActiveColor}
                        active={!is_parador && navPosition.includes("dining")}
                        onClick={(e: Event) => {
                          setNavPosition("dining");
                          is_parador
                            ? setIsNavPop(true)
                            : push(`/${slug}/dining`);
                          e.preventDefault();
                        }}
                        className="link-with-icon"
                        to={!is_parador ? `/${slug}/dining` : `#`}
                      >
                        {locale === "id" ? `Restoran` : `Dining`}
                        {is_parador && (
                          <IoChevronDown
                            color={handleActiveColor
                              .toString()
                              .replace("#", "%23")}
                          />
                        )}
                      </LinkTo>
                    )}

                    {has_meeting_events === "true" && (
                      <LinkTo
                        active={navPosition.includes("meeting-events")}
                        activeColor={handleActiveColor}
                        to={
                          is_parador
                            ? `/meeting-events`
                            : `/${slug}/meeting-events`
                        }
                      >
                        {locale === "id" ? `Rapat & Acara` : `Meeting & Events`}
                      </LinkTo>
                    )}

                    {!is_parador && (
                      <LinkTo
                        active={navPosition.includes("facilities")}
                        activeColor={handleActiveColor}
                        to={`/${slug}/facilities`}
                      >
                        {locale === "id" ? `Fasilitas` : `Facilities`}
                      </LinkTo>
                    )}

                    {has_wedding === "true" && (
                      <LinkTo
                        active={navPosition.includes("wedding")}
                        activeColor={handleActiveColor}
                        to={is_parador ? `/wedding` : `/${slug}/wedding`}
                      >
                        {locale === "id" ? `Pernikahan` : `Wedding`}
                      </LinkTo>
                    )}

                    {!is_parador && (
                      <LinkTo
                        active={navPosition.includes("gallery")}
                        activeColor={
                          isHomepage && !offsetHeader ? `white` : color_primary
                        }
                        to={`/${slug}/gallery`}
                      >
                        {locale === "id" ? `Galeri` : `gallery`}
                      </LinkTo>
                    )}

                    {!is_parador && (
                      <LinkTo
                        active={navPosition.includes("local-area")}
                        activeColor={handleActiveColor}
                        to={`/${slug}/local-area`}
                      >
                        {locale === "id" ? `Area Lokal` : `Local Area`}
                      </LinkTo>
                    )}

                    {is_parador && (
                      <Flex flexDir="column">
                        <LinkTo
                          active={
                            navPosition.includes("store") ||
                            navPosition.includes("shop") ||
                            navPosition.includes("cart") ||
                            navPosition.includes("gift-cart")
                          }
                          activeColor={handleActiveColor}
                          to={
                            locale == "id"
                              ? "https://www.shop.parador-hotels.com/id/"
                              : "https://www.shop.parador-hotels.com/"
                          }
                          className="link-with-icon"
                          // onClick={(e: Event) => {
                          //   navPosition == "store"
                          //     ? setNavPosition("")
                          //     : setNavPosition("store");
                          //   e.preventDefault();
                          // }}
                        >
                          {locale === "id" ? `Belanja` : `Shop`}
                          {/* {navPosition == "store" ? (
                            <IoChevronUp
                              color={handleActiveColor
                                .toString()
                                .replace("#", "%23")}
                            />
                          ) : (
                            <IoChevronDown
                              color={handleActiveColor
                                .toString()
                                .replace("#", "%23")}
                            />
                          )} */}
                        </LinkTo>
                        {/* {navPosition == "store" && (
                          <Flex
                            flexDir="column"
                            position={"absolute"}
                            bottom={3}
                            gap={1.5}
                            opacity={0.7}
                          >
                            <LinkTo
                              activeColor={
                                offsetHeader || !isHomepage
                                  ? color_primary
                                  : `white`
                              }
                              to={
                                locale == "id"
                                  ? "https://www.shop.parador-hotels.com/id/"
                                  : "https://www.shop.parador-hotels.com/"
                              }
                            >
                              {locale == "id" ? "Belanja" : "Shop"}
                            </LinkTo>
                            <LinkTo
                              activeColor={isHomepage ? "white" : color_primary}
                              to="/gift-card"
                            >
                              {locale == "id" ? "Kartu Hadiah" : "Gift Card"}
                            </LinkTo>
                          </Flex>
                        )} */}
                      </Flex>
                    )}

                    <LinkTo
                      active={navPosition.includes("contact")}
                      activeColor={handleActiveColor}
                      to={is_parador ? `/contact` : `/${slug}/contact`}
                    >
                      {locale === "id" ? `Kontak` : `Contact Us`}
                    </LinkTo>
                  </Flex>
                </Flex>
                <Flex
                  flex={1}
                  justify="flex-end"
                  position="relative"
                  ref={bookNowTopRef}
                >
                  {(offsetBookNow || !isHomepage) && (
                    <Button
                      onClick={handleBook}
                      variant="dark"
                      bg={color_primary}
                      borderColor={color_primary}
                      _hover={{
                        border: `1px solid ${color_primary}`,
                        color: color_primary,
                        bg: "white",
                      }}
                    >
                      {locale === "id" ? `Pesan` : `Book Now`}
                    </Button>
                  )}
                  {showBookNowTop && (
                    <Box position="absolute" right={0} top={16}>
                      <FormBookNowTop
                        hotelCode={hotel_code}
                        colorPrimary={color_primary}
                      />
                    </Box>
                  )}
                </Flex>
              </>
            </Flex>
          </Flex>
        ) : (
          <Flex
            justify="space-between"
            align="center"
            w="100%"
            position="relative"
            ref={bookNowTopMobileRef}
          >
            <Box onClick={() => setIsMobilePop(true)}>
              <FaGripLines size={32} color={handleActiveColor.toString()} />
            </Box>
            <Button
              h="100%"
              onClick={() => {
                setShowBookNowTopMobile(!showBookNowTopMobile);
              }}
              variant={offsetHeader || !isHomepage ? `dark` : `light`}
              bg={offsetHeader || !isHomepage ? color_primary : `white`}
              color={offsetHeader || !isHomepage ? `white` : color_primary}
              borderWidth={0}
              _hover={{}}
            >
              {locale === "id" ? `Pesan` : `Book Now`}
            </Button>
            {showBookNowTopMobile && (
              <Box position="absolute" right={0} top={14} zIndex={10000}>
                <Center>
                  <FormBookNowTop
                    hotelCode={hotel_code}
                    colorPrimary={color_primary}
                  />
                </Center>
              </Box>
            )}
          </Flex>
        )}
      </Flex>
    </Box>
  );
}

const FilterOptions = [
  { value: "brands", label: "Brands" },
  { value: "location", label: "Location" },
];

const hotelLoc = [
  "atria-hotel-gading-serpong",
  "atria-residences-gading-serpong",
  "vega-hotel-gading-serpong",
  "fame-hotel-gading-serpong",
  "starlet-hotel-serpong",
  "starlet-hotel-bsd-city",

  "fame-hotel-sunset-road",

  "starlet-hotel-jakarta-airport",

  "atria-hotel-magelang",

  "atria-hotel-malang",

  // "haka-hotel-semarang",
];

function HeaderPop({
  hotelBrands,
  hotelCode,
  setNavPop,
  navPosition,
  setNavPosition,
  slug,
  idHotel,
}: {
  hotelBrands: any;
  hotelCode: number | string | null;
  setNavPop: any;
  navPosition: string;
  setNavPosition: any;
  slug: string | undefined;
  idHotel?: string | number | undefined;
}) {
  const { route, push, locale, pathname, query, asPath } = useRouter();

  const { listDining, isLoading, isError } = useNextDining();

  const [filterOption, setFilterOption] = useState("brands");

  function handleBook() {
    setShowBookNowTop(!showBookNowTop);
  }

  const [serachValue, setSearchValue] = useState("");
  const handleSearch = (event: any) => {
    if (event.key === "Enter") {
      push(`/search?keyword=${serachValue}`);
    }
  };

  const [showBookNowTop, setShowBookNowTop] = useState(false);

  const bookNowTopRef = useRef(null);
  useOutsideClick({
    ref: bookNowTopRef,
    handler: () => setShowBookNowTop(false),
  });

  return (
    <>
      <Flex
        alignItems="center"
        w="100%"
        color="inherit"
        px={safeMarginX}
        py={3}
      >
        <>
          <Box flex={1} w="100%">
            <InputGroup display="flex" alignItems="center">
              <SearchIcon fontSize="xl" color="inherit" />
              <Input
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearch}
                variant="filled"
                bg="transparent"
                color="inherit"
                type="text"
                placeholder={locale === "id" ? `CARI` : `SEARCH`}
                borderRadius={0}
                _focus={{ borderRadius: 0 }}
                _hover={{}}
                mx={2}
                pl={2}
              />
            </InputGroup>
          </Box>
          <Flex flex={5} mx={6}>
            <Flex
              color="inherit"
              gap={10}
              fontSize="sm"
              fontWeight={500}
              justifyContent="space-between"
              alignItems="center"
              w="100%"
              textTransform="uppercase"
              wordBreak="keep-all"
              whiteSpace="nowrap"
            >
              <LinkTo
                activeColor={"white"}
                active={navPosition == "hotels"}
                onClick={(e: Event) => {
                  setNavPosition(navPosition == "hotels" ? asPath : "hotels");
                  setNavPop(navPosition == "hotels" ? false : true);
                  e.preventDefault();
                }}
                className="link-with-icon"
              >
                {locale === "id" ? `Hotel` : `Hotels`}
                {navPosition == "hotels" ? (
                  <IoChevronUp color={"white"} />
                ) : (
                  <IoChevronDown color={"white"} />
                )}
              </LinkTo>

              <LinkTo activeColor={"white"} to={`/special-offers`}>
                {locale === "id" ? `Promo Spesial` : `Special Offers`}
              </LinkTo>

              <LinkTo
                activeColor={"white"}
                active={navPosition == "dining"}
                onClick={(e: Event) => {
                  setNavPosition(navPosition == "dining" ? asPath : "dining");
                  setNavPop(navPosition == "dining" ? false : true);
                  e.preventDefault();
                }}
                className="link-with-icon"
                to={`#`}
              >
                {locale === "id" ? `Restoran` : `Dining`}
                {navPosition == "dining" ? (
                  <IoChevronUp color={"white"} />
                ) : (
                  <IoChevronDown color={"white"} />
                )}
              </LinkTo>

              <LinkTo
                activeColor={`white`}
                // to={`/${slug}/hotel-offers`}
                to={`/meeting-events`}
              >
                {locale === "id" ? `Rapat & Acara` : `Meeting & Events`}
              </LinkTo>

              <LinkTo activeColor={`white`} to={`/wedding`}>
                {locale === "id" ? `Pernikahan` : `Wedding`}
              </LinkTo>

              <LinkTo
                activeColor={`white`}
                to={
                  locale == "id"
                    ? "https://www.shop.parador-hotels.com/id/"
                    : "https://www.shop.parador-hotels.com/"
                }
                className="link-with-icon"
                // onClick={(e: Event) => {
                //   setNavPop(false);
                //   navPosition == "store"
                //     ? setNavPosition("")
                //     : setNavPosition("store");
                //   e.preventDefault();
                // }}
              >
                {locale === "id" ? `Belanja` : `Shop`}
                {/* {navPosition == "store" ? (
                  <IoChevronUp color={`white`} />
                ) : (
                  <IoChevronDown color={`white`} />
                )} */}
              </LinkTo>

              <LinkTo activeColor={`white`} to={`/contact`}>
                {locale === "id" ? `Kontak` : `Contact Us`}
              </LinkTo>
            </Flex>
          </Flex>
          <Flex flex={1} justify="flex-end">
            <Box position="relative" ref={bookNowTopRef}>
              <Button onClick={handleBook} variant="light">
                {locale === "id" ? `Pesan` : `Book Now`}
              </Button>
              {showBookNowTop && (
                <Box position="absolute" right={0} top={16} zIndex={10000}>
                  <FormBookNowTop
                    hotelCode={hotelCode}
                    colorPrimary={"black"}
                  />
                </Box>
              )}
            </Box>
            <Box
              position="absolute"
              mt={1}
              right="3%"
              cursor="pointer"
              onClick={() => setNavPop(false)}
            >
              <IoClose size={24} />
            </Box>
            {}
          </Flex>
        </>
      </Flex>
      {navPosition === "hotels" ? (
        <Flex justify="flex-end" px={safeMarginX}>
          <Box mr={-3} className="custom-select">
            <Select
              border={0}
              fontSize="xs"
              _focus={{}}
              cursor="pointer"
              textTransform="uppercase"
              color="white"
              value={filterOption ? filterOption : undefined}
              onChange={(e) => {
                setFilterOption(e.target.value);
              }}
            >
              <option value="brands">
                {locale == "id" ? "MEREK" : "BRANDS"}
              </option>
              <option value="location">
                {locale == "id" ? "LOKASI" : "LOCATION"}
              </option>
            </Select>
          </Box>
        </Flex>
      ) : (
        <Box h={10} />
      )}
      <Flex px={safeMarginX} color="white" gap={10}>
        <Box w="20%">
          <Heading
            as="h1"
            fontSize="xl"
            letterSpacing={2}
            fontWeight={400}
            mb={4}
            mr={4}
            wordBreak="break-word"
            whiteSpace="pre-wrap"
          >
            {navPosition === "hotels" &&
              (locale == "id"
                ? `EKOSISTEM HOTEL YANG HOLISTIK
`
                : `A HOLISTIC ECOSYSTEM OF HOTELS`)}
            {navPosition === "dining" &&
              (locale == "id"
                ? `MASAKAN PENUH PETUALANGAN
`
                : `AN ADVENTUROUS CUISINE`)}
          </Heading>
          <Text fontSize="sm" mr={4} color="whiteAlpha.900">
            {navPosition === "hotels" &&
              (locale == "id"
                ? `Meningkatkan cara Hidup, Bekerja, Bermain, dan Berbisnis; melalui pengalaman menginap dan bersantap tanpa batas.`
                : `Elevating live, work, play, and do business; through limitless experiences in staying and dining.`)}
            {navPosition === "dining" &&
              (locale == "id"
                ? `Jelajahi pengalaman menikmati makanan bercita rasa tinggi yang etis, terkini, dan penuh perhatian dalam penyajian.`
                : `Explore into an exquisite sensory feast of ethical eating, conscious cuisine, and cutting edge eat experience.
`)}
          </Text>
        </Box>
        <Box>
          <Center height="100%">
            <Divider orientation="vertical" />
          </Center>
        </Box>
        {navPosition === "hotels" && filterOption === "brands" && (
          <Flex gap={12} textTransform="uppercase">
            <Flex direction="column" gap={5}>
              <HotelList
                name={hotelBrands[0].name}
                list={hotelBrands[0].list}
                linkTo={hotelBrands[0].linkTo}
              />
              <Divider />
              <HotelList
                name={hotelBrands[1].name}
                list={hotelBrands[1].list}
                linkTo={hotelBrands[1].linkTo}
              />
            </Flex>
            <Flex direction="column" gap={5}>
              <HotelList
                name={hotelBrands[2].name}
                list={hotelBrands[2].list}
                linkTo={hotelBrands[2].linkTo}
              />
              <Divider />
              <HotelList
                name={hotelBrands[3].name}
                list={hotelBrands[3].list}
                linkTo={hotelBrands[3].linkTo}
              />
            </Flex>
            <Flex direction="column" gap={5}>
              <HotelList
                name={hotelBrands[4].name}
                list={hotelBrands[4].list}
                linkTo={hotelBrands[4].linkTo}
              />
            </Flex>
          </Flex>
        )}
        {navPosition === "hotels" &&
          filterOption === "location" &&
          (isLoading ? (
            <Center>
              <Spinner size="xl" color="white" />
            </Center>
          ) : (
            <Flex gap={16} textTransform="uppercase">
              <Flex direction="column" gap={5}>
                <HotelList
                  name="Tangerang"
                  nameLink={`/filter?type=hotel&location=tangerang`}
                  setNavPop={(isNavPop: SetStateAction<any>) =>
                    setNavPop(isNavPop)
                  }
                  list={[
                    "ATRIA HOTEL",
                    "ATRIA RESIDENCES",
                    "VEGA HOTEL",
                    "FAME HOTEL",
                    "STARLET HOTEL",
                    "STARLET HOTEL",
                  ]}
                  sublist={[
                    "GADING serpong",
                    "GADING serpong",
                    "GADING serpong",
                    "GADING serpong",
                    "serpong",
                    "BSD CITY",
                  ]}
                  linkTo={[
                    hotelLoc[0],
                    hotelLoc[1],
                    hotelLoc[2],
                    hotelLoc[3],
                    hotelLoc[4],
                    hotelLoc[5],
                  ]}
                />
              </Flex>
              <Flex direction="column" gap={5}>
                <HotelList
                  name="BALI"
                  nameLink={`/filter?type=hotel&location=bali`}
                  list={["FAME HOTEL"]}
                  sublist={["SUNSET ROAD"]}
                  linkTo={[hotelLoc[6]]}
                  setNavPop={(isNavPop: SetStateAction<any>) =>
                    setNavPop(isNavPop)
                  }
                />
                <Divider />
                <HotelList
                  name="JAKARTA"
                  nameLink={`/filter?type=hotel&location=jakarta`}
                  list={["STARLET HOTEL"]}
                  sublist={["JAKARTA AIRPORT"]}
                  linkTo={[hotelLoc[7]]}
                  setNavPop={(isNavPop: SetStateAction<any>) =>
                    setNavPop(isNavPop)
                  }
                />
              </Flex>
              <Flex direction="column" gap={5}>
                <HotelList
                  name="Magelang"
                  nameLink={`/filter?type=hotel&location=magelang`}
                  list={["ATRIA HOTEL"]}
                  sublist={["MAGELANG"]}
                  linkTo={[hotelLoc[8]]}
                  setNavPop={(isNavPop: SetStateAction<any>) =>
                    setNavPop(isNavPop)
                  }
                />
                <Divider />
                <HotelList
                  name="Malang"
                  nameLink={`/filter?type=hotel&location=malang`}
                  list={["ATRIA HOTEL"]}
                  sublist={["MALANG"]}
                  linkTo={[hotelLoc[9]]}
                  setNavPop={(isNavPop: SetStateAction<any>) =>
                    setNavPop(isNavPop)
                  }
                />
              </Flex>
            </Flex>
          ))}
        {navPosition === "dining" &&
          (isLoading ? (
            <Center flex={1} mt={4}>
              <Spinner size="xl" color="white" />
            </Center>
          ) : (
            <Flex gap={16} textTransform="uppercase">
              <Flex direction="column" gap={5}>
                <HotelList
                  name={listDining[0].name}
                  nameLink={`/filter?type=dining&location=tangerang`}
                  list={listDining[0].list}
                  sublist={listDining[0].subList}
                  linkTo={listDining[0].linkTo}
                />
              </Flex>
              <Flex direction="column" gap={5}>
                <HotelList
                  name={listDining[1].name}
                  nameLink={`/filter?type=dining&location=magelang`}
                  list={listDining[1].list}
                  sublist={listDining[1].subList}
                  linkTo={listDining[1].linkTo}
                />
                <Divider />
                <HotelList
                  name={listDining[2].name}
                  nameLink={`/filter?type=dining&location=malang`}
                  list={listDining[2].list}
                  sublist={listDining[2].subList}
                  linkTo={listDining[2].linkTo}
                />
              </Flex>
              <Flex direction="column" gap={5}>
                <HotelList
                  name={listDining[3].name}
                  nameLink={`/filter?type=dining&location=bali`}
                  list={listDining[3].list}
                  sublist={listDining[3].subList}
                  linkTo={listDining[3].linkTo}
                />
              </Flex>
            </Flex>
          ))}
      </Flex>
    </>
  );
}

function HotelList({
  name,
  list,
  sublist = [],
  linkTo = [],
  nameLink,
  setNavPop,
}: any) {
  const router = useRouter();
  return (
    <Flex direction="column" gap={3}>
      {nameLink ? (
        <LinkTo
          activeColor="white"
          to={nameLink}
          onClick={() => setNavPop(false)}
        >
          <Text fontSize="xl" letterSpacing={3} fontWeight={400} mb={1}>
            {name}
          </Text>
        </LinkTo>
      ) : (
        <Text fontSize="xl" letterSpacing={3} fontWeight={400} mb={1}>
          {name}
        </Text>
      )}
      {list.map((item: any, i: any) => (
        <Box key={i} color="whiteAlpha.700" letterSpacing={2}>
          <LinkTo
            onClick={() => {
              linkTo.length > 0
                ? router.push(`/${linkTo[i]}`)
                : alert("it doesn't get you anywhere, yet.");
            }}
            to={linkTo.length > 0 ? `/${linkTo[i]}` : `#`}
            fontSize="md"
          >
            {item}
          </LinkTo>
          {sublist.length > 0 && (
            <Text my={1} fontSize="x-small">
              {sublist[i]}
            </Text>
          )}
        </Box>
      ))}
    </Flex>
  );
}

const hotelMobileList = {
  list: [
    "Atria Hotel Gading Serpong",
    "Atria Hotel Magelang",
    "Atria Hotel Malang",
    "Atria residences Gading Serpong",
    "Vega Hotel Gading Serpong",
    "Fame Hotel Gading Serpong",
    "Fame Hotel Sunset Road",
    // "HA-KA Hotel Semarang",
    "Starlet Hotel Jakarta Airport",
    "Starlet Hotel BSD City",
    "Starlet Hotel Serpong",
  ],

  target: [
    "atria-hotel-gading-serpong",
    "atria-hotel-magelang",
    "atria-hotel-malang",
    "atria-residences-gading-serpong",
    "vega-hotel-gading-serpong",
    "fame-hotel-gading-serpong",
    "fame-hotel-sunset-road",
    // "haka-hotel-semarang",
    "starlet-hotel-jakarta-airport",
    "starlet-hotel-bsd-city",
    "starlet-hotel-serpong",
  ],
};

const diningMobileList = [
  { id: 8, name: "BATEEQ LOUNGE" },
  { id: 11, name: "BATEEQ LOUNGE" },
  { id: 13, name: "BATEEQ LOUNGE" },
  { id: 14, name: "Bianco Sapori D'Italia" },
  { id: 12, name: "CANTING RESTAURANT" },
  { id: 18, name: "HANGRY RESTAURANT" },
  { id: 2, name: "LEGEN LOUNGE & BAR" },
  { id: 20, name: "Legen Restaurant" },
  { id: 10, name: "PAMILUTO RESTAURANT" },
  { id: 16, name: "POPCORN RESTAURANT" },
  { id: 17, name: "POPCORN RESTAURANT" },
  { id: 15, name: "YUGO RESTAURANT" },
];

const diningMobileListV2 = [
  {
    hotel: "atria hotel gading serpong",
    slug: "atria-hotel-gading-serpong",
    dining: [
      { id: 8, name: "BATEEQ LOUNGE" },
      { id: 20, name: "Legen Restaurant" },
    ],
  },
  {
    hotel: "atria residences gading serpong",
    slug: "atria-residences-gading-serpong",
    dining: [{ id: 14, name: "Bianco Sapori D'Italia" }],
  },
  {
    hotel: "atria hotel magelang",
    slug: "atria-hotel-magelang",
    dining: [
      { id: 11, name: "BATEEQ LOUNGE" },
      { id: 10, name: "PAMILUTO RESTAURANT" },
    ],
  },
  {
    hotel: "atria hotel malang",
    slug: "atria-hotel-malang",
    dining: [
      { id: 13, name: "BATEEQ LOUNGE" },
      { id: 12, name: "CANTING RESTAURANT" },
    ],
  },
  {
    hotel: "atria hotel malang",
    slug: "atria-hotel-malang",
    dining: [
      { id: 13, name: "BATEEQ LOUNGE" },
      { id: 12, name: "CANTING RESTAURANT" },
    ],
  },
  {
    hotel: "fame hotel gading serpong",
    slug: "fame-hotel-gading-serpong",
    dining: [{ id: 17, name: "POPCORN RESTAURANT" }],
  },
  {
    hotel: "fame hotel sunset road",
    slug: "fame-hotel-sunset-road",
    dining: [{ id: 16, name: "POPCORN RESTAURANT" }],
  },
  // {
  //   hotel: "ha-ka hotel semarang",
  //   slug: "haka-hotel-semarang",
  //   dining: [{ id: 18, name: "HANGRY RESTAURANT" }],
  // },
  {
    hotel: "vega hotel gading serpong",
    slug: "vega-hotel-gading-serpong",
    dining: [{ id: 15, name: "YUGO RESTAURANT" }],
  },
];
