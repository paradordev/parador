import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Section from "../layout/Section";
import { safeMarginX } from "../utils/mediaQuery";

export default function SectionDetailInfo({
  color = "black",
  location = "",
  phone = "",
  hours = "",
}) {
  const { locale } = useRouter();

  return (
    <Section variant="zero" bg="white" px={safeMarginX} py={[10, 20, 30]}>
      <SimpleGrid
        columns={[2, 3, 4]}
        spacing={10}
        color="blackAlpha.800"
        fontSize="sm"
      >
        <Heading
          mb={2}
          as="h1"
          fontWeight={400}
          letterSpacing="wider"
          color={color}
        >
          Detail INFO
        </Heading>

        <Box h="100%" w="100%" pr={5}>
          <Text>{location}</Text>
        </Box>

        <Box h="100%" w="100%" pr={5}>
          <Text>Tel : {phone}</Text>
        </Box>

        <Box h="100%" w="100%" pr={5}>
          <Text>{locale == "id" ? "Jam Operasional:" : "Hours:"}</Text>
          <Text whiteSpace="pre-line">{hours}</Text>
        </Box>
      </SimpleGrid>
    </Section>
  );
}
