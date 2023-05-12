import { Box, Center, Divider, Flex, Heading, Text, Tooltip } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import {
  FaChild,
  FaDumbbell,
  FaHandSparkles,
  FaHotel,
  FaSwimmingPool,
  FaTshirt,
  FaUniversity,
  FaUsers,
  FaUtensils,
  FaWifi,
} from "react-icons/fa";
import Section from "../layout/Section";

export default function SectionHotelIntro({
  facilities = [],
  hotelName = "",
  hotelLoc = "",
  hotelDesc = "",
  color,
}) {
  const { locale } = useRouter();
  return (
    <Section>
      <Box w="100%" mb={10}>
        <Heading
          className="banner"
          as="h1"
          size="lg"
          fontWeight={300}
          letterSpacing="widestx"
          textAlign="center"
          mb={3}
          color={color ? color : `gray.800`}
        >
          {hotelName}
        </Heading>
        <Heading
          className="banner"
          as="h2"
          size="sm"
          fontWeight={300}
          letterSpacing="wide"
          textAlign="center"
          color="blackAlpha.700"
          mb={8}
        >
          {hotelLoc}
        </Heading>
        <Center>
          <Text
            w={["90%", "80%", "50%"]}
            textAlign="center"
            color="blackAlpha.700"
          >
            {hotelDesc}
          </Text>
        </Center>
      </Box>
      <Center gap={3} flexWrap={{ base: "wrap", md: "nowrap" }}>
        {facilities.map((f, i) => {
          let icon, text;

          if (f.includes("Concierge")) {
            icon = <FaHotel color="grey" size={30} />;
            if (f.includes("/")) {
              const temp = f.split("/");
              locale == "id" ? (text = temp[1]) : temp[0];
            } else {
              text = f;
            }
          }
          if (f.includes("Front Desk")) {
            icon = <FaHotel color="grey" size={30} />;
            if (f.includes("/")) {
              const temp = f.split("/");
              locale == "id" ? (text = temp[1]) : temp[0];
            } else {
              text = f;
            }
          }

          if (f.includes("Wi-Fi")) {
            icon = <FaWifi color="grey" size={30} />;
            if (f.includes("/")) {
              const temp = f.split("/");
              locale == "id" ? (text = temp[1]) : temp[0];
            } else {
              text = f;
            }
          }

          if (f.includes("Swimming Pool")) {
            icon = <FaSwimmingPool color="grey" size={30} />;
            if (f.includes("/")) {
              const temp = f.split("/");
              locale == "id" ? (text = temp[1]) : temp[0];
            } else {
              text = f;
            }
          }

          if (f.includes("Restaurant")) {
            icon = <FaUtensils color="grey" size={30} />;
            if (f.includes("/")) {
              const temp = f.split("/");
              locale == "id" ? (text = temp[1]) : temp[0];
            } else {
              text = f;
            }
          }

          if (f.includes("Massage")) {
            icon = <FaHandSparkles color="grey" size={30} />;
            if (f.includes("/")) {
              const temp = f.split("/");
              locale == "id" ? (text = temp[1]) : temp[0];
            } else {
              text = f;
            }
          }

          if (f.includes("Fitness Center")) {
            icon = <FaDumbbell color="grey" size={30} />;
            if (f.includes("/")) {
              const temp = f.split("/");
              locale == "id" ? (text = temp[1]) : temp[0];
            } else {
              text = f;
            }
          }

          if (f.includes("Kids Playground")) {
            icon = <FaChild color="grey" size={30} />;
            if (f.includes("/")) {
              const temp = f.split("/");
              locale == "id" ? (text = temp[1]) : temp[0];
            } else {
              text = f;
            }
          }

          if (f.includes("Meeting Room")) {
            icon = <FaUsers color="grey" size={30} />;
            if (f.includes("/")) {
              const temp = f.split("/");
              locale == "id" ? (text = temp[1]) : temp[0];
            } else {
              text = f;
            }
          }

          if (f.includes("Ballroom")) {
            icon = <FaUniversity color="grey" size={30} />;
            if (f.includes("/")) {
              const temp = f.split("/");
              locale == "id" ? (text = temp[1]) : temp[0];
            } else {
              text = f;
            }
          }

          if (f.includes("Laundry")) {
            icon = <FaTshirt color="grey" size={30} />;
            if (f.includes("/")) {
              const temp = f.split("/");
              locale == "id" ? (text = temp[1]) : temp[0];
            } else {
              text = f;
            }
          }

          if (!text) return null;

          return (
            <React.Fragment key={i}>
              <Center w={100}>
                <Flex
                  flexDir="column"
                  justify="space-between"
                  h="100%"
                  w="100%"
                  gap={3}
                >
                  <Center>{icon}</Center>
                  <Tooltip label={text}>
                    <Text
                      className="max-text-1-line"
                      textAlign="center"
                      textTransform="capitalize"
                      fontSize="xs"
                      overflow="hidden"
                      color="blackAlpha.700"
                    >
                      {text}
                    </Text>
                  </Tooltip>
                </Flex>
              </Center>
              {i + 1 < facilities.length && (
                <Center h="80px">
                  <Divider
                    orientation="vertical"
                    opacity={1}
                    my={3}
                    borderWidth={0.5}
                    py={0.1}
                    borderColor="blackAlpha.100"
                    bg="blackAlpha.100"
                  />
                </Center>
              )}
            </React.Fragment>
          );
        })}
      </Center>
    </Section>
  );
}
