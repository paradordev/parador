import { Box, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Autoplay, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Section from "../layout/Section";
import { useDining } from "../utils/hooks";
import { useLargeQuery } from "../utils/mediaQuery";
import CardLogo from "./CardLogo";

export default function SectionDining({
  bg = "gray.100",
  color = "black",
  params = {},
}) {
  const { locale } = useRouter();

  const { data, isError, isLoading } = useDining({
    ...params,
    cct_status: "publish",
  });
  const { isLarge, is2XLarge, isXLarge, is3XLarge } = useLargeQuery();

  if (!data || isError || data.length <= 0) return <></>;

  return (
    <Section bg={bg} color={color} className="section-swiper-animate">
      <Box>
        <Heading mb={2} as="h1" fontWeight={400} letterSpacing="wider">
          {locale == "id" ? "Restoran" : "Dining"}
        </Heading>
        <Text mb={8}>
          {locale == "id"
            ? `Manjakan lidah Anda dengan masakan khas lokal dan internasional di seluruh restoran kami.`
            : `Indulge your palate with local and international cuisines all of our
          restaurants.`}
        </Text>
        {data &&
          (data.length > 3 ? (
            <Swiper
              slidesPerView={
                isLarge
                  ? is2XLarge
                    ? Math.min(data.length, 3)
                    : Math.min(data.length, 2)
                  : Math.min(data.length, 1)
              }
              spaceBetween={30}
              loop={true}
              speed={1000}
              autoplay={{
                delay: 8000,
                pauseOnMouseEnter: true,
                disableOnInteraction: false,
              }}
              modules={[Autoplay, Pagination]}
              pagination={{
                clickable: true,
              }}
              className="mySwiper"
            >
              {data.map(({ name, hotel_name, thumb, logo, _ID }, i) => (
                <SwiperSlide key={i}>
                  <CardLogo
                    primary={name}
                    secondary={hotel_name}
                    thumb={thumb}
                    logo={logo}
                    target={`/dining/${_ID}`}
                    type="dining"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Swiper
              slidesPerView={
                isLarge ? Math.min(data.length, 3) : Math.min(data.length, 1)
              }
              spaceBetween={30}
              modules={[Pagination]}
              pagination={{
                clickable: true,
              }}
              className="mySwiper"
            >
              {data.map(({ name, hotel_name, thumb, logo, _ID }, i) => (
                <SwiperSlide key={i}>
                  <CardLogo
                    primary={name}
                    secondary={hotel_name}
                    thumb={thumb}
                    logo={logo}
                    target={`/dining/${_ID}`}
                    type="dining"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ))}
      </Box>
    </Section>
  );
}
