import { Divider, Flex } from "@chakra-ui/react";
import { isEmpty, toString } from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";
import DetailPage from "../../components/DetailPage";
import Helmet from "../../containers/Helmet";
import FooterHotel from "../../layout/FooterHotel";
import HeaderV3 from "../../layout/HeaderV3";
import {
  getHotelBrands,
  getHotelDetail,
  getSpecialOffer,
} from "../../utils/api";
import { safeMarginX } from "../../utils/mediaQuery";
import { IHeader } from "../../utils/types";

export default function Hotel({
  header,
  hotelBrands,
  offer,
  isGroupOffer,
}: {
  header: IHeader;
  hotelBrands: any;
  offer: any;
  isGroupOffer: any;
}) {
  const router = useRouter();
  const { locale, locales, asPath } = useRouter();
  const { go_id } = router.query;

  const [headerHeight, setHeaderHeight] = useState(0);

  const {
    images,
    title,
    start_from,
    desc_long,
    desc_long_id,
    date_start,
    date_end,
    benefits,
    benefits_id,
    tac,
    tac_id,
    hotel_name,
    hotel_names,
    promo,
    rate,
    connect_to_synxis,
    promo_url,
    coupon,
    dest,
    arrive,
    depart,
    meta_title_id,
    meta_title_en,
    meta_desc_id,
    meta_desc_en,
    meta_thumb,
  } = offer;

  return (
    <>
      <Helmet
        title={
          !isEmpty(meta_title_id) && router.locale == "id"
            ? meta_title_id
            : !isEmpty(meta_title_en)
            ? meta_title_en
            : `${title} - ${isGroupOffer ? `Group Offers` : `Hotel Offers`}${
                isGroupOffer ? `` : " | " + hotel_name
              } | Parador Hotels & Resorts`
        }
        description={
          router.locale == "id"
            ? !isEmpty(meta_desc_id)
              ? meta_desc_id
              : desc_long_id
            : !isEmpty(meta_desc_en)
            ? meta_desc_en
            : desc_long
        }
        image={!isEmpty(meta_thumb) ? meta_thumb : images[0] ?? ""}
      />
      <HeaderV3
        headerItem={header}
        isHomepage={false}
        hotelBrands={hotelBrands}
      />
      <DetailPage
        variant="flat"
        headline={
          isGroupOffer
            ? router.locale == "id"
              ? "Penawaran Grup"
              : "Group Offers"
            : router.locale == "id"
            ? "Penawaran Hotel"
            : "Hotel Offers"
        }
        subHeadline={
          router.locale == "id"
            ? "Nikmati Penawaran & Promosinya"
            : "Enjoy the offers & promotions"
        }
        isParador={isGroupOffer}
        hotelName={isGroupOffer ? hotel_names : hotel_name}
        color={header.color_primary}
        images={images}
        title={title}
        price={start_from}
        desc={router.locale == "id" ? desc_long_id : desc_long}
        date={[date_start, date_end]}
        benefits={router.locale == "id" ? benefits_id : benefits}
        tac={router.locale == "id" ? tac_id : tac}
        promo={promo}
        rate={rate}
        connectToSynxis={connect_to_synxis}
        promoUrl={promo_url}
        coupon={coupon}
        dest={dest}
        arrive={arrive}
        depart={depart}
        hotelCode={toString(header.hotel_code)}
      />
      <Flex px={safeMarginX}>
        <Divider
          orientation="horizontal"
          borderColor="black"
          bg="black"
          opacity={0.2}
        />
      </Flex>
      {/* <Center gap={6} pt={10} pb={20}>
        <Box>
          <LinkTo
            activeColor="black"
            to={go_id == 1 ? `/special-offers` : `/special-offers/${go_id - 1}`}
          >
            <Text
              fontSize="sm"
              color="black"
              cursor="pointer"
              fontWeight={600}
              letterSpacing="widest"
            >
              PREV PAGE
            </Text>
          </LinkTo>
        </Box>
        <Divider
          width={160}
          borderColor="black"
          bg="black"
          orientation="horizontal"
        />
        <Box>
          <LinkTo activeColor="black" to={`/special-offers/${go_id + 1}`}>
            <Text
              fontSize="sm"
              color="black"
              cursor="pointer"
              fontWeight={600}
              letterSpacing="widest"
            >
              NEXT PAGE
            </Text>
          </LinkTo>
        </Box>
      </Center> */}
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

export async function getStaticProps({ params, locale }: any) {
  const offer = await getSpecialOffer({
    _ID: params.go_id,
    cct_status: "publish",
  }).then((res) => res.data[0]);

  const isGroupOffer = (await offer.is_group_offer) == "true" ? true : false;

  const hotelParams = isGroupOffer
    ? { is_parador: true, cct_status: "publish" }
    : { name: await offer.hotel_name, cct_status: "publish" };

  const data: any = await getHotelDetail(hotelParams).then((r) => r.data[0]);

  let temp = await data;

  if (locale == "id") {
    let x = JSON.stringify(await data);
    let y = x.replace(/_id/g, "");
    temp = JSON.parse(y);
  } else {
    let x = JSON.stringify(await data);
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
    props: { offer, header, hotelBrands, isGroupOffer },
    revalidate: parseInt(process.env.NEXT_PUBLIC_REVALIDATE_TIME ?? "200", 10), // In seconds
  };
}

export async function getStaticPaths({ locales }: any) {
  const offers = await getSpecialOffer({ cct_status: "publish" }).then(
    (res) => {
      return res.data;
    }
  );

  const paths = await offers.map(({ _ID }: any) => {
    return { params: { go_id: _ID } };
  });

  return { paths, fallback: "blocking" };
}
