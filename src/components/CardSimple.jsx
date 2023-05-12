import { AspectRatio, Box, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { convertImgHttps } from "../utils/functions";
import LinkTo from "./LinkTo";

export default function CardSimple({ name, thumb, desc, isMain, target }) {
  const { push, locale } = useRouter();
  return (
    <Box
      h={
        isMain
          ? { base: `55vh`, sm: `58vh`, md: `60vh`, xl: `66vh` }
          : { base: `100%`, lg: `66vh` }
      }
      cursor="pointer"
      onClick={() => {
        push(target);
      }}
    >
      {isMain ? (
        <Box h="100%" position="relative">
          <Box
            position="absolute"
            bottom={0}
            left={0}
            zIndex={3}
            w="100%"
            h="100%"
          >
            <Flex
              justify="flex-end"
              direction="column"
              color="white"
              p="6%"
              h="100%"
              gap={4}
            >
              <Heading as="h3" fontSize="xl" fontWeight={400}>
                {name}
              </Heading>
              <Text fontSize="md" className="max-text-2-line" color="gray.200">
                {desc}
              </Text>
              <Box>
                <LinkTo
                  fontSize="sm"
                  color="gray.300"
                  to={target}
                  activeColor={"gray.300"}
                >
                  {locale == "id" ? `Lebih Lanjut` : `Learn More`}
                </LinkTo>
              </Box>
            </Flex>
          </Box>
          <Box
            position="absolute"
            bg="blackAlpha.500"
            bottom={0}
            zIndex={2}
            height="100%"
            width="100%"
            background="linear-gradient(0deg, rgba(0,0,0,0.7) 15%, rgba(0,0,0,0) 75%)"
          />
          <Image
            zIndex={1}
            h="100%"
            w="100%"
            objectFit="cover"
            src={convertImgHttps(thumb)}
            alt=""
          />
        </Box>
      ) : (
        <Flex
          direction="column"
          // justify="space-between"
          h="100%"
          cursor="pointer"
          onClick={() => {
            push(target);
          }}
          gap={4}
        >
          <Flex direction="column" gap={4}>
            <AspectRatio ratio={1}>
              <Image src={convertImgHttps(thumb)} alt="" objectFit="cover" />
            </AspectRatio>
            <Heading as="h3" fontSize="xl" fontWeight={400} noOfLines={1}>
              {name}
            </Heading>
            <Text
              fontSize="md"
              className="max-text-2-line"
              color="gray.600"
              h="3rem"
            >
              {desc}
            </Text>
          </Flex>
          <Box>
            <LinkTo
              activeColor={"gray.300"}
              fontSize="sm"
              color="gray.400"
              mt={[3, 0]}
              to={target}
            >
              {locale == "id" ? `Lebih Lanjut` : `Learn More`}
            </LinkTo>
          </Box>
        </Flex>
      )}
    </Box>
  );
}
