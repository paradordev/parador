import {
  AspectRatio,
  Button,
  Flex,
  Heading,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { formatRupiah } from "../utils/functions";

export default function ItemGridStore({
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
    <Flex
      direction="column"
      w="100%"
      justify="space-between"
      gap={2}
      letterSpacing="wide"
    >
      <Flex direction="column" gap={2} color="blackAlpha.700">
        <AspectRatio
          ratio={4 / 3}
          maxW="100%"
          position="relative"
          cursor="pointer"
          onClick={() => router.push(`/shop/detail?product=${slug}`)}
        >
          {thumb ? (
            <Image layout="fill" alt="" src={thumb} objectFit="cover" />
          ) : (
            <Flex bg="gray.100" />
          )}
        </AspectRatio>
        <Tooltip label={title}>
          <Heading
            as="h4"
            fontWeight={400}
            fontSize="13px"
            letterSpacing={1}
            color="black"
            mt={3}
            noOfLines={2}
          >
            {title}
          </Heading>
        </Tooltip>
        <Text fontSize="sm">
          <strong>{formatRupiah(price)}</strong>
        </Text>
        <Text fontSize="sm" letterSpacing={0.2} lineHeight={1.2} noOfLines={2}>
          {desc}
        </Text>
      </Flex>
      <Flex gap={4}>
        <Button
          variant="outline"
          bg="white"
          color={`black`}
          borderColor={`black`}
          _hover={{ bg: "black", color: "white" }}
          onClick={() => router.push(`/shop/detail?product=${slug}`)}
        >
          {router.locale == "id" ? "Lebih Lengkap" : "See More"}
        </Button>
      </Flex>
    </Flex>
  );
}
