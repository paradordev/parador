import { AbsoluteCenter, Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { IoArrowForward } from "react-icons/io5";
import { convertImgHttps } from "../utils/functions";
import { cardWidthQuery } from "../utils/mediaQuery";

export default function CardLogo({
  primary,
  secondary,
  thumb,
  logo,
  target,
  type = "hotel",
}) {
  const router = useRouter();
  const [isHover, setIsHover] = useState(false);

  return (
    <Flex
      direction="column"
      w="100%"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => router.push(target)}
      cursor="pointer"
      gap={2}
      alignItems="left"
    >
      <Box position="relative" bg="grey.300" w="100%">
        <AbsoluteCenter
          zIndex={6}
          h={type == "dining" ? "45%" : "50%"}
          w={type == "dining" ? "65%" : "45%"}
        >
          <Box position="relative" h="100%" w="100%">
            <Image
              src={convertImgHttps(logo)}
              alt={`${primary} - ${secondary} logo`}
              layout="fill"
              objectFit="contain"
            />
          </Box>
        </AbsoluteCenter>
        <AbsoluteCenter
          bg={isHover ? `blackAlpha.700` : `blackAlpha.400`}
          zIndex={5}
          h={cardWidthQuery}
          w="100%"
          transition="all 1s cubic-bezier(0.33, 1, 0.68, 1)"
        />
        <Box position="relative" h={cardWidthQuery} w="100%">
          <Image
            src={convertImgHttps(thumb)}
            alt={`${primary} - ${secondary} thumb`}
            objectFit="cover"
            layout="fill"
          />
        </Box>
      </Box>
      <Flex maxW="100%" align="center" gap={2}>
        <Text noOfLines={1} fontSize="sm" textTransform="uppercase">
          <strong>{primary}</strong> - {secondary}
        </Text>
        <IoArrowForward fontWeight={300} size={20} />
      </Flex>
    </Flex>
  );
}
