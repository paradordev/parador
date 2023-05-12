import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { IoChevronDown, IoMenuSharp } from "react-icons/io5";
import LinkTo from "../components/LinkTo";
import { objectToParams } from "../utils/functions";
import { NavContext } from "../utils/hooks";
import { safeMarginX, useLargeQuery } from "../utils/mediaQuery";

export default function HeaderBot({
  logo = "",
  topOffset,
  hotel_code = 36461,
  isParador,
  color = "black",
  isHomepage,
  slug = "",
}) {
  const { navPosition, setNavPosition, isNavPop, setIsNavPop } =
    useContext(NavContext);

  const router = useRouter();
  const { isLarge } = useLargeQuery();
  const container = useRef(null);
  const [offsetHeader, setOffsetHeader] = useState(false);

  useEffect(() => {
    if (!container) return;
    headerClass();
    window.onscroll = function () {
      headerClass();
    };
  }, []);

  const headerClass = () => {
    if (window.pageYOffset > topOffset) {
      setOffsetHeader(true);
    } else {
      setOffsetHeader(false);
    }
  };

  function handleBook() {
    router.push(
      `https://be.synxis.com/?${objectToParams({
        hotel: hotel_code.length > 2 ? hotel_code : 36461,
      })}`
    );
  }

  function handleActiveColor() {
    if (isHomepage && !offsetHeader) return "white";
    if (isParador && !isHomepage) return "red";
    return color.toString();
  }
  return (
    <Center
      position="sticky"
      top={0}
      py={2}
      className={`nav-container ${offsetHeader ? `nav-sticky` : ``}`}
      zIndex={1002}
      h="56px"
    >
      <Box zIndex={999} w="100vw" mx={safeMarginX}>
        {isLarge ? (
          <Flex alignItems="center" w="100%">
            <Box flex={1} w="100%">
              {isParador ? (
                <InputGroup display="flex" alignItems="center">
                  <SearchIcon
                    fontSize="xl"
                    color={
                      isParador && !isHomepage ? `black` : handleActiveColor
                    }
                  />
                  <Input
                    variant="filled"
                    bg="transparent"
                    color={
                      isParador && !isHomepage ? `black` : handleActiveColor
                    }
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
                    onClick={() => router.push(`/${slug}`)}
                  >
                    <Image
                      src={logo}
                      alt="logo"
                      layout="fill"
                      objectFit="contain"
                    />
                  </Flex>
                )
              )}
            </Box>
            <Flex flex={4} mx={isParador ? 6 : 0}>
              <Flex
                color={
                  !offsetHeader && isHomepage
                    ? `white`
                    : isParador
                    ? `black`
                    : handleActiveColor
                }
                gap={isParador ? 10 : 6}
                fontSize="sm"
                fontWeight={500}
                justifyContent="space-between"
                alignItems="center"
                w="100%"
              >
                {isParador ? (
                  <LinkTo
                    activeColor={handleActiveColor}
                    onClick={() => {
                      setNavPosition("hotels");
                      setIsNavPop(!isNavPop);
                    }}
                    className="link-with-icon"
                  >
                    Hotels
                    <IoChevronDown
                      color={handleActiveColor.toString().replace("#", "%23")}
                    />
                  </LinkTo>
                ) : (
                  <LinkTo activeColor={handleActiveColor} to={`/${slug}/rooms`}>
                    Rooms
                  </LinkTo>
                )}
                {isParador ? (
                  <LinkTo
                    activeColor={handleActiveColor}
                    to={`/special-offers`}
                  >
                    Special Offers
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
                    !isParador && !offsetHeader && setNavPosition("dining");
                  }}
                  className="link-with-icon"
                  to={!isParador ? `/${slug}/dining` : `#`}
                >
                  Dining
                  <IoChevronDown
                    color={handleActiveColor.toString().replace("#", "%23")}
                  />
                </LinkTo>
                <Text>Meeting & Events</Text>
                {!isParador && <Text>Facilities</Text>}
                <Text>Wedding</Text>
                {!isParador && <Text>Gallery</Text>}
                {!isParador && <Text>Local Area</Text>}
                {isParador && <Text>Store</Text>}
                <Text>Contact Us</Text>
                {/* {!isParador && (offsetHeader || !isHomepage) && (
                  <Button onClick={handleBook} variant="dark" bg={color}>
                    Book Now
                  </Button>
                )} */}
              </Flex>
            </Flex>
            <Flex flex={1} justify="flex-end">
              {(offsetHeader || !isHomepage) && (
                <Button onClick={handleBook} variant="dark" bg={color}>
                  Book Now
                </Button>
              )}
            </Flex>
          </Flex>
        ) : (
          <Flex justify="space-between" align="center">
            <Box>
              <IoMenuSharp size={32} color={handleActiveColor} />
            </Box>
            <Button
              onClick={handleBook}
              variant={offsetHeader || !isHomepage ? `dark` : `light`}
              bg={offsetHeader || !isHomepage ? color : `white`}
              color={offsetHeader || !isHomepage ? `white` : color}
            >
              Book Now
            </Button>
          </Flex>
        )}
      </Box>
    </Center>
  );
}
