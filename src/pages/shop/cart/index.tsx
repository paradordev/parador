import {
  AspectRatio,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { toNumber } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import {
  IoAddSharp,
  IoChevronBack,
  IoClose,
  IoRemoveSharp,
} from "react-icons/io5";
import "swiper/css";
import InputVoucher from "../../../components/Input/InputVoucher";
import LinkTo from "../../../components/LinkTo";
import Helmet from "../../../containers/Helmet";
import Footer from "../../../layout/Footer";
import HeaderV3 from "../../../layout/HeaderV3";
import Section from "../../../layout/Section";
import {
  getHotelBrands,
  getHotelDetail,
  postCheckCoupon,
} from "../../../utils/api";
import {
  deleteLocalStorage,
  formatRupiah,
  getLocalStorage,
  setLocalStorage,
} from "../../../utils/functions";
import { IHeader } from "../../../utils/types";

export default function Home({
  header,
  hotelBrands,
}: {
  header: IHeader;
  hotelBrands: any;
}) {
  const { query, isReady, push, locale } = useRouter();

  const [cartItems, setCartItems] = useState<{}[]>([]);
  // const [price, setPrice] = useState([{ amount: 0, total: 0 }]);
  const [amount, setAmount] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [total, setTotal] = useState(0);
  const [isVoucherValid, setIsVoucherValid] = useState<any>();
  const [voucher, setVoucher] = useState<any>();

  useEffect(() => {
    function now() {
      const tempList = getLocalStorage(`cart`);
      if (!tempList) {
        setCartItems([]);
        return;
      }

      const tempItems = tempList.map((item: any) => {
        const temp = getLocalStorage(item);
        return temp;
      });

      setCartItems(tempItems);

      const tempVoucher = getLocalStorage(`shop-voucher`);
      if (tempVoucher) {
        setVoucher(tempVoucher);
        postCheckCoupon({ code: tempVoucher }).then((res) => {
          setIsVoucherValid(res.data);
        });
      }
    }
    now();
  }, []);

  useEffect(() => {
    let aTemp = 0,
      qTemp = 0;

    let dTemp = 0;

    cartItems.map((v: any) => {
      qTemp = qTemp + v.quantity;
      aTemp = aTemp + v.price * v.quantity;
    });

    setAmount(aTemp);
    setQuantity(qTemp);

    const totalTemp = aTemp - dTemp;

    if (isVoucherValid && isVoucherValid.isUsable) {
      setLocalStorage(`shop-voucher`, voucher);
      const tempDisc = toNumber(isVoucherValid.amount.replace(".00", ""));
      if (isVoucherValid.discount_type == "percent") {
        setTotal(totalTemp - totalTemp * (tempDisc / 100));
      } else {
        setTotal(totalTemp - tempDisc > 0 ? totalTemp - tempDisc : 0);
      }
    } else {
      setTotal(totalTemp);
    }
  }, [cartItems, isVoucherValid]);

  return (
    <>
      <Helmet title="My Cart | Parador Hotels & Resorts" />
      <HeaderV3
        headerItem={header}
        hotelBrands={hotelBrands}
        isHomepage={false}
      />
      <Section>
        <Box>
          <Heading
            as="h1"
            m={0}
            mb={2}
            fontWeight={400}
            letterSpacing="widest"
            color={`black`}
          >
            {locale == "id" ? "BELANJA" : "SHOP"}
          </Heading>
          <Text
            m={0}
            maxW={{ base: "90%", md: "50%" }}
            align="left"
            color="blackAlpha.700"
          >
            {locale == "id"
              ? "Nikmati penawaran & promosinya"
              : "Enjoy the offers & promotions"}
          </Text>
        </Box>
        <Flex mb={10}>
          <Divider orientation="horizontal" borderColor="blackAlpha.500" />
        </Flex>
        <Heading
          mb={0}
          as="h1"
          fontWeight={400}
          letterSpacing="wider"
          textAlign="left"
        >
          {locale == "id" ? "KERANJANG" : "MY CART"}
        </Heading>
        <Flex gap={16} flexDir={["column", null, null, "row"]}>
          <Flex flex={2} flexDir="column">
            {cartItems.length > 0 && (
              <Flex align="center" gap={1} mb={4} color="blackAlpha.700">
                <IoChevronBack />
                <Link href={`/shop`}>
                  {locale == "id" ? "Tambah Item Lagi" : "Add More Item"}
                </Link>
              </Flex>
            )}

            {cartItems.length > 0 ? (
              cartItems.map((item: any, i: any) => {
                return (
                  <Fragment key={i}>
                    <Flex mb={4}>
                      <Divider
                        orientation="horizontal"
                        borderColor="blackAlpha.300"
                      />
                    </Flex>
                    <Flex
                      key={item.slug}
                      mb={12}
                      gap={6}
                      color="blackAlpha.700"
                      flexDir={["column", null, null, "row"]}
                    >
                      <AspectRatio
                        maxW="300px"
                        w="100%"
                        h="100%"
                        position="relative"
                        ratio={4 / 3}
                      >
                        {item && item.thumb && (
                          <Image
                            src={item.thumb}
                            layout="fill"
                            alt=""
                            objectFit="cover"
                          />
                        )}
                      </AspectRatio>
                      {/* <Box
                        bg="gray.200"
                        w={["100%", null, null, 300]}
                        h={200}
                        position="relative"
                      >
                        {item && item.thumb && (
                          <Image
                            src={item.thumb}
                            layout="fill"
                            alt=""
                            objectFit="cover"
                          />
                        )}
                      </Box> */}
                      <Box>
                        <Heading
                          as="h3"
                          fontWeight={500}
                          letterSpacing="wider"
                          fontSize="xl"
                          mb={8}
                          cursor="pointer"
                          onClick={() =>
                            push(`/shop/detail?product=${item.slug}`)
                          }
                        >
                          {locale == "id" && item.name_id
                            ? item.name_id
                            : item.name}
                        </Heading>
                        <Flex>
                          <SimpleGrid columns={2} rowGap={4} columnGap={16}>
                            <Heading
                              as="h3"
                              fontWeight={500}
                              letterSpacing="wider"
                              fontSize="xl"
                            >
                              {locale == "id" ? "Harga" : "Price"}
                            </Heading>
                            <Heading
                              as="h3"
                              fontWeight={500}
                              letterSpacing="wider"
                              fontSize="xl"
                            >
                              {locale == "id" ? "Kuantitas" : "Quantity"}
                            </Heading>
                            <Text fontWeight={500}>
                              {formatRupiah(item.price)}
                            </Text>
                            <Flex align="center" gap={2}>
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
                                  cursor={"pointer"}
                                  color={"gray.600"}
                                  onClick={() => {
                                    let itemsTemp: any = [...cartItems];
                                    if (item.quantity == 1) {
                                      let slugs = getLocalStorage(`cart`);
                                      slugs = slugs.filter(
                                        (e: any) => e !== item.slug
                                      );
                                      itemsTemp.splice(i, 1);
                                      setCartItems(itemsTemp);
                                      setLocalStorage(`cart`, slugs);
                                      deleteLocalStorage(item.slug);
                                      return;
                                    }
                                    let itemTemp = { ...itemsTemp[i] };
                                    itemTemp.quantity = item.quantity - 1;
                                    itemsTemp[i] = itemTemp;
                                    setCartItems(itemsTemp);
                                    setLocalStorage(item.slug, itemTemp);
                                  }}
                                >
                                  <IoRemoveSharp size={24} />
                                </Box>
                                <Text fontSize="xl" as="span">
                                  {item.quantity}
                                </Text>
                                <Box
                                  cursor={
                                    item.quantity < item.maxQuantity &&
                                    quantity < 3
                                      ? "pointer"
                                      : "not-allowed"
                                  }
                                  color={
                                    item.quantity < item.maxQuantity &&
                                    quantity < 3
                                      ? "gray.600"
                                      : "gray.300"
                                  }
                                  onClick={() => {
                                    let itemsTemp: any = [...cartItems];

                                    if (!(item.quantity < item.maxQuantity)) {
                                      return;
                                    }

                                    if (quantity >= 3) return;

                                    let itemTemp = { ...itemsTemp[i] };
                                    itemTemp.quantity = item.quantity + 1;
                                    itemsTemp[i] = itemTemp;
                                    setCartItems(itemsTemp);
                                    setLocalStorage(item.slug, itemTemp);
                                  }}
                                >
                                  <IoAddSharp size={24} />
                                </Box>
                              </Flex>
                              <Box
                                cursor={"pointer"}
                                color={"gray.600"}
                                onClick={() => {
                                  let itemsTemp: any = [...cartItems];
                                  let slugs = getLocalStorage(`cart`);
                                  slugs = slugs.filter(
                                    (e: any) => e !== item.slug
                                  );
                                  itemsTemp.splice(i, 1);
                                  setCartItems(itemsTemp);
                                  setLocalStorage(`cart`, slugs);
                                  deleteLocalStorage(item.slug);
                                }}
                              >
                                <IoClose size={24} />
                              </Box>
                            </Flex>
                          </SimpleGrid>
                        </Flex>
                      </Box>
                    </Flex>
                  </Fragment>
                );
              })
            ) : (
              <Center>
                <Text color="blackAlpha.700">
                  Cart is Empty. go to{" "}
                  <LinkTo
                    activeColor="black"
                    to={`/shop`}
                    style={{
                      color: "black",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    Shop Page
                  </LinkTo>{" "}
                  to fill your cart.
                </Text>
              </Center>
            )}
          </Flex>

          <Flex
            flexDir="column"
            align="center"
            maxW={["100%", null, null, "25%"]}
            flex={1}
            color="blackAlpha.600"
            gap={6}
          >
            {/* <Flex align="center" gap={4}>
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
            </Flex> */}
            {isVoucherValid && (
              <Center
                bg={isVoucherValid.isUsable ? "blackAlpha.600" : "red.400"}
                w="full"
                p={3}
              >
                <Text
                  fontSize="small"
                  fontWeight={500}
                  textTransform="uppercase"
                  letterSpacing="wide"
                  color={"white"}
                >
                  {isVoucherValid.isUsable
                    ? `${
                        locale == "id" ? "Promo dipakai:" : "Promo used:"
                      } ${voucher}`
                    : locale == "id"
                    ? "Kode promo salah"
                    : "Promo code is invalid"}
                </Text>
              </Center>
            )}
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
                <Text as="span">{formatRupiah(amount)}</Text>
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
                  {locale == "id" ? "KUANTITAS" : "QUANTITY"}
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
              {isVoucherValid && isVoucherValid.isUsable && (
                <>
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
                      {locale == "id" ? "DISKON" : "DISCOUNT"}
                    </Text>
                    <Text as="span">
                      {isVoucherValid.discount_type == "percent"
                        ? isVoucherValid.amount.replace(".00", "")
                        : formatRupiah(
                            isVoucherValid.amount.replace(".00", "")
                          )}
                      {isVoucherValid.discount_type == "percent" && "%"}
                    </Text>
                  </Flex>
                </>
              )}
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
                <Text as="span">{formatRupiah(total)}</Text>
              </Flex>
            </Flex>
            <InputVoucher
              codePromo={(voucher: any) => setVoucher(voucher)}
              isValid={(isVoucherValid: any) =>
                setIsVoucherValid(isVoucherValid)
              }
            />
            <Button
              bg="black"
              color="white"
              w="100%"
              py={6}
              fontSize="md"
              onClick={() => {
                if (voucher) {
                  setVoucher(voucher);
                  postCheckCoupon({ code: voucher }).then((res) => {
                    setIsVoucherValid(res.data);
                    setLocalStorage(`shop-voucher`, voucher);
                  });
                }
                push(`/shop/cart/checkout`);
              }}
              disabled={!(cartItems.length > 0) || quantity > 3}
            >
              {locale == "id" ? "Pembayaran" : "Checkout"}
            </Button>
            {quantity >= 3 && (
              <Text fontSize="xs" color="red.500">
                {locale == "id"
                  ? "Mohon maaf, maksimal 3 barang dalam 1 troli. Mohon untuk melakukan sesi pembelian lain jika barang sudah terisi 3 barang"
                  : "Sorry, maximum 3 items in 1 cart. Please make a new purchase session if the cart is filled with 3 items"}
              </Text>
            )}
          </Flex>
        </Flex>
      </Section>
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
