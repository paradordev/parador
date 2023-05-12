import { Box, Button, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { formatRupiah } from "../utils/functions";

export default function ItemGridHotel({
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
    <Flex
      direction="column"
      w="100%"
      justify="space-between"
      gap={3}
      letterSpacing="wide"
    >
      <Box>
        <Flex direction="column" gap={1} color="blackAlpha.700" justify="s">
          <Box
            h="60vh"
            w="100%"
            position="relative"
            bg="gray.300"
            onClick={() => router.push(`/${slug}`)}
            cursor="pointer"
          >
            {thumb && (
              <Image layout="fill" alt="" src={thumb} objectFit="cover" />
            )}
          </Box>

          <Heading
            as="h2"
            fontWeight={400}
            fontSize="xl"
            letterSpacing={4}
            color="black"
            mt={5}
            className="max-text-1-line"
          >
            {title}
          </Heading>
          <Text fontSize="sm" mt={2}>
            {router.locale == "id" ? "Harga mulai" : "Start from"}{" "}
            <strong>{price ? formatRupiah(price) : `[price]`}</strong>
          </Text>
        </Flex>
        <Flex mt={3}>
          <Divider orientation="horizontal" borderColor="blackAlpha.400" />
        </Flex>
      </Box>

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

      <Flex gap={4} mt={2}>
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
  );
}
