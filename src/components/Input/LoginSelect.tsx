import {
  AbsoluteCenter,
  Box,
  Divider,
  Flex,
  Text,
  useOutsideClick,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactNode, useRef, useState } from "react";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";

export default function LoginSelect({
  icon,
  placeHolder,
  items,
}: {
  icon: ReactNode | null;
  placeHolder: string;
  items: Array<any>;
}) {
  const { pathname, asPath, query, push, locale } = useRouter();

  const modalRef = useRef<any>(null);

  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [hoverOption, setHoverOption] = useState(0);

  useOutsideClick({
    ref: modalRef,
    handler: () => setIsOptionsOpen(false),
  });

  return (
    <Box ref={modalRef}>
      <Flex
        alignItems="center"
        gap={1}
        justifyContent="space-evenly"
        onClick={() => {
          setIsOptionsOpen(!isOptionsOpen);
        }}
        cursor="pointer"
      >
        {icon}
        <Box w="100%">
          <Text>{placeHolder}</Text>
        </Box>
      </Flex>

      {isOptionsOpen && (
        <Box
          zIndex={1}
          position="absolute"
          // top={`160px`}
          top={14}
          right={`7.5rem`}
          bg="white"
          color="blackAlpha.800"
          fontSize="md"
          minW={220}
          px={6}
          py={4}
          borderBottomRadius="10px"
          display="flex"
          flexDir="column"
          gap={2}
          className="header-box-shadows"
        >
          <AbsoluteCenter
            top={-1.5}
            style={{
              width: 0,
              height: 0,
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderBottom: "12px solid white",
            }}
          />
          <Box
            onClick={() => {
              hoverOption != 1 ? setHoverOption(1) : setHoverOption(0);
            }}
            cursor="pointer"
            _hover={{
              color: "black",
            }}
          >
            <Flex align="center" justify="space-between">
              <Text>{locale == "id" ? "Individu" : "Individual"}</Text>
              {hoverOption == 1 ? <IoChevronDown /> : <IoChevronForward />}
            </Flex>

            {hoverOption == 1 && (
              <Flex
                letterSpacing="wider"
                mt={2}
                ml={3}
                flexDir="column"
                justify="space-between"
                gap={1}
                color="blackAlpha.800"
              >
                <Text
                  cursor="pointer"
                  _hover={{
                    color: "black",
                  }}
                  onClick={() => {
                    window.open(
                      `${process.env.NEXT_PUBLIC_URL_HOTEL_ENGINE}/signin?chain=28800&level=chain`,
                      `_blank`
                    );
                    setHoverOption(0);
                    setIsOptionsOpen(false);
                  }}
                >
                  {locale == "id" ? "Masuk" : "Login"}
                </Text>
                <Flex>
                  <Divider orientation="horizontal" />
                </Flex>
                <Text
                  cursor="pointer"
                  onClick={() => {
                    window.open(
                      `${process.env.NEXT_PUBLIC_URL_HOTEL_ENGINE}/sign-up?chain=28800&level=chain`,
                      `_blank`
                    );
                    setHoverOption(0);
                    setIsOptionsOpen(false);
                  }}
                  _hover={{
                    color: "black",
                  }}
                >
                  {locale == "id" ? "Daftar" : "Register"}
                </Text>
              </Flex>
            )}
          </Box>

          <Flex>
            <Divider orientation="horizontal" />
          </Flex>

          <Box
            onClick={() => {
              hoverOption != 2 ? setHoverOption(2) : setHoverOption(0);
            }}
            cursor="pointer"
            _hover={{
              color: "black",
            }}
          >
            <Flex align="center" justify="space-between">
              <Text>{locale == "id" ? "Perusahaan" : "Company"}</Text>
              {hoverOption == 2 ? <IoChevronDown /> : <IoChevronForward />}
            </Flex>

            {hoverOption == 2 && (
              <Flex
                // textTransform="uppercase"
                letterSpacing="wider"
                mt={2}
                ml={3}
                flexDir="column"
                justify="space-between"
                gap={1}
                color="blackAlpha.800"
              >
                <Text
                  _hover={{
                    color: "black",
                  }}
                  cursor="pointer"
                  onClick={() => {
                    window.open(
                      `https://cbt.synxis.com/?chainId=28800`,
                      `_blank`
                    );
                    setHoverOption(0);
                    setIsOptionsOpen(false);
                  }}
                >
                  {locale == "id" ? "Masuk" : "Login"}
                </Text>
                <Flex>
                  <Divider orientation="horizontal" />
                </Flex>
                <Text
                  cursor="pointer"
                  onClick={() => {
                    setHoverOption(0);
                    setIsOptionsOpen(false);
                    push(`/register`);
                  }}
                  _hover={{
                    color: "black",
                  }}
                >
                  {locale == "id" ? "Daftar" : "Register"}
                </Text>
              </Flex>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
