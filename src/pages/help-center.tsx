import { Box } from "@chakra-ui/react";
import { Markup } from "interweave";
import { useRouter } from "next/router";
import Helmet from "../containers/Helmet";
import Footer from "../layout/Footer";
import HeaderV3 from "../layout/HeaderV3";
import Section from "../layout/Section";
import { getHotelBrands, getHotelDetail, getSitemap } from "../utils/api";
import { IHeader } from "../utils/types";

export default function SearchPage({
  header,
  hotelBrands,
  sitemapData,
}: {
  header: IHeader;
  hotelBrands: any;
  sitemapData: any;
}) {
  const { locale } = useRouter();

  return (
    <>
      <Helmet title={`Offers Help Center | Parador Hotels & Resorts`} />
      <HeaderV3
        headerItem={header}
        isHomepage={false}
        hotelBrands={hotelBrands}
      />

      <Section>
        <Markup
          className="white-space-enter"
          content={
            locale == "id"
              ? sitemapData.content_id.replace(/\\n/g, `<br>`) ?? ""
              : sitemapData.content_en.replace(/\\n/g, `<br>`) ?? ""
          }
        />
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

  const sitemapData: any = await getSitemap({
    type: "Offers Help Center",
  }).then((res) => res.data[0]);

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
      sitemapData,
    },
    revalidate: parseInt(process.env.NEXT_PUBLIC_REVALIDATE_TIME ?? "200", 10), // In seconds
  };
}
