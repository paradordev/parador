import { Box, Heading, Text } from "@chakra-ui/react";
import { isEmpty } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/effect-creative";
import { Swiper, SwiperSlide } from "swiper/react";
import { getWPImage } from "../utils/api";
import { convertImgHttps } from "../utils/functions";
import { safeMarginX, useLargeQuery } from "../utils/mediaQuery";
import { IHero } from "../utils/types";

export default function HeroV2({
  heroItem,
  hasFormNow = false,
  height,
}: {
  heroItem: IHero;
  hasFormNow: boolean;
  height: number | string;
}) {
  const { query, isReady } = useRouter();

  const bulletsRef = useRef<any>(null);
  const containerRef = useRef<any>(null);

  const { isLarge } = useLargeQuery();

  const [sliderCaptions, setSliderCaptions] = useState([]);

  const {
    id,
    name,
    banner,
    color_primary,
    hotel_code,
    slider,
    is_parador,
    has_banner,
  } = heroItem;

  useEffect(() => {
    async function f() {
      const temp: any = await Promise.all(
        slider.map(async ({ id }) => {
          const x = await getWPImage(id);
          let y = await x.data.caption;

          if (y) {
            y = y.rendered.replace("<p>", "").replace("</p>\n", "");
          }

          return y;
        })
      );
      setSliderCaptions(temp);
    }

    f();
  }, [isReady]);

  return (
    <Box
      className="hero-container-v2"
      ref={containerRef}
      h={{ base: "100%", md: height }}
      maxH={height}
    >
      {(!is_parador || has_banner) && (
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
      )}
      {slider && slider.length > 0 ? (
        <Swiper
          centeredSlides={true}
          speed={1000}
          autoplay={{
            delay: 8000,
            disableOnInteraction: false,
          }}
          loop={slider.length > 1}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={slider.length > 1 ? [Autoplay, Pagination, Navigation] : []}
          className="mySwiper"
          onInit={(swiper: any) => {
            if (slider.length > 1) {
              swiper.navigation.init();
              swiper.navigation.update();
            }
          }}
        >
          {slider &&
            slider.map((image: { url: string }, i: any | null | undefined) => {
              return (
                <SwiperSlide key={i}>
                  <Box
                    className="image-container"
                    h={{ base: "60vh", md: height }}
                    width="100%"
                  >
                    {!isEmpty(sliderCaptions[i]) && (
                      <Box
                        className="slider-caption"
                        zIndex={9}
                        position="absolute"
                        fontWeight={500}
                        fontSize={["x-small", "small"]}
                        bottom={["2px", "24px"]}
                        opacity={[0.5, 1]}
                        right={safeMarginX}
                        color="white"
                      >
                        <Text>{sliderCaptions[i]}</Text>
                      </Box>
                    )}
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      h="100%"
                      w="100%"
                      bg={
                        is_parador && hasFormNow
                          ? `blackAlpha.400`
                          : `blackAlpha.700`
                      }
                      zIndex={5}
                    />
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
        </Swiper>
      ) : (
        <Box h={{ base: "70vh", md: height }} bg="gray.400" />
      )}
      {/* {isLarge && hasFormNow && <FormBookNow hotelCode={hotel_code} />} */}
    </Box>
  );
}
