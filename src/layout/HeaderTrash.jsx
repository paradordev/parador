import { PhoneIcon, Search2Icon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {
  IoCallOutline,
  IoLocationOutline,
  IoPersonOutline,
  IoGlobeOutline,
} from "react-icons/io5";

function Header({ data }, ref) {
  const { logo_light, name, location_short, phone } = data;

  const topContainer = useRef(null);
  const bottomContainer = useRef(null);

  const [onTop, setOnTop] = useState(true);
  const [offsetHeader, setOffsetHeader] = useState(false);

  useEffect(() => {
    if (!topContainer) return;
    headerClass();
    window.onscroll = function () {
      headerClass();
    };
  }, []);

  const headerClass = () => {
    if (window.pageYOffset > topContainer.current.offsetHeight) {
      setOffsetHeader(true);
    } else {
      setOffsetHeader(false);
    }
  };

  return (
    <Flex direction="column" ref={ref}>
      <Center position="relative" px={100} ref={topContainer}>
        <Box
          zIndex={999}
          w="100%"
          maxW={1400}
        >
          <Flex alignItems="flex-end" color="whiteAlpha.800" fontSize="xs">
            <Flex flex={1} justifyContent="flex-start" direction="column">
              <Flex alignItems="center" gap={2}>
                <IoLocationOutline />
                <Text>{location_short}</Text>
              </Flex>
              <Flex alignItems="center" gap={2}>
                <IoCallOutline />
                <Text>{phone}</Text>
              </Flex>
            </Flex>
            <Flex flex={2} justifyContent="center">
              <Image
                src={logo_light}
                alt="logo"
                width={300}
                height={90}
                objectFit="contain"
              />
            </Flex>
            <Flex flex={1} justifyContent="flex-end" ml="auto">
              <Flex alignItems="center" justifyContent="flex-end" gap={4}>
                <Image
                  src="http://prdr.bigkuma.com/wp-content/uploads/2022/04/Privilege-Guest-Logo-2.png"
                  alt=""
                  width="100%"
                  height={30}
                  objectFit="contain"
                />
                <Center height="20px">
                  <Divider
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
                    orientation="vertical"
                    // opacity={1}
                  />
                </Center>
                <Flex alignItems="center" gap={1}>
                  <IoGlobeOutline />
                  <Text>English</Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <Divider
            mt={3}
            borderWidth={0.5}
            py={0.1}
            // opacity={1}
            borderColor="white"
            bg="white"
            orientation="horizontal"
          />
          {/* <Flex alignItems="flex-end"></Flex> */}
        </Box>
      </Center>
      <Flex
        py={2}
        ref={bottomContainer}
        className={`nav-conatiner ${offsetHeader ? `nav-sticky` : ``}`}
      >
        <Flex alignItems="center" w="100%" maxW={1400}>
          <InputGroup className="search-container" flex={1}>
            <SearchIcon
              fontSize="xl"
              color={offsetHeader ? `black` : `white`}
            />
            <Input
              variant="filled"
              bg="transparent"
              color={offsetHeader ? `black` : `white`}
              type="tel"
              focusBorderColor={offsetHeader ? `black` : `white`}
              placeholder="SEARCH"
              mx={2}
              pl={2}
            />
          </InputGroup>
          <Box flex={2} mx={6}>
            <Flex
              color={offsetHeader ? `black` : `white`}
              gap={10}
              fontSize="sm"
              fontWeight={500}
            >
              <Text>Hotels</Text>
              <Text>Special Offers</Text>
              <Text>Dining</Text>
              <Text>Meeting & Events</Text>
              <Text>Wedding</Text>
              <Text>Store</Text>
              <Text>Contact Us</Text>
            </Flex>
          </Box>
          <Box flex={1}></Box>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default React.forwardRef(Header);
