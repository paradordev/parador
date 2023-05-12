import { Box, Center, Divider, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import HeroV2 from "../../components/HeroV2";
import LoadingSpinner from "../../components/LoadingSpinner";
import SectionView from "../../components/SectionView";
import Helmet from "../../containers/Helmet";
import Footer from "../../layout/Footer";
import HeaderV3 from "../../layout/HeaderV3";
import { getHotelBrands, getHotelDetail } from "../../utils/api";
import { useFetchSWRv2 } from "../../utils/hooks";
import { safeMarginDesc, safeMarginX } from "../../utils/mediaQuery";
import { IHeader, IHero } from "../../utils/types";

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

  const [items, isLoading] = useFetchSWRv2(`hotels`, {
    has_wedding: true,
    is_parador: false,
    cct_status: "publish",
  });

  return (
    <>
      <Helmet title="Wedding | Parador Hotels & Resorts" />
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
          title={locale == "id" ? "Pernikahan" : "Wedding"}
          color={header.color_primary}
          items={
            items
              ? items.map(
                  ({
                    _ID,
                    name,
                    thumbnail,
                    wedding_subheadline_en,
                    wedding_subheadline_id,
                  }: any) => {
                    return {
                      thumb: thumbnail,
                      _ID,
                      desc:
                        locale == "id"
                          ? wedding_subheadline_id
                          : wedding_subheadline_en,
                      title: name,
                    };
                  }
                )
              : []
          }
          targetItems={
            items
              ? items.map(({ slug }: any) => {
                  return `/${slug}/wedding`;
                })
              : []
          }
        />
      )}
      <Box w={20} />
      <Footer
        loc={header.location_url}
        address={header.location_long}
        email={header.email}
        phone={header.phone}
      />
    </>
  );
}

export async function getStaticProps({ locale, params }: any) {
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
    wedding_headline,
    wedding_slider,
    location_short_en,
    wedding_subheadline,
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
    banner: wedding_headline,
    color_primary,
    name,
    slider: wedding_slider,
    hotel_code,
    is_parador: is_parador === "true",
    has_banner: true,
    sub_banner: wedding_subheadline,
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
