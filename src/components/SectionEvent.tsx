import { Box, Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Section from "../layout/Section";
import CardSimple from "./CardSimple";

export default function SectionEvent({
  color = "black",
  items,
}: {
  color: string;
  items: {
    thumbnail: string | null | undefined;
    title: string;
    desctiption: string;
    target: string;
  }[];
}) {
  const { locale } = useRouter();
  return (
    <Section bg="white">
      <Box>
        <Heading
          mb={8}
          color={color}
          as="h1"
          fontWeight={400}
          letterSpacing="wider"
        >
          {locale == "id" ? "RAPAT & ACARA" : "MEETING & EVENTS"}
        </Heading>
        <Flex gap={6} flexWrap="wrap">
          {items.map(({ title, desctiption, target, thumbnail }, i) => {
            if (i == 0) {
              return (
                <Box
                  key={i}
                  flex={items.length == 3 ? 2 : 1}
                  flexBasis={{ base: `100%`, lg: `0%` }}
                >
                  <CardSimple
                    name={title}
                    desc={desctiption}
                    thumb={thumbnail}
                    target={target}
                    isMain
                  />
                </Box>
              );
            } else {
              return (
                <Box flex={1} key={i}>
                  <CardSimple
                    name={title}
                    desc={desctiption}
                    thumb={thumbnail}
                    target={target}
                    isMain={items.length == 2 ? true : false}
                  />
                </Box>
              );
            }
          })}
        </Flex>
      </Box>
    </Section>
  );
}
