import { Box, Heading, Text } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
import Section from "../layout/Section";
import { useFetchSWR, useGetListHotel } from "../utils/hooks";
import CardLogo from "./CardLogo";
import { useLargeQuery } from "../utils/mediaQuery";
import { getHotelBrands } from "../utils/api";
import { useRouter } from "next/router";

export default function SectionHotel({ bg = "gray.100", color = "black" }) {
  // const { data, isError, isLoading } = useFetchSWR("hotel_list");
  const { locale } = useRouter();
  const { hotels, isError, isLoading } = useGetListHotel();
  const { isLarge, is2XLarge } = useLargeQuery();

  return (
    <Section bg={bg} className="section-swiper-animate">
      <Box color={color}>
        <Heading mb={2} as="h1" fontWeight={400} letterSpacing="wider">
          {locale == "id" ? "Hotel" : "Hotels"}
        </Heading>
        <Text mb={8}>
          {locale == "id"
            ? `Lebih hemat memesan kamar bersama kami ketika hendak merencanakan perjalanan Anda.`
            : `Book direct and save more when you stay at our hotel.`}
        </Text>
        {hotels && (
          <Swiper
            speed={1000}
            autoplay={{
              delay: 8000,
              pauseOnMouseEnter: true,
              disableOnInteraction: false,
            }}
            loop
            modules={[Autoplay, Pagination]}
            slidesPerView={
              isLarge
                ? is2XLarge
                  ? Math.min(hotels.length, 3)
                  : Math.min(hotels.length, 2)
                : Math.min(hotels.length, 1)
            }
            spaceBetween={30}
            pagination={{
              clickable: true,
            }}
            className="mySwiper"
          >
            {hotels.map(
              (
                { name, brand, hotel_location, thumbnail, logo_light, slug },
                i
              ) => (
                <SwiperSlide key={i}>
                  <CardLogo
                    primary={brand}
                    secondary={hotel_location}
                    thumb={thumbnail}
                    logo={logo_light}
                    target={`/${slug}`}
                    type="hotel"
                  />
                </SwiperSlide>
              )
            )}
          </Swiper>
        )}
      </Box>
    </Section>
  );
}
