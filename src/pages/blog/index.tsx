import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Helmet from "../../containers/Helmet";
import Footer from "../../layout/Footer";
import HeaderV3 from "../../layout/HeaderV3";
import Section from "../../layout/Section";
import { getHotelBrands, getHotelDetail } from "../../utils/api";
import { useFetchSWRv2 } from "../../utils/hooks";
import { IHeader } from "../../utils/types";

export default function GalleryPage({
  header,
  hotelBrands,
}: {
  header: IHeader;
  hotelBrands: any;
}) {
  const { isReady, query, push, locale } = useRouter();

  const [itemTemp, isLoading, isError] = useFetchSWRv2(`blog`, {
    cct_status: "publish",
  });

  const [items, setItem] = useState<any>([]);

  useEffect(() => {
    if (itemTemp) {
      let temp = itemTemp;

      if (locale == "id") {
        let x = JSON.stringify(itemTemp);
        let y = x.replace(/_id/g, "");
        temp = JSON.parse(y);
      } else {
        let x = JSON.stringify(itemTemp);
        let y = x.replace(/_en/g, "");
        temp = JSON.parse(y);
      }

      setItem(temp);
    }
  }, [locale, itemTemp]);

  return (
    <>
      <Helmet title="Blog | Parador Hotels & Resorts" />
      <HeaderV3
        headerItem={header}
        isHomepage={false}
        hotelBrands={hotelBrands}
      />
      <Section bg="white">
        <Heading
          mb={2}
          as="h1"
          fontWeight={400}
          letterSpacing="wider"
          color={header.color_primary}
          textAlign="center"
        >
          blog
        </Heading>

        {isLoading ? (
          <Center h="50vh">
            <Spinner size="xl" />
          </Center>
        ) : items && items.length > 0 ? (
          <SimpleGrid columns={[1, 1, 2, 2, 3]} gap={6}>
            {items.map(
              ({ thumbnail, title, cct_created, _ID, slug,short_content }: any) => {
                return (
                  <Flex
                    key={cct_created}
                    flexDir="column"
                    // h="60vh"
                    justify="space-between"
                    gap={4}
                  >
                    <Box w="full" h="full">
                      <Box w="full" h="35vh" position="relative">
                        <Image
                          src={thumbnail}
                          alt={title}
                          layout="fill"
                          objectFit="cover"
                        />
                      </Box>
                      <Heading fontSize="2xl" my={3} fontWeight={400}>
                        {title}
                      </Heading>
                      <Text fontSize="sm" noOfLines={2} color="blackAlpha.600">
                        {short_content}
                      </Text>
                    </Box>
                    <Box>
                      <Button
                        _hover={{ bg: "black", color: "white" }}
                        variant="outlineWhite"
                        onClick={() => {
                          push(`/blog/${slug}`);
                        }}
                      >
                        {locale == "id" ? "Lebih Lengkap" : "See More"}
                      </Button>
                    </Box>
                  </Flex>
                );
              }
            )}
          </SimpleGrid>
        ) : (
          <Box />
        )}
      </Section>
      <Box h={10} />
      <Footer
        loc={header.location_url}
        address={header.location_long}
        email={header.email}
        phone={header.phone}
      />
    </>
  );
}

export async function getStaticProps({ locale }: any) {
  let temp;

  const data: any = await getHotelDetail({
    is_parador: "true",
    cct_status: "publish",
  }).then((r) => r.data[0]);

  temp = await data;

  if (locale == "id") {
    let x = JSON.stringify(data);
    let y = x.replace(/_id/g, "");
    temp = JSON.parse(y);
  } else {
    let x = JSON.stringify(data);
    let y = x.replace(/_en/g, "");
    temp = JSON.parse(y);
  }

  const {
    _ID,
    name,
    location_short,
    location_url,
    hotel_location,
    phone,
    logo_dark,
    logo_light,
    color_primary,
    color_secondary,
    is_parador,
    slug,
    hotel_code,
    home_headline,
    hotel_sliders,
    hotel_gallery,
    location_short_en,
    has_dining,
    has_wedding,
    has_meeting_events,
    location_long,
    location_long_en,
    email,
  } = temp;

  const header: IHeader = {
    email: email,
    instagram: temp.instagram,
    facebook: temp.facebook,
    location_long: location_long ? location_long : location_long_en,
    id: _ID,
    name,
    color_primary,
    color_secondary,
    location: location_short ? location_short : location_short_en,
    location_url,
    hotel_location,
    phone,
    logo_dark,
    logo_light,
    is_parador: is_parador === "true",
    hotel_code: hotel_code == 0 ? null : hotel_code,
    slug,
    has_dining,
    has_wedding,
    has_meeting_events,
  };

  const hotelBrands = await getHotelBrands();

  return {
    props: {
      header,
      hotelBrands,
    },
    revalidate: parseInt(process.env.NEXT_PUBLIC_REVALIDATE_TIME ?? "200", 10), // In seconds
  };
}
