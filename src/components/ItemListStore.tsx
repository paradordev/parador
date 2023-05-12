import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { formatRupiah } from "../utils/functions";

export default function ItemListStore({
  id,
  thumb,
  title,
  desc,
  price,
  slug,
}: {
  id: string | number;
  thumb: string | undefined;
  title: string;
  desc: string | null | undefined;
  price: string;
  slug: string;
}) {
  const router = useRouter();

  return (
    <Flex h="100%" w="100%" gap={10} letterSpacing="wide">
      <Box
        h="60vh"
        w="65%"
        position="relative"
        cursor="pointer"
        onClick={() => router.push(`/shop/detail?product=${slug}`)}
      >
        {thumb ? (
          <Image layout="fill" alt="" src={thumb} objectFit="cover" />
        ) : (
          <Flex bg="gray.100" />
        )}
      </Box>
      <Flex w="35%" align="center">
        <Flex direction="column" gap={2} color="blackAlpha.700">
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
          <Text fontSize="sm">
            <strong>{formatRupiah(price)}</strong>
          </Text>
          <Text fontSize="sm" letterSpacing={0.2} lineHeight={1.2}>
            {desc}
          </Text>
          <Flex gap={4} mt={4}>
            <Button
              variant="outlineWhite"
              color={`black`}
              _hover={{ bg: "black", color: "white" }}
              borderColor={`black`}
              onClick={() => router.push(`/shop/detail?product=${slug}`)}
            >
              {router.locale == "id" ? "Lebih Lengkap" : "See More"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
