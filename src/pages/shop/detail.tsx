import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Select,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { Markup } from "interweave";
import { capitalize } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { IoAddSharp, IoCartOutline, IoRemoveSharp } from "react-icons/io5";
import { Autoplay, Pagination } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import Helmet from "../../containers/Helmet";
import Footer from "../../layout/Footer";
import HeaderV3 from "../../layout/HeaderV3";
import Section from "../../layout/Section";
import { getHotelBrands, getHotelDetail } from "../../utils/api";
import {
  convertImgHttps,
  formatRupiah,
  getLocalStorage,
  setLocalStorage,
} from "../../utils/functions";
import { useSWRGraphQL } from "../../utils/hooks";
import { IHeader } from "../../utils/types";

export default function Home({
  header,
  hotelBrands,
}: {
  header: IHeader;
  hotelBrands: any;
}) {
  const { query, isReady, push, locale } = useRouter();

  const [prodDetail, isProdLoading, isProdError, prodMutate] =
    useSWRGraphQL(`query Product {
      product(id: "${query.product}", idType: SLUG) {
        id
          databaseId
          productId: databaseId
          averageRating
          slug
          description(format: RAW)
          galleryImages {
            nodes {
              id
              title
              altText
              mediaItemUrl
            }
          }
          image {
            id
            title(format: RAW)
            srcSet
            sourceUrl
          }
          name
          ... on SimpleProduct {
            price(format: RAW)
            id
            databaseId
            regularPrice(format: RAW)
            stockStatus
            stockQuantity
          }
          attributes {
            nodes {
              name
              options
              label
            }
          }
          sku
          shortDescription(format: RAW)
          productCategories {
            nodes {
              name
            }
          }
        }
      }`);

  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const [values, setValues] = useState({
    slug: ``,
    thumb: ``,
    name: ``,
    name_id: ``,
    price: ``,
    quantity: 1,
    maxQuantity: 1,
    attributes: [],
    id: 0,
    databaseId: "",
  });

  useEffect(() => {
    if (price == 0 && prodDetail) setPrice(prodDetail.product.price);

    if (prodDetail)
      setValues({
        slug: prodDetail.product.slug,
        name: prodDetail.product.name,
        name_id: productExtend.name,
        databaseId: prodDetail.product.databaseId,
        price: prodDetail.product.price,
        quantity,
        thumb: prodDetail.product.image.sourceUrl,
        maxQuantity:
          prodDetail.product.stockQuantity ??
          (prodDetail.product.stockStatus == "IN_STOCK" ? 99999 : 0),
        attributes:
          prodDetail.product.attributes &&
          prodDetail.product.attributes.nodes.map(({ label, options }: any) => {
            return { label: label, option: options[0] };
          }),
        id: prodDetail.product.productId,
      });
  }, [price, prodDetail]);

  async function handleAddCart() {
    if (!prodDetail) return;

    setIsAdded(true);
    setLocalStorage(values.slug, values);

    let temp = await getLocalStorage(`cart`);

    if (temp) {
      (await temp.indexOf(values.slug)) === -1 && temp.push(values.slug);
    } else {
      temp = [values.slug];
    }

    setLocalStorage(`cart`, temp);

    push(`/shop/cart`);
  }

  const [cartLength, setCartlength] = useState(
    getLocalStorage(`cart`) ? getLocalStorage(`cart`).length : 0
  );

  useEffect(() => {
    const temp = getLocalStorage(`cart`);
    setCartlength(temp ? temp.length : 0);
  }, [isReady, quantity, prodDetail]);

  const [productExtend, setProductExtend] = useState({
    name: "",
    desc: "",
    descShort: "",
  });

  function selectLangDesc(str: any) {
    let final = {
      title_id: "",
      desc_id: "",
      desc_en: "",
    };

    str.split("///").map((x: any) => {
      if (x.includes("title_id : ")) {
        final.title_id = x
          .replace("title_id : ", "")
          .replace(/\r|\n|amp;/g, "");
      }
      if (x.includes("desc_id : ")) {
        final.desc_id = x.replace("desc_id : ", "").replace(/\r|\n|amp;/g, "");
      }
      if (x.includes("desc_en : ")) {
        final.desc_en = x.replace("desc_en : ", "").replace(/\r|\n|amp;/g, "");
      }
    });

    return final;
  }

  function selectLangSimple(desc: any, split: any = "///") {
    const temp = desc ?? "";
    let finalDesc = temp;

    if (temp.includes(split)) {
      const x = temp.split(split);
      finalDesc = x[locale == "id" ? 1 : 0];
    }

    return finalDesc;
  }

  useEffect(() => {
    if (!prodDetail) return;

    const prod1 = selectLangDesc(prodDetail.product.description);
    const prod2 = selectLangSimple(prodDetail.product.shortDescription);

    if (locale == "id") {
      setProductExtend({
        name: prod1.title_id,
        desc: prod1.desc_id,
        descShort: prod2,
      });
    } else {
      setProductExtend({
        name: prodDetail.product.name,
        desc: prod1.desc_en,
        descShort: prod2,
      });
    }
  }, [prodDetail, locale]);

  return (
    <>
      <Helmet
        title={`${
          prodDetail ? prodDetail.product.name : ``
        } - Detail | Parador Hotels & Resorts`}
        description={prodDetail?.product?.shortDescription}
        image={values?.thumb}
      />
      <HeaderV3
        headerItem={header}
        hotelBrands={hotelBrands}
        isHomepage={false}
      />

      {prodDetail && price >= 1 ? (
        <Section bg="white" color={`black`}>
          <Box>
            <Heading
              mb={2}
              as="h1"
              fontWeight={400}
              letterSpacing="wider"
              textAlign="center"
            >
              {prodDetail.product.productCategories?.nodes[0].name.includes(
                "Souvenir"
              ) && "Parador Merchandise"}
              {prodDetail.product.productCategories?.nodes[0].name.includes(
                "Experience"
              ) && "Parador Stayventure"}
              {prodDetail.product.productCategories?.nodes[0].name.includes(
                "Voucher"
              ) && "Parador Gift Voucher"}
            </Heading>
            <Flex
              justify="space-between"
              align="flex-start"
              w="100%"
              mb={10}
              color="blackAlpha.700"
              fontSize="small"
            >
              <Box flex={1}>
                {/* <Flex align="center" w="100%">
                  <LinkTo
                    activeColor="var(--chakra-colors-blackAlpha-500)"
                    to={`/shop`}
                  >
                    <Flex align="center" gap={1}>
                      <IoChevronBack />
                      {locale == "id"
                        ? `Kembali ke halaman Toko`
                        : `Back to Shop page`}
                    </Flex>
                  </LinkTo>
                </Flex> */}
              </Box>
              <Flex flex={2} w="100%" justify="center">
                <Text textAlign="center">
                  {locale == "id"
                    ? "Nikmati promosinya"
                    : "Enjoy the promotions"}
                </Text>
              </Flex>
              <Box flex={1}></Box>
            </Flex>
          </Box>

          <Flex gap={10} flexDir={["column", null, null, "row"]}>
            <Flex
              maxW={["100%", null, null, "25%"]}
              flex={1}
              flexDir="column"
              color="blackAlpha.900"
              fontSize="sm"
            >
              <Heading
                fontSize="2xl"
                letterSpacing="widest"
                fontWeight={400}
                mb={2}
              >
                {productExtend.name}
              </Heading>
              <Text mb={6}>{productExtend.descShort}</Text>

              {prodDetail.product.attributes &&
                prodDetail.product.attributes.nodes.map(
                  ({ label, options }: any, i: any) => {
                    return (
                      <Fragment key={label}>
                        <Heading
                          fontSize="xl"
                          letterSpacing="widest"
                          fontWeight={400}
                          mb={2}
                        >
                          {label}
                        </Heading>
                        <Select
                          borderRadius={0}
                          mb={6}
                          onChange={(e) => {
                            let itemsTemp: any = [...values.attributes];
                            let itemTemp = { label, option: e.target.value };
                            itemsTemp[i] = itemTemp;
                            setValues({ ...values, attributes: itemsTemp });
                          }}
                        >
                          {options.map((option: any) => {
                            const value = option.replace(/-/g, ` `);
                            return (
                              <option value={value} key={option}>
                                {capitalize(value)}
                              </option>
                            );
                          })}
                        </Select>
                      </Fragment>
                    );
                  }
                )}

              <Heading
                fontSize="xl"
                letterSpacing="widest"
                fontWeight={400}
                mb={2}
              >
                {locale == "id" ? "Kuantitas" : "Quantity"}
              </Heading>
              <Flex
                justify="space-between"
                align="center"
                w={120}
                p={2}
                borderColor="gray.300"
                color="gray.600"
                borderWidth={1}
              >
                <Box
                  cursor={quantity > 1 ? "pointer" : "not-allowed"}
                  color={quantity > 1 ? "gray.600" : "gray.300"}
                  onClick={() => {
                    const temp = quantity;
                    price && setPrice(prodDetail.product.price * (temp - 1));
                    quantity > 1 && setQuantity(temp - 1);
                  }}
                >
                  <IoRemoveSharp size={24} />
                </Box>
                <Text fontSize="xl" as="span">
                  {quantity}
                </Text>
                <Box
                  cursor={
                    quantity <
                      (prodDetail.product.stockQuantity ??
                        (prodDetail.product.stockStatus == "IN_STOCK"
                          ? 99999
                          : 0)) && quantity + (cartLength ?? 3) < 3
                      ? "pointer"
                      : "not-allowed"
                  }
                  color={
                    quantity <
                      (prodDetail.product.stockQuantity ??
                        (prodDetail.product.stockStatus == "IN_STOCK"
                          ? 99999
                          : 0)) && quantity + (cartLength ?? 3) < 3
                      ? "gray.600"
                      : "gray.300"
                  }
                  onClick={() => {
                    const temp = quantity;

                    price && setPrice(prodDetail.product.price * (temp + 1));
                    quantity <
                      (prodDetail.product.stockQuantity ??
                        (prodDetail.product.stockStatus == "IN_STOCK"
                          ? 99999
                          : 0)) &&
                      quantity + (cartLength ?? 3) < 3 &&
                      setQuantity(temp + 1);
                  }}
                >
                  <IoAddSharp size={24} />
                </Box>
              </Flex>
              {(cartLength >= 3 || quantity >= 3) && (
                <Text fontSize="xs" color="red.500" mt={3}>
                  {locale == "id"
                    ? "Mohon maaf, maksimal 3 barang dalam 1 troli. Mohon untuk melakukan sesi pembelian lain jika barang sudah terisi 3 barang"
                    : "Sorry, maximum 3 items in 1 cart. Please make a new purchase session if the cart is filled with 3 items"}
                </Text>
              )}
            </Flex>
            <Box flex={2} maxW={["100%", null, null, "50%"]}>
              <Box
                h={["40vh", "55vh", "70vh"]}
                w="100%"
                bg={`gray.400`}
                position="relative"
                className="section-swiper-v2"
              >
                <Swiper
                  centeredSlides={true}
                  loop={prodDetail.product.galleryImages.nodes.length > 1}
                  pagination={{
                    clickable: true,
                  }}
                  autoplay={{
                    delay: 8000,
                    pauseOnMouseEnter: true,
                    disableOnInteraction: true,
                  }}
                  modules={
                    prodDetail.product.galleryImages.nodes.length > 1
                      ? [Autoplay, Pagination]
                      : []
                  }
                >
                  {prodDetail.product.galleryImages.nodes.map(
                    ({ title, altText, mediaItemUrl, id }: any) => {
                      return (
                        <SwiperSlide key={id}>
                          <Box w="100%" h="100%" position="relative">
                            <Image
                              alt={altText}
                              src={convertImgHttps(mediaItemUrl)}
                              layout="fill"
                              objectFit="cover"
                            />
                          </Box>
                        </SwiperSlide>
                      );
                    }
                  )}
                </Swiper>
              </Box>
            </Box>
            <Flex
              flexDir="column"
              align="center"
              maxW={["100%", null, null, "25%"]}
              flex={1}
              color="blackAlpha.600"
              gap={6}
            >
              <Flex align="center" gap={4}>
                <Center
                  h={62}
                  w={62}
                  borderWidth={2}
                  borderRadius="50%"
                  borderColor="blackAlpha.600"
                >
                  <IoCartOutline size={32} />
                </Center>
                <Heading fontSize="2xl" letterSpacing="widest" fontWeight={400}>
                  {locale == "id" ? "Keranjang" : "Your Cart"}
                </Heading>
              </Flex>

              <Flex
                flexDir="column"
                borderWidth={1}
                borderRadius={16}
                borderColor="blackAlpha.200"
                w="100%"
                gap={3}
              >
                <Flex
                  justify="space-between"
                  fontSize="xs"
                  fontWeight={500}
                  px={6}
                  pt={4}
                >
                  <Text as="span">{locale == "id" ? "JUMLAH" : "AMOUNT"}</Text>
                  <Text as="span">
                    {formatRupiah(prodDetail.product.price)}
                  </Text>
                </Flex>
                <Flex>
                  <Divider orientation="horizontal" />
                </Flex>
                <Flex
                  justify="space-between"
                  fontSize="xs"
                  fontWeight={500}
                  px={6}
                >
                  <Text as="span">
                    {locale === "id" ? "KUANTITAS" : "QUANTITY"}
                  </Text>
                  <Text as="span">{quantity}</Text>
                </Flex>
                <Flex>
                  <Divider orientation="horizontal" />
                </Flex>
                <Flex
                  justify="space-between"
                  fontSize="xs"
                  fontWeight={500}
                  px={6}
                >
                  <Text as="span">
                    {locale == "id" ? "BIAYA ANTAR" : "DELIVERY FEE"}
                  </Text>
                  <Text as="span">{locale == "id" ? "GRATIS" : "FREE"}</Text>
                </Flex>{" "}
                <Flex>
                  <Divider orientation="horizontal" />
                </Flex>
                <Flex
                  justify="space-between"
                  fontSize="xs"
                  fontWeight={500}
                  px={6}
                >
                  <Text as="span">
                    {locale == "id" ? "TIPE PENGIRIMAN" : "DELIVERY TYPE"}
                  </Text>
                  <Text as="span">Regular</Text>
                </Flex>
                <Flex
                  mb={-0.2}
                  justify="space-between"
                  fontSize="xs"
                  fontWeight={600}
                  bg="blackAlpha.200"
                  color="blackAlpha.700"
                  p={6}
                  borderBottomRadius={15}
                >
                  <Text as="span">TOTAL</Text>
                  <Text as="span">{formatRupiah(price)}</Text>
                </Flex>
              </Flex>

              {/* <Input
                type="text"
                py={6}
                placeholder="INSERT PROMO CODE"
                color="black"
                borderRadius={0}
                textAlign="center"
              /> */}

              <Button
                disabled={
                  isAdded ||
                  prodDetail.product.stockStatus != "IN_STOCK" ||
                  cartLength == 3
                }
                bg="black"
                color="white"
                w="100%"
                py={6}
                fontSize="md"
                onClick={handleAddCart}
              >
                {prodDetail.product.stockStatus == "IN_STOCK"
                  ? locale == "id"
                    ? `Masukkan Keranjang`
                    : `Add To Cart`
                  : `Out of Stock`}
              </Button>
            </Flex>
          </Flex>

          <Flex
            gap={20}
            h={["full", null, null, "50vh"]}
            mt={12}
            flexDir={["column", null, null, "row"]}
          >
            <Box
              w={["full", null, null, "50%"]}
              position="relative"
              h={["50vh", null, null, "full"]}
            >
              <Image
                src={prodDetail.product.image.sourceUrl}
                alt={prodDetail.product.name}
                layout="fill"
                objectFit="cover"
              />
            </Box>
            <Center w={["full", null, null, "50%"]}>
              <Text
                textTransform="uppercase"
                fontSize="small"
                letterSpacing="wide"
                fontWeight={400}
                color="blackAlpha.700"
                mb={2}
              >
                <Markup
                  className="white-space-enter"
                  content={productExtend.desc.replace(/\\n/g, `<br/>`) ?? ""}
                />
              </Text>
            </Center>
          </Flex>
        </Section>
      ) : (
        <Section>
          <Center h="50vh">
            <Spinner size="lg" />
          </Center>
        </Section>
      )}

      <Footer
        loc={header.location_url}
        address={header.location_long}
        email={header.email}
        phone={header.phone}
      />
    </>
  );
}

export async function getStaticProps({ locale }: any) {
  let temp;

  const data: any = await getHotelDetail({
    is_parador: "true",
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
    store_headline,
    store_slider,
    location_short_en,
    has_dining,
    has_wedding,
    has_meeting_events,
    has_social_events,
    wedding_thumbnail,
    events_thumbnail,
    meeting_thumbnail,
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
    has_social_events,
    wedding_thumbnail,
    events_thumbnail,
    meeting_thumbnail,
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
