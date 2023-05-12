import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Input,
  InputGroup,
  Select,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  IoCallOutline,
  IoChevronDown,
  IoChevronUp,
  IoGlobeOutline,
  IoLocationOutline,
  IoMenuSharp,
  IoPersonOutline,
} from "react-icons/io5";
import InputSelect from "../components/Input/InputSelect";
import LinkTo from "../components/LinkTo";
import { convertImgHttps, objectToParams } from "../utils/functions";
import { useNextDining } from "../utils/hooks";
import { safeMarginX, useLargeQuery } from "../utils/mediaQuery";
import { IHeader } from "../utils/types";

export default function HeaderV2({
  headerItem,
  isHomepage,
  getHeight,
  hotelBrands,
}: {
  headerItem: IHeader;
  isHomepage: boolean;
  getHeight?: any;
  hotelBrands: any;
}) {
  const { route, asPath, push, locales, locale } = useRouter();

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
  } = headerItem;

  const { isLarge } = useLargeQuery();

  const container = useRef(null);
  const headerContainer = useRef<any>(null);

  const [offsetHeader, setOffsetHeader] = useState(false);
  const [isNavPop, setIsNavPop] = useState(false);
  const [navPosition, setNavPosition] = useState(route);

  useEffect(() => {
    if (headerContainer) {
      getHeight(headerContainer.current.offsetHeight);
    }
    if (!container) return;
    headerClass();
    window.onscroll = function () {
      headerClass();
    };
  }, []);

  const headerClass = () => {
    if (window.pageYOffset > headerContainer.current.offsetHeight) {
      setOffsetHeader(true);
    } else {
      setOffsetHeader(false);
    }
  };

  function handleBook() {
    push(
      `https://be.synxis.com/?${objectToParams({
        hotel: hotel_code,
      })}`
    );
  }

  function handleActiveColor() {
    if (isHomepage && !offsetHeader) return "white";
    if (is_parador && !isHomepage) return "red";
    return color_primary.toString();
  }

  if (isNavPop) {
    return (
      <>
        <HeaderPop
          hotelBrands={hotelBrands}
          isParador={is_parador}
          hotelCode={hotel_code}
          setNavPop={(isNavPop: any) => setIsNavPop(isNavPop)}
        />
      </>
    );
  }

  return (
    <Box display="initial" color={color_secondary} ref={headerContainer}>
      <Flex
        bg={color_primary}
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
          <Box position="relative" h={{ base: "35px", lg: "55px" }} w="100%">
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
            <Flex alignItems="center" gap={1}>
              <IoPersonOutline size={12} />
              <Text>Log In</Text>
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
                items={["English"]}
                placeHolder="English"
              />
            </Box>
          </Flex>
        </Box>
      </Flex>

      <Flex
        bg={offsetHeader ? `white` : color_primary}
        color={offsetHeader ? color_primary : `white`}
        zIndex={1000}
        position="sticky"
        top={0}
        w="100%"
        px={safeMarginX}
        py={1.5}
        justify="space-between"
        align="flex-start"
        className="nav-container"
      >
        {isLarge ? (
          <Flex alignItems="center" w="100%" color="inherit">
            <>
              <Box flex={1} w="100%">
                {is_parador ? (
                  <InputGroup display="flex" alignItems="center">
                    <SearchIcon fontSize="xl" color="inherit" />
                    <Input
                      variant="filled"
                      bg="transparent"
                      color="inherit"
                      type="tel"
                      placeholder="SEARCH"
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
                      h="50px"
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
                  textTransform="uppercase"
                  wordBreak="keep-all"
                >
                  {is_parador ? (
                    <LinkTo
                      activeColor={handleActiveColor}
                      onClick={() => {
                        setNavPosition("hotels");
                        setIsNavPop(!isNavPop);
                      }}
                      className="link-with-icon"
                    >
                      {locale === "id" ? `Hotels` : `Hotels`}
                      <IoChevronDown
                        color={handleActiveColor.toString().replace("#", "%23")}
                      />
                    </LinkTo>
                  ) : (
                    <LinkTo
                      activeColor={handleActiveColor}
                      to={`/${slug}/rooms`}
                    >
                      Rooms
                    </LinkTo>
                  )}
                  {is_parador ? (
                    <LinkTo
                      activeColor={handleActiveColor}
                      to={`/special-offers`}
                    >
                      {locale === "id" ? `Special Offers` : `Special Offers`}
                    </LinkTo>
                  ) : (
                    <LinkTo
                      activeColor={handleActiveColor}
                      to={`/${slug}/hotel-offers`}
                    >
                      Hotel Offers
                    </LinkTo>
                  )}
                  <LinkTo
                    activeColor={handleActiveColor}
                    onClick={() => {
                      setNavPosition("dining");
                    }}
                    onMouseEnter={() => {
                      !is_parador && !offsetHeader && setNavPosition("dining");
                    }}
                    className="link-with-icon"
                    to={!is_parador ? `/${slug}/dining` : `#`}
                  >
                    Dining
                    <IoChevronDown
                      color={handleActiveColor.toString().replace("#", "%23")}
                    />
                  </LinkTo>
                  <Text>Meeting & Events</Text>
                  {!is_parador && <Text>Facilities</Text>}
                  <Text>Wedding</Text>
                  {!is_parador && <Text>Gallery</Text>}
                  {!is_parador && <Text>Local Area</Text>}
                  {is_parador && <Text>Store</Text>}
                  <Text>Contact Us</Text>
                </Flex>
              </Flex>
              <Flex flex={1} justify="flex-end">
                {(offsetHeader || !isHomepage) && (
                  <Button
                    onClick={handleBook}
                    variant="dark"
                    bg={color_primary}
                  >
                    Book Now
                  </Button>
                )}
              </Flex>
            </>
          </Flex>
        ) : (
          <Flex justify="space-between" align="center">
            <Box>
              <IoMenuSharp size={32} color={handleActiveColor.toString()} />
            </Box>
            <Button
              onClick={handleBook}
              variant={offsetHeader || !isHomepage ? `dark` : `light`}
              bg={offsetHeader || !isHomepage ? color_primary : `white`}
              color={offsetHeader || !isHomepage ? `white` : color_primary}
            >
              Book Now
            </Button>
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
  isParador,
  hotelCode,
  setNavPop,
}: {
  hotelBrands: any;
  isParador: boolean;
  hotelCode: number | string | null;
  setNavPop: any;
}) {
  const { route, push } = useRouter();

  const { listDining, isLoading, isError } = useNextDining();
  const [navPosition, setNavPosition] = useState(route);

  const [filterOption, setFilterOption] = useState(
    navPosition === "hotels" ? "brands" : null
  );

  function handleBook() {
    push(
      `https://be.synxis.com/?${objectToParams({
        hotel: hotelCode,
      })}`
    );
  }

  return (
    <>
      <Center py={2} className={`nav-container`} h="56px">
        <Box zIndex={999} w="100vw" mx={safeMarginX}>
          <Flex alignItems="center" w="100%">
            <Box flex={1}>
              <InputGroup display="flex" alignItems="center">
                <SearchIcon fontSize="xl" color={`white`} />
                <Input
                  variant="filled"
                  bg="transparent"
                  color={`white`}
                  type="tel"
                  focusBorderColor={`white`}
                  placeholder="SEARCH"
                  borderRadius={0}
                  _focus={{ borderRadius: 0 }}
                  _hover={{}}
                  mx={2}
                  pl={2}
                />
              </InputGroup>
            </Box>
            <Flex flex={2} mx={6}>
              <Flex
                color={`white`}
                gap={10}
                fontSize="sm"
                fontWeight={500}
                justifyContent="space-between"
              >
                {isParador && (
                  <LinkTo
                    onClick={() => {
                      setFilterOption("brands");
                      navPosition == "hotels"
                        ? setNavPosition(route)
                        : setNavPosition("hotels");
                      setNavPop(navPosition == "hotels" ? false : true);
                    }}
                    active={navPosition == "hotels"}
                    activeColor="red"
                    className="link-with-icon"
                  >
                    Hotels
                    {navPosition === "hotels" ? (
                      <IoChevronUp />
                    ) : (
                      <IoChevronDown />
                    )}
                  </LinkTo>
                )}
                <LinkTo
                  onClick={() => {
                    setNavPosition("special-offers");
                    push("/special-offers");
                  }}
                  to={`/special-offers`}
                  activeColor="red"
                >
                  Special Offers
                </LinkTo>
                <LinkTo
                  onClick={() => {
                    setFilterOption("dining");
                    navPosition === "dining"
                      ? setNavPosition(route)
                      : setNavPosition("dining");
                    setNavPop(false);
                  }}
                  className="link-with-icon"
                  active={navPosition == "dining"}
                  activeColor="red"
                >
                  Dining
                  {navPosition === "dining" ? (
                    <IoChevronUp />
                  ) : (
                    <IoChevronDown />
                  )}
                </LinkTo>
                <Text>Meeting & Events</Text>
                <Text>Wedding</Text>
                <Text>Store</Text>
                <Text>Contact Us</Text>
              </Flex>
            </Flex>
            <Flex flex={1} justify="flex-end">
              <Button onClick={handleBook} variant="light">
                Book Now
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Center>
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
              <option value="brands">BRANDS</option>
              <option value="location"> LOCATION </option>
            </Select>
          </Box>
        </Flex>
      ) : (
        <Box h={10} />
      )}
      <Flex px={safeMarginX} color="white" gap={10}>
        <Box w="15%">
          <Heading
            as="h1"
            fontSize="xl"
            letterSpacing={2}
            fontWeight={400}
            mb={4}
            mr={4}
          >
            {navPosition === "hotels" && `A holistic ecosystem of HOTELS`}
            {navPosition === "dining" && `A SENSORY adventure & conscious`}
          </Heading>
          <Text fontSize="sm" mr={4} color="whiteAlpha.900">
            {navPosition === "hotels" &&
              `What we do: elevating life with brands through limitless experiences
            to Live, Work, Play and Do Business.`}
            {navPosition === "dining" &&
              `Come join us, on a sensory adventure into ethical eating, conscious cuisine, and cutting-edge veg.`}
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
            <Flex direction="column" gap={5}>
              <HotelList
                name={hotelBrands[5].name}
                list={hotelBrands[5].list}
                linkTo={hotelBrands[5].linkTo}
              />
            </Flex>
          </Flex>
        )}
        {navPosition === "hotels" && filterOption === "location" && (
          <Flex gap={16} textTransform="uppercase">
            <Flex direction="column" gap={5}>
              <HotelList
                name="Tangerang"
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
                list={["FAME HOTEL"]}
                sublist={["SUNSET ROAD"]}
                linkTo={[hotelLoc[6], hotelLoc[7]]}
              />
              <Divider />
              <HotelList
                name="JAKARTA"
                list={["STARLET HOTEL"]}
                sublist={["JAKARTA AIRPORT"]}
                linkTo={[hotelLoc[8]]}
              />
            </Flex>
            <Flex direction="column" gap={5}>
              <HotelList
                name="Magelang"
                list={["ATRIA HOTEL"]}
                sublist={["MAGELANG"]}
                linkTo={[hotelLoc[9]]}
              />
              <Divider />
              <HotelList
                name="Malang"
                list={["ATRIA HOTEL"]}
                sublist={["MALANG"]}
                linkTo={[hotelLoc[10]]}
              />
            </Flex>
            {/* <Flex direction="column" gap={5}>
              <HotelList
                name="SemarANG"
                list={["HA-KA HOTEL"]}
                sublist={["SEMARANG"]}
                linkTo={[hotelLoc[11]]}
              />
            </Flex> */}
          </Flex>
        )}
        {navPosition === "dining" && listDining && (
          <Flex gap={16} textTransform="uppercase">
            <Flex direction="column" gap={5}>
              <HotelList
                name={listDining[0].name}
                list={listDining[0].list}
                sublist={listDining[0].subList}
                linkTo={listDining[0].linkTo}
              />
            </Flex>
            <Flex direction="column" gap={5}>
              <HotelList
                name={listDining[1].name}
                list={listDining[1].list}
                sublist={listDining[1].subList}
                linkTo={listDining[1].linkTo}
              />
              <Divider />
              <HotelList
                name={listDining[2].name}
                list={listDining[2].list}
                sublist={listDining[2].subList}
                linkTo={listDining[2].linkTo}
              />
            </Flex>
            <Flex direction="column" gap={5}>
              <HotelList
                name={listDining[3].name}
                list={listDining[3].list}
                sublist={listDining[3].subList}
                linkTo={listDining[3].linkTo}
              />
              <Divider />
              <HotelList
                name={listDining[4].name}
                list={listDining[4].list}
                sublist={listDining[4].subList}
                linkTo={listDining[4].linkTo}
              />
            </Flex>
          </Flex>
        )}
      </Flex>
    </>
  );
}

function HotelList({ name, list, sublist = [], linkTo = [] }: any) {
  const router = useRouter();
  return (
    <Flex direction="column" gap={3}>
      <Text fontSize="xl" letterSpacing={3} fontWeight={400} mb={1}>
        {name}
      </Text>
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
