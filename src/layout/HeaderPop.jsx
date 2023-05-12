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
  Link,
  Select,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { safeMarginX, useLargeQuery } from "../utils/mediaQuery";
import { IoMenuSharp, IoChevronUp, IoChevronDown } from "react-icons/io5";
import {
  NavContext,
  useBookEngine,
  useHeaderImage,
  useNextDining,
} from "../utils/hooks";
import { useRouter } from "next/router";
import { objectToParams } from "../utils/functions";
import InputSelect from "../components/Input/InputSelect";
import LinkTo from "../components/LinkTo";

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

export default function HeaderPop({
  isParador,
  hotelBrands = [{ name: "", list: [], linkTo: [] }],
}) {
  const { navPosition, setNavPosition, isNavPop, setIsNavPop } =
    useContext(NavContext);

  const router = useRouter();

  const [filterOption, setFilterOption] = useState(
    navPosition === "hotels" ? "brands" : null
  );

  function handleBook() {
    router.push(
      `https://be.synxis.com/?${objectToParams({
        hotel: hotel_code.length > 2 ? hotel_code : 36461,
      })}`
    );
  }

  const { listDining, isLoading, isError } = useNextDining();

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
                        ? setNavPosition(router.route)
                        : setNavPosition("hotels");
                      setIsNavPop(!isNavPop);
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
                    router.push("/special-offers");
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
                      ? setNavPosition(router.route)
                      : setNavPosition("dining");
                    setIsNavPop(!isNavPop);
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
              value={filterOption}
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

function HotelList({ name, list, sublist = [], linkTo = [] }) {
  const router = useRouter();
  return (
    <Flex direction="column" gap={3}>
      <Text fontSize="xl" letterSpacing={3} fontWeight={400} mb={1}>
        {name}
      </Text>
      {list.map((item, i) => (
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
