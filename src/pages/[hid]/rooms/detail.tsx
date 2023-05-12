import { Center, Spinner } from "@chakra-ui/react";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DetailRoom from "../../../components/DetailRoom.jsx";
import Helmet from "../../../containers/Helmet";
import FooterHotel from "../../../layout/FooterHotel";
import HeaderV3 from "../../../layout/HeaderV3";
import { getHotelBrands, getHotelDetail } from "../../../utils/api";
import { useFetchSWRv2 } from "../../../utils/hooks";
import { IHeader } from "../../../utils/types";

export default function RoomDetail({
  header,
  hotelBrands,
}: {
  header: IHeader;
  hotelBrands: any;
}) {
  const router = useRouter();

  const [rooms, isLoading, isError] = useFetchSWRv2(`rooms`, {
    _ID: router.query.id,
    cct_status: "publish",
  });

  const [room, setRoom] = useState<any>();

  useEffect(() => {
    if (router.isReady) {
      !router.query.id
        ? router.push(`/${header.slug}/rooms`)
        : rooms && setRoom(rooms[0]);

      if (!isLoading && (isError || !rooms || (rooms && rooms.length < 1))) {
        router.push(`/${header.slug}/rooms`);
      }
    }
  }, [rooms, router.isReady, router.locale]);

  return (
    <>
      <Helmet
        title={`Room | Parador Hotels & Resorts`}
        description={
          router.locale == "id" ? room?.desc_long_id : room?.desc_long_en
        }
        image={room?.thumbnail}
      />

      <HeaderV3
        headerItem={header}
        isHomepage={false}
        hotelBrands={hotelBrands}
      />
      {isLoading ? (
        <Center h="50vh">
          <Spinner size="xl" />
        </Center>
      ) : (
        room && (
          <DetailRoom
            variant="zero"
            color={header.color_primary}
            thumb={room.thumbnail}
            images={room.gallery}
            title={
              router.locale == "id" && !isEmpty(room.room_name_id)
                ? room.room_name_id
                : room.name
            }
            price={room.start_from}
            desc={router.locale == "id" ? room.desc_long_id : room.desc_long_en}
            featured={[
              room.total_guest,
              room.bed_type,
              isEmpty(room.room_size_manual)
                ? room.room_size
                : room.room_size_manual,
            ]}
            benefits={room.benefits}
            tac={router.locale == "id" ? room.tac_id : room.tac_en}
            slug={header.slug}
            includes={
              router.locale == "id"
                ? room.stay_includes_id
                : room.stay_includes_en
            }
            headline={undefined}
            subHeadline={undefined}
            brochure={
              room.brochures.length ? room.brochures[0] : room.brochures
            }
            layout={room.layout}
            hotelCode={header.hotel_code ?? ""}
          />
        )
      )}
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
