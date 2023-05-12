import { Flex, Skeleton } from "@chakra-ui/react";
import { lowerCase } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DetailPageV2 from "../../../components/DetailPageV2";
import FormMeeting from "../../../components/FormMeeting";
import Helmet from "../../../containers/Helmet";
import FooterHotel from "../../../layout/FooterHotel";
import HeaderV3 from "../../../layout/HeaderV3";
import Section from "../../../layout/Section";
import { getHotelBrands, getHotelDetail } from "../../../utils/api";
import { useFetchSWRv2 } from "../../../utils/hooks";
import { useLargeQuery } from "../../../utils/mediaQuery";
import { IHeader } from "../../../utils/types";

export default function MeetingEventsDetail({
  header,
  hotelBrands,
}: {
  header: IHeader;
  hotelBrands: any;
}) {
  const { isReady, query, push, locale } = useRouter();

  const [itemTemp] = useFetchSWRv2(`meeting_events`, {
    _ID: query.id,
    cct_status: "publish",
  });

  const [item, setItem] = useState<any>();

  useEffect(() => {
    if (isReady) {
      if (!query.id) {
        push(`/${header.slug}/meeting-events`);
      }

      if (itemTemp) {
        let temp = itemTemp[0];

        if (locale == "id") {
          let x = JSON.stringify(itemTemp[0]);
          let y = x.replace(/_id/g, "");
          temp = JSON.parse(y);
        } else {
          let x = JSON.stringify(itemTemp[0]);
          let y = x.replace(/_en/g, "");
          temp = JSON.parse(y);
        }

        setItem(temp);
      }
    }
  }, [isReady, itemTemp, locale]);

  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (isFormOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isFormOpen]);

  const { isXLarge } = useLargeQuery();

  const [headline, setHeadline] = useState("");
  useEffect(() => {
    // WEDDING ENQUIRY
    // VENUE ENQUIRY
    // SOCIAL EVENTS ENQUIRY
    // MEETING PACKAGE ENQUIRY
    if (!item) return;
    const temp = item?.category;

    if (lowerCase(temp).includes("venue")) {
      setHeadline(
        locale == "id" ? `PERMINTAAN UNTUK TEMPAT KEGIATAN` : `VENUE ENQUIRY`
      );
    } else if (lowerCase(temp).includes("social")) {
      setHeadline(
        locale == "id"
          ? `PERMINTAAN UNTUK ACARA SOSIAL`
          : `SOCIAL EVENTS ENQUIRY`
      );
    } else if (lowerCase(temp).includes("meeting")) {
      setHeadline(
        locale == "id"
          ? `PERMINTAAN UNTUK PAKET PERTEMUAN`
          : `MEETING PACKAGE ENQUIRY`
      );
    }
  }, [locale, item]);

  return (
    <>
      <Helmet title={`Detail Meeting & Events | Parador Hotels & Resorts`} />

      <HeaderV3
        headerItem={header}
        isHomepage={false}
        hotelBrands={hotelBrands}
      />

      {item ? (
        <DetailPageV2
          headline={
            item.category == "Social Events"
              ? locale == "id"
                ? "Acara Sosial"
                : "SOCIAL EVENTS"
              : locale == "id"
              ? "RUANG RAPAT"
              : "MEETING ROOM"
          }
          subHeadline={
            locale == "id"
              ? "Kami akan mempersiapkan acara-acara Anda dengan sebaik mungkin, baik itu pertemuan, rapat, maupun pesta ulang tahun, sehingga acara Anda menjadi yang tak terlupakan."
              : "Let us host your events whether it is a gathering, meeting or birthday and create the most remarkable one."
          }
          backTo={{
            text: locale == "id" ? "Rapat & Acara" : "Meeting & Events",
            link: `/${header.slug}/meeting-events`,
          }}
          button={{
            text: locale == "id" ? "PESAN" : "RESERVE",
            link: (isFormOpen: boolean | ((prevState: boolean) => boolean)) =>
              setIsFormOpen(isFormOpen),
            scroll: 500,
          }}
          title={item.title}
          price={item.start_from}
          description={item.description ? item.description : ""}
          accordionItems={
            item.category == "Social Events"
              ? [
                  {
                    items: null,
                    title: locale == "id" ? "Bagikan" : "Share",
                    type: "share",
                  },
                  {
                    items: item.tac,
                    title:
                      locale == "id"
                        ? "Ketentuan & Kondisi"
                        : "Terms & Conditions",
                    type: "list",
                  },
                ]
              : [
                  {
                    items: item.capacity,
                    title: locale == "id" ? "Kapasitas" : "Capacity",
                    type: "capacity",
                  },
                  {
                    items: null,
                    title: locale == "id" ? "Bagikan" : "Share",
                    type: "share",
                  },
                  {
                    items: [
                      {
                        name: locale == "id" ? "Brosur" : "Brochure",
                        item: item.brochures,
                      },
                      {
                        name: locale == "id" ? "Tata Ruang" : "Layout",
                        item: item.layout,
                      },
                      {
                        name: locale == "id" ? "Promosi" : "Promotion",
                        item: item.promotion,
                      },
                    ],
                    title: locale == "id" ? "Unduh" : "Download",
                    type: "download",
                  },
                  {
                    items: item.includes,
                    title:
                      locale == "id" ? "Sudah Termasuk" : "What's Includes",
                    type: "list",
                  },
                  {
                    items: item.tac,
                    title:
                      locale == "id"
                        ? "Ketentuan & Kondisi"
                        : "Terms & Conditions",
                    type: "list",
                  },
                ]
          }
          color={header.color_primary}
          images={item.gallery}
        />
      ) : (
        <Section>
          <Flex flexDir="column" w="100%" gap={10}>
            <Skeleton height="80px" />
            <Flex gap={6}>
              {isXLarge && <Skeleton flex={6} height="100vh" />}
              <Skeleton flex={12} height="100vh" />
            </Flex>
          </Flex>
        </Section>
      )}

      {isFormOpen && (
        <FormMeeting
          emailParticipants={header.email_participants}
          button={(isFormOpen: boolean | ((prevState: boolean) => boolean)) =>
            setIsFormOpen(isFormOpen)
          }
          color={header.color_primary}
          hotel={header.name}
          type={item.category}
          headline={headline}
        />
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
    email_participants,
    email_notify_events,
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
    email_participants: email_notify_events ?? email_participants,
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
