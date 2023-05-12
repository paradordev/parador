import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function ItemList({
  id,
  thumb,
  title,
  desc,
  buttonType = "outline",
  color = "black",
  target = "",
}) {
  const router = useRouter();

  return (
    <Flex h="100%" w="100%" gap={10} letterSpacing="wide">
      <Box
        h="60vh"
        w="65%"
        position="relative"
        cursor="pointer"
        onClick={() => router.push(target)}
      >
        <Image layout="fill" alt="" src={thumb} objectFit="cover" />
      </Box>
      <Flex w="35%" align="center">
        <Flex direction="column" gap={4} color="blackAlpha.700">
          <Heading
            as="h2"
            fontWeight={400}
            fontSize="xl"
            letterSpacing={4}
            color="black"
            mt={3}
          >
            {title}
          </Heading>
          <Text fontSize="sm" letterSpacing={0.2} lineHeight={1.2}>
            {desc}
          </Text>
          <Flex gap={4} mt={4}>
            {/* <Button variant="dark">BOOK NOW</Button> */}
            <Button
              variant="outlineWhite"
              color={color}
              _hover={{ bg: color, color: "white" }}
              borderColor={color}
              onClick={() => router.push(target)}
            >
              {router.locale == "id" ? "Lebih Lengkap" : "See More"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
