import {
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  Select,
  SimpleGrid,
} from "@chakra-ui/react";
import Section from "../layout/Section";
import {
  IoGridOutline,
  IoGridSharp,
  IoListOutline,
  IoListSharp,
} from "react-icons/io5";
import { useState } from "react";
import ItemGrid from "./ItemGrid";
import ItemList from "./ItemList";
import { useRouter } from "next/router";

export default function SectionViewRoom({
  title = "",
  enableFilter = false,
  view = "grid",
  items = [],
  color = "black",
  targetItems = [],
}) {
  const { locale } = useRouter();

  const { isLarge } = useLargeQuery();

  const [viewAs, setViewAs] = useState(
    items.length > 2 || !isLarge ? "grid" : "list"
  );

  return (
    <Section bg="white">
      <Flex justify="space-between" align="center">
        <Heading
          mb={2}
          as="h1"
          fontWeight={500}
          letterSpacing="wider"
          color={color}
        >
          {title}
        </Heading>
        <Flex align="center" color="blackAlpha.600" gap={4}>
          <Box onClick={() => setViewAs("list")} cursor="pointer">
            <IoListOutline
              color={viewAs === "list" ? color : `inherit`}
              size={28}
            />
          </Box>
          <Box onClick={() => setViewAs("grid")} cursor="pointer">
            <IoGridOutline
              color={viewAs === "grid" ? color : `inherit`}
              size={22}
            />
          </Box>
          {enableFilter && (
            <>
              <Center h="20px">
                <Divider
                  borderColor="blackAlpha.500"
                  opacity={1}
                  orientation="vertical"
                />
              </Center>
              <Select fontSize="sm" border="none" _focus={{}}>
                <option>{locale == "id" ? "TERBARU" : "LATEST"}</option>
              </Select>
            </>
          )}
        </Flex>
      </Flex>

      {viewAs === "grid" && (
        <SimpleGrid columns={[2, null, 3]} spacing={8}>
          {items &&
            items.length > 0 &&
            items.map(({ thumb, title, desc, _ID }, i) => (
              <ItemGrid
                key={i}
                thumb={thumb}
                title={title}
                desc={desc}
                id={_ID}
                color={color}
                target={targetItems[i]}
              />
            ))}
        </SimpleGrid>
      )}

      {viewAs === "list" && (
        <Flex direction="column" gap={[6, 12]}>
          {items &&
            items.length > 0 &&
            items.map(({ thumb, title, desc, _ID }, i) => (
              <ItemList
                key={i}
                thumb={thumb}
                title={title}
                desc={desc}
                id={_ID}
                color={color}
                target={targetItems[i]}
              />
            ))}
        </Flex>
      )}
    </Section>
  );
}
