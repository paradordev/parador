import { Box, Center, Divider, Flex, Heading, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SectionView from "../../components/SectionView";
import Helmet from "../../containers/Helmet";
import Footer from "../../layout/Footer";
import HeaderV3 from "../../layout/HeaderV3";
import { getHotelBrands, getHotelDetail, getWPDining } from "../../utils/api";
import { capEachWord } from "../../utils/functions";
import { useFetchNextSWR } from "../../utils/hooks";
import { safeMarginX } from "../../utils/mediaQuery";
import { IHeader } from "../../utils/types";

export default function SearchPage({
  header,
  hotelBrands,
}: {
  header: IHeader;
  hotelBrands: any;
}) {
  const { isReady, query, push, locale } = useRouter();

  const [endpoint, setEndpont] = useState("");
  const [items, setItems] = useState<any>();

  useEffect(() => {
    if (isReady && (!query.type || !query.location)) {
      push(`/`);
    }
  }, [isReady]);

  const [itemsTemp, isLoading, isError] = useFetchNextSWR(
    query.type == "hotel"
      ? "hotel-list"
      : query.type == "dining"
      ? "dining-list"
      : "",
    { location: query.location }
  );

  useEffect(() => {
    if (query.type == "hotel") {
      setItems(itemsTemp);
      return;
    } else if (query.type == "dining") {
      let loc;
      if (query.location == "tangerang") {
        loc = "gading serpong";
      } else if (query.location == "bali") {
        loc = "sunset road";
      } else {
        loc = query.location;
      }
      getWPDining({ location: loc, _orderby: "name", _order: "asc" }).then(
        (e) => {
          setItems(e.data);
        }
      );
    }
  }, [isReady, itemsTemp]);

  return (
    <>
      <Helmet title={`Filter | Parador Hotels & Resorts`} />
      <HeaderV3
        headerItem={header}
        isHomepage={false}
        hotelBrands={hotelBrands}
      />
      <Center px={safeMarginX} my={safeMarginX} flexDirection="column">
        <Heading
          mb={3}
          as="h1"
          fontSize="3xl"
          textTransform="none"
          fontWeight={400}
          color={header.color_primary}
          textAlign="center"
          maxW={{ base: "90%", md: "70%" }}
          letterSpacing="widest"
        >
          {locale == "id"
            ? `${items ? items.length : 0} ${query.type} ditemukan di ${
                query.location
              }`
            : `${items ? items.length : 0} ${query.type}s found in ${
                query.location
              }`}
        </Heading>
      </Center>

      <Flex px={safeMarginX}>
        <Divider orientation="horizontal" borderColor="blackAlpha.400" />
      </Flex>

      {!isLoading ? (
        query.type == "hotel" ? (
          <SectionView
            type="hotels"
            title={``}
            color={header.color_primary}
            items={
              items
                ? items.map(
                    ({
                      _ID,
                      name,
                      thumbnail,
                      hotel_location,
                      phone,
                      start_from,
                      email,
                      slug,
                    }: any) => {
                      return {
                        thumb: thumbnail,
                        _ID,
                        title: name,
                        location: hotel_location,
                        phone,
                        start_from,
                        email,
                        slug,
                      };
                    }
                  )
                : []
            }
          />
        ) : (
          <SectionView
            title={``}
            color={header.color_primary}
            targetItems={
              items
                ? items.map(({ _ID }: any) => {
                    return `/dining/${_ID}`;
                  })
                : []
            }
            items={
              items
                ? items.map(
                    ({
                      _ID,
                      name,
                      thumb,
                      hotel_location,
                      phone,
                      start_from,
                      email,
                      hotel_name,
                      slug,
                    }: any) => {
                      return {
                        thumb: thumb ?? ``,
                        _ID,
                        title: name,
                        location: hotel_location,
                        phone,
                        desc: hotel_name ? capEachWord(hotel_name) : ``,
                        start_from,
                        email,
                        slug,
                      };
                    }
                  )
                : []
            }
          />
        )
      ) : (
        <Center h="50vh">
          <Spinner size="xl" />
        </Center>
      )}
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
