import { find, isEmpty } from "lodash";
import { useRouter } from "next/router";
import DetailRoom from "../../../components/DetailRoom";
import Helmet from "../../../containers/Helmet";
import FooterHotel from "../../../layout/FooterHotel";
import HeaderV3 from "../../../layout/HeaderV3";
import {
  getHotelBrands,
  getHotelDetail,
  getRoomDetail,
} from "../../../utils/api";
import { IHeader } from "../../../utils/types";

export default function RoomDetail({
  header,
  hotelBrands,
  room,
}: {
  header: IHeader;
  hotelBrands: any;
  room: any;
}) {
  const router = useRouter();

  return (
    <>
      <Helmet
        title={
          !isEmpty(room.meta_title_id) && router.locale == "id"
            ? room.meta_title_id
            : !isEmpty(room.meta_title_en)
            ? room.meta_title_en
            : `${room.name} - Rooms | ${header.name} | Parador Hotels & Resorts`
        }
        description={
          router.locale == "id"
            ? !isEmpty(room.meta_desc_id)
              ? room.meta_desc_id
              : room.desc_long_id
            : !isEmpty(room.meta_desc_en)
            ? room.meta_desc_en
            : room.desc_long_en
        }
        image={!isEmpty(room.meta_thumb) ? room.meta_thumb : room.thumbnail}
      />

      <HeaderV3
        headerItem={header}
        isHomepage={false}
        hotelBrands={hotelBrands}
      />

      <DetailRoom
        variant="zero"
        color={header.color_primary}
        thumb={room.thumbnail ?? ""}
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
          router.locale == "id" ? room.stay_includes_id : room.stay_includes_en
        }
        headline={undefined}
        subHeadline={undefined}
        brochure={room.brochures.length ? room.brochures[0] : room.brochures}
        layout={room.layout}
        hotelCode={header.hotel_code ?? ""}
      />

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

  const room: any = await getRoomDetail({
    _ID: params.rid,
    cct_status: "publish",
  }).then((r) => {
    return r.data[0];
  });

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
      room,
    },
    revalidate: parseInt(process.env.NEXT_PUBLIC_REVALIDATE_TIME ?? "200", 10), // In seconds
  };
}

export async function getStaticPaths() {
  const resRooms = await getRoomDetail();
  const rooms = await resRooms.data;

  const resHotels = await getHotelDetail();
  const hotels = await resHotels.data;

  const paths = await rooms
    .filter(function (room: any) {
      if (room.cct_status != "publish") {
        return false; // skip
      }
      return true;
    })
    .map(function (room: any) {
      const slug = find(hotels, {
        name: room.hotel_name,
        cct_status: "publish",
      }).slug;
      return { params: { rid: room._ID, hid: slug } };
    });

  return { paths, fallback: "blocking" };
}
