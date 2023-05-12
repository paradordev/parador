import { Box, Center, Divider, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import HeroV2 from "../../../components/HeroV2";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SectionView from "../../../components/SectionView";
import Helmet from "../../../containers/Helmet";
import FooterHotel from "../../../layout/FooterHotel";
import HeaderV3 from "../../../layout/HeaderV3";
import { getHotelBrands, getHotelDetail } from "../../../utils/api";
import { useFetchSWRv2 } from "../../../utils/hooks";
import { safeMarginDesc, safeMarginX } from "../../../utils/mediaQuery";
import { IHeader, IHero } from "../../../utils/types";

export default function Wedding({
  header,
  hotelBrands,
  hero,
}: {
  header: IHeader;
  hotelBrands: any;
  hero: IHero;
}) {
  const { locale, query } = useRouter();

  const [headerHeight, setHeaderHeight] = useState<number>(0);

  const [items, isLoading] = useFetchSWRv2(`meeting_events`, {
    hotel_name: header.name,
    _orderby: "order_number",
    _order: "asc",
    cct_status: "publish",
  });

  return (
    <>
      <Helmet
        title={`Meeting Events - ${header.name} | Parador Hotels & Resorts`}
      />
      <HeaderV3
        headerItem={header}
        isHomepage={true}
        getHeight={(headerHeight: number) => setHeaderHeight(headerHeight)}
        hotelBrands={hotelBrands}
      />
      <HeroV2
        heroItem={hero}
        height={`calc(100vh - ${headerHeight}px)`}
        hasFormNow={false}
      />

      <Center p={safeMarginDesc} flexDirection="column">
        <Text maxW={{ base: "90%", md: "50%" }} align="center">
          {hero.sub_banner}
        </Text>
      </Center>

      <Flex px={safeMarginX}>
        <Divider orientation="horizontal" borderColor="blackAlpha.400" />
      </Flex>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <SectionView
          title={locale == "id" ? "Rapat & Acara" : "Meeting & Events"}
          color={header.color_primary}
          type="meeting"
          hasCategory={true}
          categories={["all", "Meeting Package", "Social Events", "Venue"]}
          defaultCategory={
            query.filter == "social"
              ? "Social Events"
              : query.filter == "venue"
              ? "Venue"
              : "all"
          }
          items={
            items
              ? items.map(
                  ({
                    _ID,
                    title_en,
                    title_id,
                    thumbnail,
                    description_en,
                    description_id,
                    total_person,
                    room_size,
                    category,
                  }: any) => {
                    return {
                      thumb: thumbnail,
                      _ID,
                      desc: locale == "id" ? description_id : description_en,
                      title: locale == "id" ? title_id : title_en,
                      total_person,
                      room_size,
                      category,
                    };
                  }
                )
              : []
          }
          isManualTarget={true}
          targetItems={
            items
              ? items.map(({ _ID }: any) => {
                  return `/${header.slug}/meeting-events/detail?id=${_ID}`;
                })
              : []
          }
        />
      )}

      <Box w={20} />

      <FooterHotel
        instagram={header.instagram}
        facebook={header.facebook}
        locationLink={header.location_url}
        location={header.location_long}
        email={header.email}
        phone={header.phone}
        bg={header.color_primary}
        color="white"
        logo={header.logo_light}
      />
    </>
  );
}

export async function getStaticProps({ locale, params }: any) {
  let temp;

  const data: any = await getHotelDetail({
    slug: params.hid,
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
    meeting_headline,
    meeting_slider,
    meeting_subheadline,
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

  const hero: IHero = {
    id: _ID,
    banner: meeting_headline,
    color_primary,
    name,
    slider: meeting_slider,
    hotel_code,
    is_parador: is_parador === "true",
    has_banner: true,
    sub_banner: meeting_subheadline,
  };

  const hotelBrands = await getHotelBrands();

  return {
    props: {
      header,
      hotelBrands,
      hero,
    },
    revalidate: parseInt(process.env.NEXT_PUBLIC_REVALIDATE_TIME ?? "200", 10), // In seconds
  };
}

export async function getStaticPaths() {
  const res = await getHotelDetail();
  const hotels = await res.data;

  const paths = hotels
    .filter(function (hotel: any) {
      if (
        hotel.slug == "parador" ||
        !hotel.slug ||
        hotel.has_wedding != "true" ||
        hotel.has_wedding != true
      ) {
        return false; // skip
      }
      return true;
    })
    .map(function (hotel: any) {
      return { params: { hid: hotel.slug } };
    });

  return { paths, fallback: "blocking" };
}
