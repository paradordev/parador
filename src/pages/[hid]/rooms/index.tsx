import { Box, Center, Divider, Flex, Heading, Spinner } from "@chakra-ui/react";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";
import HeroV2 from "../../../components/HeroV2";
import SectionView from "../../../components/SectionView";
import Helmet from "../../../containers/Helmet";
import FooterHotel from "../../../layout/FooterHotel";
import HeaderV3 from "../../../layout/HeaderV3";
import { getHotelBrands, getHotelDetail } from "../../../utils/api";
import { useFetchSWRv2 } from "../../../utils/hooks";
import { safeMarginDesc, safeMarginX } from "../../../utils/mediaQuery";
import { IHeader, IHero, IRoomsHome } from "../../../utils/types";

export default function Room({
  header,
  hotelBrands,
  roomsHome,
  hero,
}: {
  roomsHome: IRoomsHome;
  header: IHeader;
  hotelBrands: any;
  hero: IHero;
}) {
  const { locale } = useRouter();

  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [rooms, isLoading, isError] = useFetchSWRv2(`rooms`, {
    hotel_name: roomsHome.name,
    cct_status: "publish",
    _orderby: "start_from",
    _order: "asc",
  });

  return (
    <>
      <Helmet
        title={`Rooms - ${roomsHome.name} | Parador Hotels & Resorts`}
        description={roomsHome.room_subheadline}
        image={hero.slider[0].url}
      />
      <HeaderV3
        headerItem={header}
        isHomepage={true}
        getHeight={(headerHeight: number) => setHeaderHeight(headerHeight)}
        hotelBrands={hotelBrands}
      />
      <HeroV2
        hasFormNow={true}
        heroItem={hero}
        height={`calc(100vh - ${headerHeight}px)`}
      />

      <Center p={safeMarginDesc} flexDirection="column">
        <Heading
          as="h2"
          maxW={{ base: "90%", md: "70%" }}
          textAlign="center"
          fontSize={["xl", "2xl", "3xl"]}
          fontWeight={400}
          letterSpacing="widest"
        >
          {roomsHome.room_subheadline}
        </Heading>
      </Center>

      <Flex px={safeMarginX}>
        <Divider orientation="horizontal" borderColor="blackAlpha.400" />
      </Flex>

      {isLoading ? (
        <Center h="50vh">
          <Spinner size="xl" />
        </Center>
      ) : (
        <SectionView
          type="rooms"
          title={locale == "id" ? "Kamar" : "Rooms"}
          color={roomsHome.color_primary}
          items={
            rooms
              ? rooms.map(
                  ({
                    _ID,
                    name,
                    thumbnail,
                    desc_short_id,
                    desc_short_en,
                    bed_type,
                    room_size,
                    start_from,
                    total_guest,
                    room_name_id,
                    room_size_manual,
                  }: any) => {
                    return {
                      thumb: thumbnail,
                      _ID,
                      desc: locale == "id" ? desc_short_id : desc_short_en,
                      title:
                        locale == "id" && !isEmpty(room_name_id)
                          ? room_name_id
                          : name,
                      bed_type,
                      room_size: isEmpty(room_size_manual)
                        ? room_size
                        : room_size_manual,
                      start_from,
                      total_guest,
                    };
                  }
                )
              : []
          }
          targetItems={
            rooms
              ? rooms.map(({ _ID }: any) => {
                  return `/${roomsHome.slug}/rooms/${_ID}`;
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
        bg={roomsHome.color_primary}
        color="white"
        logo={roomsHome.logo_light}
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
    room_headline,
    room_subheadline,
    location_short_en,
    brand,
    room_slider,
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
    banner: room_headline,
    color_primary,
    name,
    slider: room_slider,
    hotel_code,
    is_parador: is_parador === "true",
  };

  const roomsHome: IRoomsHome = {
    id: _ID,
    color_primary,
    name,
    hotel_location,
    room_subheadline,
    logo_light,
    slug,
    brand,
    color_secondary,
  };

  const hotelBrands = await getHotelBrands();

  return {
    props: {
      header,
      hotelBrands,
      roomsHome,
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
      if (hotel.slug == "parador" || !hotel.slug || hotel.is_parador) {
        return false; // skip
      }
      return true;
    })
    .map(function (hotel: any) {
      return { params: { hid: hotel.slug, cct_status: "publish" } };
    });

  return { paths, fallback: "blocking" };
}
