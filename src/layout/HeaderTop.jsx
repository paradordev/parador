import { Box, Center, Divider, Flex, Select, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import {
  IoCallOutline,
  IoGlobeOutline,
  IoLocationOutline,
  IoPersonOutline,
} from "react-icons/io5";
import privilegeLogo from "../assets/images/Privilege-Guest-Logo-2.png";
import privilegeDark from "../assets/images/Privilege-logo-dark.webp";
import { convertImgHttps } from "../utils/functions";
import { safeMarginX, useLargeQuery } from "../utils/mediaQuery";

function HeaderTop({ data, isHomepage }, ref) {
  const router = useRouter();
  const { pathname, query, locale, locales, asPath } = useRouter();
  const { isLarge } = useLargeQuery();
  const { logo_light, logo_dark, brand, location_short, phone } = data;

  return (
    <Flex
      ref={ref}
      zIndex={1000}
      position="relative"
      top={0}
      className="header-top-container"
      pt={1}
    >
      <Center position="relative" mx={safeMarginX} w="100vw">
        <Box w="100%">
          <Flex
            alignItems="flex-end"
            color={isHomepage ? `whiteAlpha.800` : `black`}
            fontSize="xs"
          >
            <Box
              display={{ base: "none", md: "flex" }}
              flex={1}
              justifyContent="flex-start"
              flexDir="column"
            >
              <Flex alignItems="center" gap={2}>
                <IoLocationOutline />
                <Text>{location_short}</Text>
              </Flex>
              <Flex alignItems="center" gap={2}>
                <IoCallOutline />
                <Text>{phone}</Text>
              </Flex>
            </Box>
            <Flex
              flex={1}
              justifyContent="center"
              position="relative"
              h={{ base: "50px", lg: "70px" }}
              w={{ base: "120px", lg: "240px" }}
            >
              <Image
                onClick={() => {
                  router.push("/");
                }}
                style={{ cursor: "pointer" }}
                src={
                  isHomepage
                    ? convertImgHttps(logo_light)
                    : convertImgHttps(logo_dark)
                }
                alt="logo"
                layout="fill"
                // width={300}
                // height={90}
                objectFit="contain"
              />
            </Flex>
            <Flex
              flex={1}
              justifyContent="flex-end"
              ml="auto"
              display={{ base: "none", md: "flex" }}
            >
              <Flex alignItems="center" justifyContent="flex-end" gap={4}>
                <Image
                  src={isHomepage ? privilegeLogo : privilegeDark}
                  alt=""
                  width="100%"
                  height={30}
                  objectFit="contain"
                />
                <Center height="20px">
                  <Divider
                    borderColor={
                      isHomepage ? `whiteAlpha.700` : `blackAlpha.700`
                    }
                    orientation="vertical"
                    // opacity={1}
                  />
                </Center>
                <Flex alignItems="center" gap={1}>
                  <IoPersonOutline />
                  <Text>Log In</Text>
                </Flex>
                <Center height="20px">
                  <Divider
                    borderColor={
                      isHomepage ? `whiteAlpha.700` : `blackAlpha.700`
                    }
                    orientation="vertical"
                    // opacity={1}
                  />
                </Center>
                <Box>
                  <Flex alignItems="center" gap={1}>
                    <IoGlobeOutline />
                    <Select
                      border={0}
                      fontSize="xs"
                      icon=""
                      m={0}
                      p={0}
                      _focus={{}}
                      cursor="pointer"
                      onChange={(e) => {
                        router.push(`/${e.target.value}/${asPath}`);
                        // asPath, {
                        //   locale: e.target.value,
                        // });
                      }}
                    >
                      <option value="en">English</option>
                      <option value="id">Indonesia</option>
                    </Select>
                    {/* <Text>English</Text> */}
                  </Flex>
                  {/* <InputSelect /> */}
                </Box>
              </Flex>
            </Flex>
          </Flex>
          <Divider
            mt={[3, 5]}
            borderColor={isHomepage ? `white` : `blackAlpha.400`}
            bg={isHomepage ? `white` : `blackAlpha.400`}
            orientation="horizontal"
          />
          {/* <Flex alignItems="flex-end"></Flex> */}
        </Box>
      </Center>
    </Flex>
  );
}

function InputSelect() {
  return (
    <Flex
      direction="column"
      position="absolute"
      whiteSpace="nowrap"
      bg="blackAlpha.800"
      zIndex={1001}
      right={0}
      bottom={-16}
      px={4}
      py={3}
      gap={2}
    >
      <Text cursor="pointer">English</Text>
      <Divider />
      <Text cursor="pointer">Bahasa Indonesia</Text>
    </Flex>
  );
}

export default React.forwardRef(HeaderTop);
