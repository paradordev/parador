import { Box, Divider, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef } from "react";
import { IoChevronDown } from "react-icons/io5";
import { Autoplay, Navigation, Pagination } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { convertImgHttps } from "../utils/functions";
import { useLargeQuery } from "../utils/mediaQuery";
import FormBookNow from "./FormBookNow";

export default function Hero({
  banner,
  marginTop,
  hotelName = "parador",
  hotelCode,
  isWithFormNow = true,
  images = [],
}) {
  const { query } = useRouter();

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const bulletsRef = useRef(null);
  const containerRef = useRef(null);

  const { isLarge } = useLargeQuery();

  return (
    <Box className="hero-container" mt={marginTop} ref={containerRef}>
      <Heading
        className="banner"
        as="h1"
        size="lg"
        fontWeight={300}
        letterSpacing="widestx"
        textAlign="center"
      >
        {banner}
      </Heading>
      {!images.length > 0 ? (
        <Box h={{ base: "70vh", md: "100vh" }} bg="gray.400" />
      ) : (
        <Swiper
          centeredSlides={true}
          autoplay={{
            delay: 8000,
            disableOnInteraction: false,
          }}
          loop={true}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={
            images.length == 1
              ? []
              : isLarge
              ? [Autoplay, Pagination, Navigation]
              : [Autoplay, Navigation]
          }
          className="mySwiper"
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
        >
          {images &&
            images.map((image, i) => {
              return (
                <SwiperSlide key={i}>
                  <Box
                    className="image-container"
                    h={{ base: "70vh", md: "100vh" }}
                    width="100vw"
                  >
                    <div className="image-overlay" />
                    <Image
                      className="image-slider"
                      src={convertImgHttps(image.url)}
                      alt=""
                      layout="fill"
                      objectFit="cover"
                    />
                  </Box>
                </SwiperSlide>
              );
            })}
          <Box
            opacity={0.6}
            className={isLarge ? `arrow-container` : `arrow-container-mobile`}
            onClick={() => {
              window.scrollTo({
                top: containerRef.current.clientHeight,
                behavior: "smooth",
              });
            }}
          >
            <IoChevronDown color="white" size="30px" />
          </Box>
          <div
            className={
              isLarge ? `navigation-container` : `navigation-container-mobile`
            }
          >
            <div ref={prevRef}>
              <Text fontSize="sm" color="white" cursor="pointer">
                PREV
              </Text>
            </div>
            <Divider
              width={isLarge ? 100 : `60%`}
              borderWidth={1.2}
              opacity={0.6}
              borderColor="white"
              bg="white"
              orientation="horizontal"
            />
            <div ref={nextRef}>
              <Text fontSize="sm" color="white" cursor="pointer">
                NEXT
              </Text>
            </div>
          </div>
        </Swiper>
      )}
      {isLarge && isWithFormNow && <FormBookNow hotelCode={hotelCode} />}
    </Box>
  );
}
