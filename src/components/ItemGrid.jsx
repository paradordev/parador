import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function ItemGrid({
  id,
  thumb,
  title,
  desc,
  buttonType = "outline",
  color = "black",
  target = "",
  hasAdditionalInfo = false,
}) {
  const router = useRouter();

  return (
    <Flex
      direction="column"
      w="100%"
      justify="space-between"
      gap={4}
      letterSpacing="wide"
    >
      <Flex direction="column" gap={4} color="blackAlpha.700">
        <Box
          h="60vh"
          w="100%"
          position="relative"
          cursor="pointer"
          onClick={() => router.push(target)}
        >
          <Image layout="fill" alt="" src={thumb} objectFit="cover" />
        </Box>
        <Heading
          as="h2"
          fontWeight={400}
          fontSize="xl"
          letterSpacing={4}
          color="black"
          mt={3}
          className="max-text-1-line"
        >
          {title}
        </Heading>
        <Text fontSize="sm" letterSpacing={0.2} lineHeight={1.2} noOfLines={2}>
          {desc}
        </Text>
      </Flex>
      <Flex gap={4}>
        {/* <Button variant="dark">BOOK NOW</Button> */}
        <Button
          variant="outlineWhite"
          color={color}
          borderColor={color}
          _hover={{ bg: color, color: "white" }}
          onClick={() => router.push(target)}
        >
          {router.locale == "id" ? "Lebih Lengkap" : "See More"}
        </Button>
      </Flex>
    </Flex>
  );
}
