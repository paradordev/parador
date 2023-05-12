import { Box, Center, Divider, Flex, Heading, Spinner } from "@chakra-ui/react";
import { isEmpty, lowerCase } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SectionView from "../../components/SectionView";
import Helmet from "../../containers/Helmet";
import Footer from "../../layout/Footer";
import HeaderV3 from "../../layout/HeaderV3";
import { getHotelBrands, getHotelDetail } from "../../utils/api";
import { useFetchSWRv2 } from "../../utils/hooks";
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

  const [itemTemp, isLoading, isError] = useFetchSWRv2(`rooms`, {
    _cct_search: query.keyword,
    cct_status: "publish",
  });

  const [items, setItem] = useState<any>();

  useEffect(() => {
    if (isReady && query.keyword) {
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
    } else {
      // push(`/`);
    }
  }, [locale, itemTemp]);

  return (
    <>
      <Helmet
        title={`Search - ${
          query.keyword ? query.keyword : `~`
        } | Parador Hotels & Resorts`}
      />
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
            ? `Hasil Pencarian untuk "${query.keyword ? query.keyword : `-`}"`
            : `Search Results for "${query.keyword ? query.keyword : `-`}"`}
        </Heading>
      </Center>

      <Flex px={safeMarginX}>
        <Divider orientation="horizontal" borderColor="blackAlpha.400" />
      </Flex>

      {!isLoading ? (
        <SectionView
          type="rooms"
          title={
            items
              ? locale == "id"
                ? `DITEMUKAN "${items.length}" ITEM`
                : `NUMBER FOUND "${items.length}"`
              : ``
          }
          color={header.color_primary}
          items={
            items
              ? items.map(
                  ({
                    _ID,
                    name,
                    thumbnail,
                    desc_short,
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
                      desc: desc_short,
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
            items
              ? items.map(({ _ID, hotel_name }: any) => {
                  return `/${lowerCase(hotel_name).replace(
                    /\s/g,
                    "-"
                  )}/rooms/${_ID}`;
                })
              : []
          }
        />
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
