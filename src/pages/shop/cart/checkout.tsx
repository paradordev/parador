import {
  AbsoluteCenter,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Select,
  Spinner,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { toNumber, toString } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import "swiper/css";
import * as Yup from "yup";
import Helmet from "../../../containers/Helmet";
import Footer from "../../../layout/Footer";
import HeaderV3 from "../../../layout/HeaderV3";
import Section from "../../../layout/Section";
import {
  getCountryList,
  getHotelBrands,
  getHotelDetail,
  getSigMatch,
  postCheckCoupon,
  postOrder,
  postOrderLater,
} from "../../../utils/api";
import { phoneRegExp } from "../../../utils/const";
import {
  deleteLocalStorage,
  formatRupiah,
  getLocalStorage,
} from "../../../utils/functions";
import { IHeader } from "../../../utils/types";

export default function Home({
  header,
  hotelBrands,
}: {
  header: IHeader;
  hotelBrands: any;
}) {
  const { query, isReady, push, locale, reload, replace } = useRouter();

  const [cartItems, setCartItems] = useState<{}[]>([]);
  const [amount, setAmount] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [total, setTotal] = useState(0);
  const [countries, setCounteries] = useState([]);
  const [showPop, setShowPop] = useState(false);
  const [isVoucherValid, setIsVoucherValid] = useState<any>();
  const [voucher, setVoucher] = useState<any>();

  useEffect(() => {
    if (!isReady) return;
    if (query.proccess == "succes" || query.transaction_id) {
      if (!query.sig) return;
      if (total <= 0) return;
      getSigMatch({ sig: query.sig, id: query.id, total: query.total }).then(
        (res) => {
          setShowPop(true);
          if (res.data.result) {
            postOrderLater({ id: query.id });

            const tempList = getLocalStorage(`cart`);

            tempList.map((item: any) => {
              deleteLocalStorage(item);
            });

            deleteLocalStorage(`cart`);

            setInterval(function () {
              window.open(`/shop`, "_self");
            }, 1000);
          }
        }
      );
    }
  }, [isReady]);

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
    getCountryList().then((res: any) => {
      setCounteries(res.data);
    });
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

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      country: "Indonesia",
      city: "",
      zip: "",
      street: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(20)
        .required(locale == "id" ? "Harus diisi" : "Required"),
      email: Yup.string()
        .email(
          locale == "id" ? "Email tidak valid" : "Please enter a valid email"
        )
        .required(locale == "id" ? "Harus diisi" : "Required"),
      phone: Yup.string()
        .matches(
          phoneRegExp,
          locale == "id"
            ? "Nomor telepon tidak valid"
            : "Phone must be a valid phone number"
        )
        .required(locale == "id" ? "Harus diisi" : "Required"),
      country: Yup.string(),
      city: Yup.string().required(locale == "id" ? "Harus diisi" : "Required"),
      zip: Yup.number().required(locale == "id" ? "Harus diisi" : "Required"),
      street: Yup.string().required(
        locale == "id" ? "Harus diisi" : "Required"
      ),
    }),
    onSubmit: () =>
      // { name, email, message, phone },
      // { setSubmitting, setStatus }
      {},
  });

  async function handleClick() {
    if (!formik.isValid) return;

    formik.setSubmitting(true);
    deleteLocalStorage(`shop-voucher`);
    const { email, name, city, country, street, zip, phone } = formik.values;
    await postOrder({
      name,
      email,
      phone,
      city,
      country,
      street,
      // payment: "cod",
      total,
      slug: "parador",
      zip: toString(zip),
      price: toString(total),
      coupon: voucher,
      items: cartItems.map(({ databaseId, quantity }: any) => {
        return { product_id: databaseId, quantity };
      }),
    }).then((res) => {
      res.status == 200 && formik.setStatus("success");

      //COD
      // setShowPop(true);
      // const tempList = getLocalStorage(`cart`);
      // tempList.map((item: any) => {
      //   deleteLocalStorage(item);
      // });
      // deleteLocalStorage(`cart`);

      //RDP PAYMENT
      window.open(res.data.redirect_url, "_self");
    });
    formik.setSubmitting(false);
  }

  return (
    <>
      <Helmet title="Checkout | Parador Hotels & Resorts" />
      <HeaderV3
        headerItem={header}
        hotelBrands={hotelBrands}
        isHomepage={false}
      />
      {(showPop || formik.isSubmitting) && (
        <Box
          position="fixed"
          top={0}
          zIndex={5}
          bg="blackAlpha.600"
          h="100vh"
          w="100vw"
        >
          <AbsoluteCenter
            w={["90vw", "70vw", "50vw"]}
            h={["60vh", "50vh", "40vh"]}
            bg="black"
            px={20}
            borderColor="white"
            borderRadius={0}
            borderWidth={10}
            zIndex={6}
          >
            {formik.isSubmitting ? (
              <Center w="100%" h="100%" gap={10}>
                <Spinner color="white" size="xl" />
              </Center>
            ) : (
              <Center w="100%" h="100%" flexDir="column" gap={10}>
                <Heading
                  as="h3"
                  fontWeight={400}
                  letterSpacing="widest"
                  fontSize="xl"
                  color={`white`}
                  textAlign="center"
                >
                  Thank you for purchasing, please check your email for payment
                </Heading>
                <Box>
                  <Button
                    variant="outline"
                    color="white"
                    onClick={() => {
                      push(`/shop`);
                    }}
                  >
                    {locale == "id" ? "TUTUP" : "CLOSE"}
                  </Button>
                </Box>
              </Center>
            )}
          </AbsoluteCenter>
        </Box>
      )}
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
          mb={2}
          as="h1"
          fontWeight={400}
          letterSpacing="wider"
          textAlign="left"
        >
          {locale == "id" ? "Pembayaran" : "Checkout"}
        </Heading>

        <Flex gap={12} flexDir={["column", null, null, "row"]}>
          <Grid
            flex={2}
            templateColumns={["repeat(2, 1fr)", null, "repeat(4, 1fr)"]}
            columnGap={[2, 4, 8]}
            rowGap={[3, null, 0]}
          >
            <GridItem colSpan={2}>
              <Flex justify="space-between" flexDir="column">
                <FormLabel
                  htmlFor="name"
                  fontSize="xl"
                  textTransform="uppercase"
                  fontWeight={400}
                >
                  {locale == "id" ? "Nama*" : "Name*"}
                </FormLabel>
                <Box>
                  <Input
                    fontSize="sm"
                    id="name"
                    name="name"
                    type="text"
                    borderRadius={0}
                    placeholder={locale == "id" ? "Nama Anda" : "Your Name"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                  />
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {formik.errors.name}
                  </Text>
                </Box>
              </Flex>
            </GridItem>
            <GridItem colSpan={1}>
              <Flex justify="space-between" flexDir="column">
                <FormLabel
                  htmlFor="email"
                  fontSize="xl"
                  textTransform="uppercase"
                  fontWeight={400}
                >
                  Email*
                </FormLabel>
                <Box>
                  <Input
                    fontSize="sm"
                    id="email"
                    name="email"
                    type="email"
                    borderRadius={0}
                    placeholder="Your@email.com"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  />
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {formik.errors.email}
                  </Text>
                </Box>
              </Flex>
            </GridItem>
            <GridItem colSpan={1}>
              <Flex justify="space-between" flexDir="column">
                <FormLabel
                  htmlFor="phone"
                  fontSize="xl"
                  textTransform="uppercase"
                  fontWeight={400}
                >
                  {locale == "id" ? "Telepon*" : "Phone*"}
                </FormLabel>
                <Box>
                  <Input
                    fontSize="sm"
                    id="phone"
                    name="phone"
                    type="tel"
                    borderRadius={0}
                    placeholder="0812345"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phone}
                  />
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {formik.errors.phone}
                  </Text>
                </Box>
              </Flex>
            </GridItem>

            <GridItem colSpan={2}>
              <Flex justify="space-between" flexDir="column">
                <FormLabel
                  htmlFor="country"
                  fontSize="xl"
                  textTransform="uppercase"
                  fontWeight={400}
                >
                  {locale == "id" ? "Negara*" : "Country*"}
                </FormLabel>
                <Box>
                  {/* <Input
                    fontSize="sm"
                    id="name"
                    name="name"
                    type="text"
                    borderRadius={0}
                    placeholder="Indonesia"
                  /> */}
                  <Select
                    borderRadius={0}
                    fontSize="sm"
                    defaultValue={`Indonesia`}
                    placeholder={`Indonesia`}
                    onChange={(e) => {
                      formik.setValues({
                        ...formik.values,
                        country: e.target.value,
                      });
                    }}
                  >
                    {countries.map((country: any) => {
                      return (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      );
                    })}
                  </Select>
                </Box>
              </Flex>
            </GridItem>
            <GridItem colSpan={1}>
              <Flex justify="space-between" flexDir="column">
                <FormLabel
                  htmlFor="city"
                  fontSize="xl"
                  textTransform="uppercase"
                  fontWeight={400}
                >
                  {locale == "id" ? "Kota*" : "City*"}
                </FormLabel>
                <Box>
                  <Input
                    fontSize="sm"
                    id="city"
                    name="city"
                    type="text"
                    borderRadius={0}
                    placeholder="Jakarta"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.city}
                  />
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {formik.errors.city}
                  </Text>
                </Box>
              </Flex>
            </GridItem>
            <GridItem colSpan={1}>
              <Flex justify="space-between" flexDir="column">
                <FormLabel
                  htmlFor="zip"
                  fontSize="xl"
                  textTransform="uppercase"
                  fontWeight={400}
                >
                  {locale == "id" ? "Kode Pos*" : "Zip Code*"}
                </FormLabel>
                <Box>
                  <Input
                    fontSize="sm"
                    id="zip"
                    name="zip"
                    type="number"
                    borderRadius={0}
                    placeholder={"000"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.zip}
                  />
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {formik.errors.zip}
                  </Text>
                </Box>
              </Flex>
            </GridItem>

            <GridItem colSpan={2}>
              <Flex justify="space-between" flexDir="column">
                <FormLabel
                  htmlFor="street"
                  fontSize="xl"
                  textTransform="uppercase"
                  fontWeight={400}
                >
                  {locale == "id" ? "Alamat*" : "Street*"}
                </FormLabel>
                <Box>
                  <Textarea
                    fontSize="sm"
                    id="street"
                    name="street"
                    borderRadius={0}
                    placeholder="St. New Y"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.street}
                  />
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {formik.errors.street}
                  </Text>
                </Box>
              </Flex>
            </GridItem>
          </Grid>

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
            <Button
              bg="black"
              color="white"
              w="100%"
              py={6}
              fontSize="md"
              onClick={handleClick}
              disabled={
                formik.isSubmitting ||
                !(cartItems.length > 0) ||
                !(formik.isValid && Object.keys(formik.touched).length > 0)
              }
            >
              {locale == "id" ? "Beli" : "Purchase"}
            </Button>
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
