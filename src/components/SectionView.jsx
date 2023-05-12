import {
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  Select,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { filter, reject } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoGridOutline, IoListOutline } from "react-icons/io5";
import Section from "../layout/Section";
import {
  safeMarginDesc,
  safeMarginX,
  useLargeQuery,
} from "../utils/mediaQuery";
import ItemGrid from "./ItemGrid";
import ItemGridHotel from "./ItemGridHotel";
import ItemGridMeeting from "./ItemGridMeeting";
import ItemGridRoom from "./ItemGridRoom";
import ItemList from "./ItemList";
import ItemListHotel from "./ItemListHotel";
import ItemListMeeting from "./ItemListMeeting";
import ItemListRoom from "./ItemListRoom";
import ItemNotFound from "./ItemNotFound";

export default function SectionView({
  title = "",
  enableFilter = false,
  view = "grid",
  items = [],
  color = "black",
  targetItems = [],
  type = "default",
  hasCategory = false,
  categories = [],
  isManualTarget = false,
  defaultCategory = "all",
}) {
  const { isReady, query, locale } = useRouter();

  const { isLarge } = useLargeQuery();

  const [selectedCategory, setSelectedCategory] = useState(
    categories.length > 0 ? defaultCategory : null
  );

  const [selectedItems, setSelectedItems] = useState(hasCategory ? [] : items);

  const [selectedType, setSelectedType] = useState(type);

  const [viewAs, setViewAs] = useState(
    hasCategory ? "grid" : items.length > 2 || !isLarge ? "grid" : "list"
  );

  useEffect(() => {
    if (!hasCategory) return;

    if (selectedCategory == categories[0]) {
      const temp = reject(items, { category: "Venue" });
      setSelectedItems(temp);
    } else {
      const temp = filter(items, { category: selectedCategory });
      setSelectedItems(temp);
    }
  }, [selectedCategory, isReady]);

  useEffect(() => {
    if (!hasCategory) return;

    setViewAs(selectedItems.length > 2 || !isLarge ? "grid" : "list");
  }, [selectedItems, selectedCategory, isLarge]);

  useEffect(() => {
    if (!hasCategory) {
      setSelectedItems(items);
      setViewAs(items.length > 2 || !isLarge ? "grid" : "list");
    }
  }, [isReady, items, isLarge]);

  return (
    <Section
      bg="white"
      variant="zero"
      px={safeMarginX}
      mt={5}
      mb={safeMarginDesc}
    >
      <Flex justify="space-between" align="center">
        <Heading
          mb={2}
          as="h1"
          fontWeight={400}
          letterSpacing="wider"
          color={color}
        >
          {title}
        </Heading>
        <Flex align="center" color="blackAlpha.600" gap={4}>
          {isLarge && (
            <>
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
            </>
          )}

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

      {hasCategory && (
        <Flex gap={[4, 6, 8, 10]} mb={2}>
          {categories.map((cat) => {
            const isSelected = cat === selectedCategory;
            let showCat;

            if (locale == "id") {
              if (cat == "all") showCat = "semua";
              if (cat == "Meeting Package") showCat = "Paket Rapat";
              if (cat == "Social Events") showCat = "Acara Sosial";
              if (cat == "Venue") showCat = "Venue";
            } else {
              showCat = cat;
            }
            return (
              <Text
                textTransform="uppercase"
                key={cat}
                fontSize={["small", "md", "lg", "2xl"]}
                fontWeight={isSelected ? 500 : 400}
                cursor="pointer"
                color={isSelected ? "blackAlpha.900" : "blackAlpha.600"}
                textDecoration={isSelected ? `underline` : `none`}
                _hover={{ textDecoration: "underline" }}
                onClick={() => {
                  setSelectedCategory(cat);
                }}
              >
                {showCat}
              </Text>
            );
          })}
        </Flex>
      )}

      {selectedItems.length > 0 ? (
        <>
          {viewAs === "grid" && (
            <SimpleGrid columns={[1, 1, 2, 2, 3]} spacing={[12, 10, 8]}>
              {selectedItems.map((item, i) => {
                if (type == "default")
                  return (
                    <ItemGrid
                      key={i}
                      thumb={item.thumb}
                      title={item.title}
                      desc={item.desc}
                      id={item._ID}
                      color={color}
                      target={targetItems[i]}
                    />
                  );
                else if (type == "rooms")
                  return (
                    <ItemGridRoom
                      key={i}
                      thumb={item.thumb}
                      title={item.title}
                      desc={item.desc}
                      id={item._ID}
                      color={color}
                      target={targetItems[i]}
                      benefits={[
                        item.total_guest,
                        item.bed_type,
                        item.room_size,
                      ]}
                      price={item.start_from}
                    />
                  );
                else if (type == "meeting")
                  return (
                    <ItemGridMeeting
                      key={i}
                      thumb={item.thumb}
                      title={item.title}
                      desc={item.desc}
                      id={item._ID}
                      color={color}
                      target={`/${query.hid}/meeting-events/detail?id=${item._ID}`}
                      benefits={[item.total_person, item.room_size]}
                      category={item.category}
                    />
                  );
                else if (type == "hotels")
                  return (
                    <ItemGridHotel
                      key={i}
                      thumb={item.thumb}
                      title={item.title}
                      id={item._ID}
                      color={color}
                      benefits={[item.location, item.phone, item.email]}
                      price={item.start_from}
                      slug={item.slug}
                    />
                  );
              })}
            </SimpleGrid>
          )}
          {viewAs === "list" && (
            <Flex direction="column" gap={[6, 12]}>
              {selectedItems.map((item, i) => {
                if (type == "default")
                  return (
                    <ItemList
                      key={i}
                      thumb={item.thumb}
                      title={item.title}
                      desc={item.desc}
                      id={item._ID}
                      color={color}
                      target={targetItems[i]}
                    />
                  );
                else if (type == "rooms")
                  return (
                    <ItemListRoom
                      key={i}
                      thumb={item.thumb}
                      title={item.title}
                      desc={item.desc}
                      id={item._ID}
                      color={color}
                      target={targetItems[i]}
                      benefits={[
                        item.total_guest,
                        item.bed_type,
                        item.room_size,
                      ]}
                      price={item.start_from}
                    />
                  );
                else if (type == "meeting")
                  return (
                    <ItemListMeeting
                      key={i}
                      thumb={item.thumb}
                      title={item.title}
                      desc={item.desc}
                      id={item._ID}
                      color={color}
                      target={`/${query.hid}/meeting-events/detail?id=${item._ID}`}
                      benefits={[item.total_person, item.room_size]}
                      category={item.category}
                    />
                  );
                else if (type == "hotels")
                  return (
                    <ItemListHotel
                      key={i}
                      thumb={item.thumb}
                      title={item.title}
                      id={item._ID}
                      color={color}
                      benefits={[item.location, item.phone, item.email]}
                      price={item.start_from}
                      slug={item.slug}
                    />
                  );
              })}
            </Flex>
          )}
        </>
      ) : (
        <ItemNotFound />
      )}
    </Section>
  );
}
