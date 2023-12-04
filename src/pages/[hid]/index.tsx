import { Box, Divider, Flex } from "@chakra-ui/react";
import { compact, isEmpty } from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";
import FormBookNowV2 from "../../components/FormBookNowV2";
import HeroV2 from "../../components/HeroV2";
import SectionDining from "../../components/SectionDining";
import SectionEvent from "../../components/SectionEvent";
import SectionGallery from "../../components/SectionGallery";
import SectionHotel from "../../components/SectionHotel";
import SectionHotelIntro from "../../components/SectionHotelIntro";
import SectionSpecialOffer from "../../components/SectionSpecialOffer";
import Helmet from "../../containers/Helmet";
import FooterHotel from "../../layout/FooterHotel";
import HeaderV3 from "../../layout/HeaderV3";
import { getHotelBrands, getHotelDetail } from "../../utils/api";
import { safeMarginX } from "../../utils/mediaQuery";
import { IHeader, IHero, IHotelHome } from "../../utils/types";

export default function Hotel({
  header,
  hotelBrands,
  hero,
  hotelHome,
}: {
  header: IHeader;
  hotelBrands: any;
  hero: IHero;
  hotelHome: IHotelHome;
}) {
  const { locale } = useRouter();

  const [headerHeight, setHeaderHeight] = useState(0);

  const {
    color_primary,
    facilities,
    home_subheadline,
    color_secondary,
    hotel_location,
    id,
    logo_light,
    name,
    brand,
    slug,
  } = hotelHome;

  const eventItems = [
    header.has_wedding == "true" && {
      title: locale == "id" ? "Pernikahan" : "Wedding",
      desctiption:
        locale == "id"
          ? `Rencanakan pernikahan di ${header.name}. Wujudkan impian pernikahan dambaanmu.`
          : `Plan a wedding at ${
              header.is_parador
                ? `any Parador Hotel & Resort's property`
                : header.name
            } and make your wedding dream come true.`,
      target: `/${slug}/wedding`,
      thumbnail: hotelHome.wedding_thumbnail,
    },

    header.has_social_events == "true" && {
      title: locale == "id" ? "Acara sosial" : "Social Events",
      desctiption:
        locale == "id"
          ? `Rencanakan acaramu. Biarkan kami melakukan sisanya`
          : `Plan your events ahead. Let us do the rest.`,
      target: `/${slug}/meeting-events?filter=social`,
      thumbnail: hotelHome.events_thumbnail,
    },

    header.has_meeting_events == "true" && {
      title: locale == "id" ? "Ruang Meeting" : "Meeting Room",
      desctiption:
        locale == "id"
          ? `Terletak strategis, Atria memiliki ruang pertemuan & layanan perjamuan yang cocok untuk memenuhi kebutuhan Anda.`
          : `Strategically located, we offer comprehensive meeting rooms & banquet services that works best for you`,
      target: `/${slug}/meeting-events?filter=venue`,
      thumbnail: hotelHome.meeting_thumbnail,
    },
  ];

  return (
    <>
      <Helmet
        title={
          !isEmpty(hotelBrands.meta_title_id) && locale == "id"
            ? hotelBrands.meta_title_id
            : !isEmpty(hotelBrands.meta_title_en)
            ? hotelBrands.meta_title_en
            : `${brand} - ${hotel_location} | Parador Hotels & Resorts`
        }
        description={
          !isEmpty(hotelBrands.meta_desc_id) && locale == "id"
            ? hotelBrands.meta_desc_id
            : !isEmpty(hotelBrands.meta_desc_en)
            ? hotelBrands.meta_desc_en
            : home_subheadline
        }
        image={
          !isEmpty(hotelBrands.meta_thumb)
            ? hotelBrands.meta_thumb
            : hero
            ? hero.slider[0].url
            : ""
        }
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
      <Box position="relative" bg={header.color_primary} h="100%" top={0}>
        <FormBookNowV2
          hotelCode={header.hotel_code}
          colorPrimary={header.color_primary}
        />
      </Box>
      <SectionHotelIntro
        hotelName={brand}
        hotelLoc={hotel_location}
        hotelDesc={home_subheadline}
        facilities={facilities}
        color={color_primary}
      />
      <Flex w="100%" px={safeMarginX}>
        <Divider
          opacity={1}
          my={3}
          borderWidth={0.5}
          py={0.1}
          borderColor="blackAlpha.100"
          bg="blackAlpha.100"
        />
      </Flex>
      <SectionSpecialOffer
        hotelName={brand}
        hotelLoc={hotel_location}
        color={color_primary}
        slug={slug}
        hotelCode={header.hotel_code}
        hotel={name}
      />
      {header.has_dining && (
        <SectionDining
          bg={color_primary}
          color="white"
          params={{ hotel_name: name }}
        />
      )}

      {(header.has_wedding == "true" ||
        header.has_meeting_events == "true" ||
        header.has_social_events == "true") && (
        <SectionEvent
          color={header.color_primary}
          items={compact(eventItems)}
        />
      )}
      <SectionHotel bg={color_primary} color="white" />
      <SectionGallery slug={slug} color={color_primary} limit={4} id={id} />
      <FooterHotel
        instagram={header.instagram}
        facebook={header.facebook}
        locationLink={header.location_url}
        location={header.location_long}
        email={header.email}
        phone={header.phone}
        bg={color_primary}
        color={color_secondary}
        logo={logo_light}
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
    let x = JSON.stringify(data ?? "");
    let y = x.replace(/_id/g, "");
    temp = JSON.parse(y);
  } else {
    let x = JSON.stringify(data ?? "");
    let y = x.replace(/_en/g, "");
    temp = JSON.parse(y);
  }

  const {
    _ID = null,
    name = null,
    location_short = null,
    location_url = null,
    hotel_location = null,
    phone = null,
    logo_dark = null,
    logo_light = null,
    color_primary = null,
    color_secondary = null,
    is_parador = null,
    slug = null,
    hotel_code = null,
    home_headline = null,
    home_subheadline = null,
    hotel_sliders = null,
    hotel_gallery = null,
    location_short_en = null,
    facilities = null,
    brand = null,
    has_dining = null,
    has_wedding = null,
    has_meeting_events = null,
    has_social_events = null,
    meeting_thumbnail = null,
    events_thumbnail = null,
    wedding_thumbnail = null,
    location_long = null,
    location_long_en = null,
    email = null,
    instagram = null,
    facebook = null,
  } = temp || {};

  const header: IHeader = {
    email: email ?? "",
    instagram: instagram ?? "",
    facebook: facebook ?? "",
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
    has_social_events,
    meeting_thumbnail,
    events_thumbnail,
    wedding_thumbnail,
  };

  const hero: IHero = {
    id: _ID,
    banner: home_headline,
    color_primary,
    name,
    slider: hotel_sliders,
    hotel_code,
    is_parador: is_parador === "true",
  };

  const hotelHome: IHotelHome = {
    id: _ID,
    color_primary,
    name,
    facilities,
    hotel_location,
    home_subheadline,
    logo_light,
    slug,
    brand,
    color_secondary,
    meeting_thumbnail,
    events_thumbnail,
    wedding_thumbnail,
  };

  const hotelBrands = await getHotelBrands();

  return {
    props: {
      header,
      hotelBrands,
      hero,
      hotelHome,
    },
    revalidate: parseInt(process.env.NEXT_PUBLIC_REVALIDATE_TIME ?? "200", 10), // In seconds
  };
}

export async function getStaticPaths({ locales }: any) {
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
