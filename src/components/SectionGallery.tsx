import {
  AspectRatio,
  Button,
  Center,
  Heading,
  Image,
  SimpleGrid,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import Section from "../layout/Section";
import { convertImgHttps } from "../utils/functions";
import { useFetchSWRv2 } from "../utils/hooks";
import { safeMarginX } from "../utils/mediaQuery";
import LoadingSpinner from "./LoadingSpinner";

export default function SectionGallery({
  color = "black",
  limit = 4,
  slug,
  id,
  type = "hotels",
}: {
  color: string;
  id: any;
  limit: number | null;
  slug: string | null | undefined;
  type?: string;
}) {
  const router = useRouter();
  const [data, setData] = useState<any>([]);

  const [hotels, isLoading, isError] = useFetchSWRv2(type, {
    _ID: id,
    cct_status: "publish",
  });

  const limitParam = type == "dining" ? 4 : limit ?? 12;

  const [limitCount, setLimitCount] = useState(limitParam);

  useEffect(() => {
    let temp: any;

    if (
      type == "hotels" &&
      hotels &&
      hotels[0].hotel_gallery &&
      hotels[0].hotel_gallery.length > 0
    ) {
      temp = [...hotels[0].hotel_gallery];
      if (limitCount) {
        temp = temp.slice(0, limitCount);
      }
    } else if (
      type == "dining" &&
      hotels &&
      hotels[0].gallery &&
      hotels[0].gallery.length > 0
    ) {
      temp = [...hotels[0].gallery];
      if (limitCount) {
        temp = temp.slice(0, limitCount);
      }
    }

    setData(temp);
  }, [hotels, limit, limitCount]);

  const ref = useRef(null);
  const [imgSrc, setImgSrc] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);

  // useOutsideClick({
  //   ref: ref,
  //   handler: () => setIsModalOpen(false),
  // });

  return (
    <>
      <Section bg="white">
        <Heading
          mb={2}
          as="h1"
          fontWeight={400}
          letterSpacing="wider"
          color={color}
        >
          {router.locale == "id" ? "Galeri" : "Gallery"}
        </Heading>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          data &&
          data.length > 0 && (
            <SimpleGrid columns={[2, 3, 4]} spacing={[4, 4, 6, 6, 8]}>
              {data.map((img: any, i: any) => (
                <AspectRatio
                  key={img.id}
                  ratio={1}
                  bg={`${color}40`}
                  cursor="pointer"
                  onClick={() => {
                    setPhotoIdx(i);
                    setImgSrc(convertImgHttps(img.url));
                    setIsModalOpen(true);
                  }}
                >
                  <Image
                    src={convertImgHttps(img.url)}
                    alt=""
                    objectFit="cover"
                    h="100%"
                    w="100%"
                  />
                </AspectRatio>
              ))}
            </SimpleGrid>
          )
        )}
        {hotels &&
          hotels.length > 0 &&
          (hotels[0].hotel_gallery || hotels[0].gallery) &&
          (limitCount < hotels[0].hotel_gallery?.length ||
            limitCount < hotels[0].gallery?.length) && (
            <Center mt={limit == null ? safeMarginX : 0}>
              <Button
                variant="dark"
                bg={color}
                _hover={{
                  bg: "white",
                  color,
                  borderColor: color,
                  borderWidth: 1,
                }}
                borderColor={color}
                onClick={() => {
                  if (limit == null) {
                    setLimitCount(limitCount + (type == "dining" ? 4 : 12));
                  } else {
                    router.push(slug ? `/${slug}/gallery` : `/gallery`);
                  }
                }}
              >
                {router.locale == "id" ? `Lebih Banyak` : `See More`}
              </Button>
            </Center>
          )}
      </Section>

      {isModalOpen && data && (
        <Lightbox
          mainSrc={data[photoIdx].url}
          nextSrc={data[(photoIdx + 1) % data.length]}
          prevSrc={data[(photoIdx + data.length - 1) % data.length]}
          onCloseRequest={() => setIsModalOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIdx((photoIdx + data.length - 1) % data.length)
          }
          onMoveNextRequest={() => setPhotoIdx((photoIdx + 1) % data.length)}
        />
      )}
    </>
  );
}
