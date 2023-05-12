import {
  AbsoluteCenter,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  useOutsideClick,
} from "@chakra-ui/react";
import { Markup } from "interweave";
import { isEmpty } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Helmet from "../../../containers/Helmet";
import FooterHotel from "../../../layout/FooterHotel";
import HeaderV3 from "../../../layout/HeaderV3";
import Section from "../../../layout/Section";
import { getHotelBrands, getHotelDetail } from "../../../utils/api";
import {
  objParserWP,
  objParserWPLv2,
  objParserWPLv3,
  objParserWPLv4,
} from "../../../utils/functions";
import { IHeader } from "../../../utils/types";

export default function FacilityPage({
  header,
  hotelBrands,
}: {
  header: IHeader;
  hotelBrands: any;
}) {
  const { locale } = useRouter();

  useEffect(() => {
    const temp = header.hotel_facilities;
    const a = objParserWP(temp, `item`);
    const b = objParserWPLv2(temp, `item`);
    const c = objParserWPLv3(temp, `item`);
    const d = objParserWPLv4(temp, `item`);

    const final = a.map((v, i) => {
      return {
        thumb: v,
        name: b[i],
        desc: c[i],
        desc_custom: d[i],
      };
    });

    setItems(final);
  }, []);

  const [items, setItems] = useState<
    {
      thumb: any;
      name: any;
      desc: any;
      desc_custom: any;
    }[]
  >();

  const [isPop, setIsPop] = useState(false);
  const [itemIdx, setItemIdx] = useState(0);

  useEffect(() => {
    if (isPop) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isPop]);

  return (
    <>
      <Helmet title={`Facility - ${header.name} | Parador Hotels & Resorts`} />
      <HeaderV3
        headerItem={header}
        isHomepage={false}
        hotelBrands={hotelBrands}
      />

      <Section>
        <Center flexDir="column" alignItems="center" mb={10}>
          <Heading
            mb={3}
            as="h1"
            fontWeight={400}
            letterSpacing="wider"
            color={header.color_primary}
            textAlign="center"
          >
            {locale == "id" ? `FASILITAS` : `FACILITIES`}
          </Heading>
          <Text maxW={{ base: "90%", md: "50%" }} align="center">
            {locale == "id"
              ? `Nikmati pengalaman menginap ala selebriti dengan kamar modern dan fasilitas yang nyaman`
              : `Enjoy a celebrity-style stay with modern facilities and comfortable rooms`}
          </Text>
        </Center>

        {items && (
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            columnGap={6}
            rowGap={12}
          >
            {items.map(({ desc, name, thumb }, i: any) => {
              return (
                <Flex key={name} flexDir="column" gap={3}>
                  <Box
                    h={["30vh", "42vh"]}
                    w="100%"
                    position="relative"
                    cursor="pointer"
                    onClick={() => {
                      setItemIdx(i);
                      setIsPop(true);
                    }}
                  >
                    <Image
                      layout="fill"
                      src={thumb}
                      alt={name}
                      objectFit="cover"
                    />
                  </Box>
                  <Heading
                    as="h2"
                    fontWeight={400}
                    fontSize="lg"
                    letterSpacing={4}
                    color="black"
                    mt={3}
                    noOfLines={1}
                  >
                    {name}
                  </Heading>
                  <Text
                    fontSize="sm"
                    letterSpacing={0.2}
                    lineHeight={1.2}
                    noOfLines={2}
                  >
                    {desc}
                  </Text>
                  <Box>
                    <Button
                      bg="transparent"
                      color={header.color_primary}
                      variant="outline"
                      borderColor={header.color_primary}
                      _hover={{ bg: header.color_primary, color: "white" }}
                      onClick={() => {
                        setItemIdx(i);
                        setIsPop(true);
                      }}
                    >
                      {locale == "id" ? "Lihat Lagi" : "See More"}
                    </Button>
                  </Box>
                </Flex>
              );
            })}
          </SimpleGrid>
        )}
      </Section>

      {isPop && items && items.length > 0 && (
        <FacilityPop
          color={header.color_primary}
          title={items[itemIdx].name}
          img={items[itemIdx].thumb}
          desc={items[itemIdx].desc}
          customDesc={items[itemIdx].desc_custom}
          button={(isPop: boolean | ((prevState: boolean) => boolean)) =>
            setIsPop(isPop)
          }
        />
      )}

      <Box h={10} />
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

function FacilityPop({
  color,
  title,
  img,
  desc,
  customDesc,
  button,
}: {
  color: any;
  title: any;
  img: any;
  desc: any;
  customDesc: any;
  button: any;
}) {
  const { locale } = useRouter();
  const popRef = useRef(null);

  useOutsideClick({
    ref: popRef,
    handler: () => button(false),
  });

  return (
    <Box
      position="fixed"
      top={0}
      zIndex={5}
      bg="blackAlpha.600"
      h="100vh"
      w="100vw"
    >
      <AbsoluteCenter
        w={["90vw", "70vw"]}
        h={["80vh"]}
        overflowY="scroll"
        // h="100%"
        mt={8}
        bg="white"
        py={8}
        px={[4, 10, 24]}
        zIndex={6}
        ref={popRef}
      >
        <Heading
          mb={10}
          as="h2"
          fontWeight={400}
          letterSpacing="wider"
          color={color}
          textAlign="center"
        >
          {title ?? ""}
        </Heading>
        <Box w="100%" h={["40vh", "50vh"]} position="relative" mb={6}>
          <Image
            src={img}
            alt={title + " Image"}
            layout="fill"
            objectFit="cover"
          />
        </Box>
        {isEmpty(customDesc) ? (
          <Center>
            <Text
              textAlign="center"
              color="blackAlpha.700"
              w={["90%", "70%", "50%"]}
            >
              {desc}
            </Text>
          </Center>
        ) : (
          <Box maxW="full">
            <Markup
              className="white-space-enter"
              content={customDesc.replace(/\\n/g, `<br>`)}
            />
          </Box>
        )}
        <Center my={10}>
          <Button
            bg={color}
            color={"white"}
            variant="solid"
            px={8}
            _hover={{
              variant: "outline",
              bg: "transparent",
              border: `1px solid ${color}`,
              color: color,
            }}
            onClick={() => {
              button(false);
            }}
          >
            {locale == "id" ? "TUTUP" : "CLOSE"}
          </Button>
        </Center>
      </AbsoluteCenter>
    </Box>
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
    home_headline,
    home_subheadline,
    hotel_sliders,
    hotel_gallery,
    location_short_en,
    facilities,
    brand,
    has_dining,
    has_wedding,
    has_meeting_events,
    hotel_facilities,
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
    hotel_facilities,
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
