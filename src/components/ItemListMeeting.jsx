import { Box, Button, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { FaRulerCombined, FaUser } from "react-icons/fa";

export default function ItemListMeeting({
  id,
  thumb,
  title,
  desc,
  buttonType = "outline",
  color = "black",
  target = "",
  benefits = [],
  category,
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

          {category !== "Social Events" && (
            <>
              <Flex>
                <Divider
                  orientation="horizontal"
                  borderColor="blackAlpha.400"
                />
              </Flex>

              {benefits.length > 0 && (
                <Flex align="center" color="blackAlpha.700" gap={6}>
                  <Flex align="center" fontSize="small" gap={2}>
                    <FaUser color="inherit" size={12} />
                    <Text>{benefits[0]}</Text>
                  </Flex>
                  <Flex align="center" fontSize="small" gap={2}>
                    <FaRulerCombined color="inherit" size={12} />
                    <Text>{benefits[1]} m²</Text>
                  </Flex>
                </Flex>
              )}
            </>
          )}

          <Flex gap={4} mt={4}>
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
