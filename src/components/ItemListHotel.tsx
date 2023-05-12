import { Box, Button, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { formatRupiah } from "../utils/functions";

export default function ItemListHotel({
  id,
  thumb,
  title,
  desc,
  color = "black",
  benefits = [],
  price = 0,
  slug,
}: {
  id: string | number;
  thumb: string | undefined;
  title: string;
  desc: string | null | undefined;
  price: string | number;
  slug: string;
  color?: string;
  benefits: Array<any>;
}) {
  const router = useRouter();

  return (
    <Flex h="100%" w="100%" gap={10} letterSpacing="wide">
      <Box
        h="60vh"
        w="65%"
        position="relative"
        cursor="pointer"
        onClick={() => router.push(`/${slug}`)}
      >
        {thumb && <Image layout="fill" alt="" src={thumb} objectFit="cover" />}
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
          <Text fontSize="sm" mt={2}>
            {router.locale == "id" ? "Harga mulai" : "Start from"}{" "}
            <strong>{price ? formatRupiah(price) : `[price]`}</strong>
          </Text>

          <Flex>
            <Divider orientation="horizontal" borderColor="blackAlpha.400" />
          </Flex>

          {benefits.length > 0 && (
            <Flex
              align="center"
              color="blackAlpha.700"
              rowGap={1}
              columnGap={6}
              flexWrap="wrap"
            >
              <Flex align="center" fontSize="small" gap={2}>
                <FaMapMarkerAlt color="inherit" size={12} />
                <Text>{benefits[0]}</Text>
              </Flex>
              <Flex align="center" fontSize="small" gap={2}>
                <FaPhoneAlt color="inherit" size={12} />
                <Text>{benefits[1]}</Text>
              </Flex>
              <Flex align="center" fontSize="small" gap={2}>
                <FaEnvelope color="inherit" size={12} />
                <Text>{benefits[2]}</Text>
              </Flex>
            </Flex>
          )}
          <Flex gap={4} mt={4}>
            <Button
              variant="outlineWhite"
              color={color}
              _hover={{ bg: color, color: "white" }}
              borderColor={color}
              onClick={() => router.push(`/${slug}`)}
            >
              {router.locale == "id" ? "Lebih Lengkap" : "See More"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
