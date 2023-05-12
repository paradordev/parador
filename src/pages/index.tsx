import { Box } from "@chakra-ui/react";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";
import FormBookNowV2 from "../components/FormBookNowV2";
import HeroV2 from "../components/HeroV2";
import SectionDining from "../components/SectionDining";
import SectionEvent from "../components/SectionEvent";
import SectionGallery from "../components/SectionGallery";
import SectionHotel from "../components/SectionHotel";
import SectionSpecialOffer from "../components/SectionSpecialOffer";
import Helmet from "../containers/Helmet";
import Footer from "../layout/Footer";
import HeaderV3 from "../layout/HeaderV3";
import { getHotelBrands, getHotelDetail } from "../utils/api";
import { IHeader, IHero } from "../utils/types";

export default function Home({
  header,
  hotelBrands,
  hero,
}: {
  header: IHeader;
  hotelBrands: any;
  hero: IHero;
}) {
  const { locale } = useRouter();

  const [headerHeight, setHeaderHeight] = useState<number>(0);

  return (
    <>
      <Helmet
        title={
          !isEmpty(hotelBrands.meta_title_id) && locale == "id"
            ? hotelBrands.meta_title_id
            : !isEmpty(hotelBrands.meta_title_en)
            ? hotelBrands.meta_title_en
            : "Home | Parador Hotels & Resorts"
        }
        description={
          !isEmpty(hotelBrands.meta_desc_id) && locale == "id"
            ? hotelBrands.meta_desc_id
            : !isEmpty(hotelBrands.meta_desc_en)
            ? hotelBrands.meta_desc_en
            : "WITH A CONSCIOUS HEART"
        }
        image={
          !isEmpty(hotelBrands.meta_thumb)
            ? hotelBrands.meta_thumb
            : hero.slider[0].url
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
      <Box position="relative" bg={header.color_primary} top={0}>
        <FormBookNowV2
          hotelCode={header.hotel_code}
          colorPrimary={header.color_primary}
        />
      </Box>

      <SectionSpecialOffer
        isParador
        hotelName={header.name}
        hotelLoc={header.hotel_location}
        hotel={header.name}
        hotelCode={header.hotel_code}
      />

      <SectionDining />

      <SectionEvent
        color={header.color_primary}
        items={[
          {
            title: locale == "id" ? "Pernikahan" : "Wedding",
            desctiption:
              locale == "id"
                ? `Rencanakan pernikahan di salah satu hotel Parador Hotels & Resorts. Wujudkan impian pernikahan dambaanmu.`
                : `Plan a wedding at ${
                    header.is_parador
                      ? `any Parador Hotel & Resort's property`
                      : header.name
                  } and make your wedding dream come true.`,
            target: "/wedding",
            thumbnail: header.wedding_thumbnail,
          },
          {
            title: locale == "id" ? "Acara sosial" : "Social Events",
            desctiption:
              locale == "id"
                ? `Rencanakan acaramu. Biarkan kami melakukan sisanya`
                : `Plan your events ahead. Let us do the rest.`,
            target: "/meeting-events",
            thumbnail: header.events_thumbnail,
          },
          {
            title: locale == "id" ? "Ruang Rapat" : "Meeting Room",
            desctiption:
              locale == "id"
                ? `Terletak strategis, Atria memiliki ruang pertemuan & layanan perjamuan yang cocok untuk memenuhi kebutuhan Anda.`
                : `Strategically located, we offer comprehensive meeting rooms & banquet services that works best for you`,
            target: "/meeting-events",
            thumbnail: header.meeting_thumbnail,
          },
        ]}
      />

      <SectionHotel />

      <SectionGallery slug={null} color={"black"} limit={4} id={header.id} />

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
    location_short_en,
    has_dining,
    has_wedding,
    has_meeting_events,
    has_social_events,
    wedding_thumbnail,
    events_thumbnail,
    meeting_thumbnail,
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
    has_social_events,
    wedding_thumbnail,
    events_thumbnail,
    meeting_thumbnail,
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
