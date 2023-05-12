import {
  AbsoluteCenter,
  AspectRatio,
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
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { toNumber, toString } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import "swiper/css";
import * as Yup from "yup";
import InputVoucher from "../../components/Input/InputVoucher";
import Helmet from "../../containers/Helmet";
import Footer from "../../layout/Footer";
import HeaderV3 from "../../layout/HeaderV3";
import Section from "../../layout/Section";
import {
  getCountryList,
  getHotelBrands,
  getHotelDetail,
  getSigMatch,
  postOrder,
  postOrderLater,
} from "../../utils/api";
import { phoneRegExp } from "../../utils/const";
import { formatRupiah } from "../../utils/functions";
import { useSWRGraphQL } from "../../utils/hooks";
import { IHeader } from "../../utils/types";

export default function Home({
  header,
  hotelBrands,
}: {
  header: IHeader;
  hotelBrands: any;
}) {
  const { query, isReady, push, locale, reload, replace } = useRouter();

  const [products, isLoading, isError] = useSWRGraphQL(`query p_card {
      products(where: {tagIn: "gift card"}) {
        nodes {
          id
          databaseId
          slug
          image {
            id
            altText
            sourceUrl
          }
          name
          ... on VariableProduct {
            price(format: RAW)
            regularPrice(format: RAW)
            id
            databaseId
            sku
            variations {
              nodes {
                id
                databaseId
                name
              }
            }
          }
        }
      }
  }`);

  const [cards, setCards] = useState<any>();
  const [variant, setVariant] = useState(0);
  const [selectedCard, setSelectedCard] = useState<any>();
  const [selectedPrice, setSelectedPrice] = useState<any>(500000);
  const [quanitity, setQuantity] = useState<any>(1);
  const [cardType, setCardtype] = useState("0");
  const [messages, setMessages] = useState("");
  const [isVoucherValid, setIsVoucherValid] = useState<any>();
  const [voucher, setVoucher] = useState<any>();
  const [total, setTotal] = useState<any>();

  useEffect(() => {
    if (!products) return;
    setCards(products.products.nodes);

    const totalTemp = selectedPrice * quanitity;

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
  }, [products, selectedPrice, quanitity, isVoucherValid]);

  useEffect(() => {
    cards && setSelectedCard(cards[0]);
  }, [cards]);

  let cardValues = [];
  for (let i = 1; i <= 30; i++) {
    cardValues.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }

  const [countries, setCounteries] = useState([]);

  useEffect(() => {
    getCountryList().then((res: any) => {
      setCounteries(res.data);
    });
  }, []);

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

    const { email, name, city, country, street, zip, phone } = formik.values;

    await postOrder({
      name,
      email,
      phone,
      city,
      country,
      street,
      zip: toString(zip),
      price: toString(selectedPrice),
      slug: "parador",
      coupon: voucher,
      items: [
        {
          product_id: selectedCard.databaseId,
          quantity: quanitity,
          variation_id: selectedCard.variations.nodes[variant].databaseId,
        },
      ],
      message: {
        message: messages,
        type: cardType == "0" ? `digital` : `physical`,
      },
      type: "card",
    }).then((res) => {
      res.status == 200 && formik.setStatus("success");
      // setShowPop(true); //COD
      window.open(res.data.redirect_url, "_self"); //RDP PAYMENT
    });
    formik.setSubmitting(false);
  }

  const [showPop, setShowPop] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    if (query.proccess == "succes" || query.transaction_id) {
      if (!query.sig) return;
      getSigMatch({ sig: query.sig, id: query.id, total: query.total }).then(
        (res) => {
          setShowPop(true);
          if (res.data.result) {
            postOrderLater({ id: query.id });

            setInterval(function () {
              window.open(`/gift-card`, "_self");
            }, 1000);
          }
        }
      );
    }
  }, [isReady]);

  return (
    <>
      <Helmet
        title={
          locale == "id"
            ? `kartu Hadiah | Parador Hotels & Resorts`
            : `Gift Card | Parador Hotels & Resorts`
        }
        description={
          locale == "id"
            ? "Parador Hotels memiliki toko online yang menyediakan voucher hotel untuk sejumlah hotel dalam grup kami. Dengan parador-hotels.com, Anda dapat dengan mudah menjelajahi berbagai pilihan hotel, memilih lokasi yang Anda inginkan, dan membeli voucher hanya dalam beberapa kali klik. Apapun keperluan Anda, apakah itu liburan mewah, akhir pekan romantis, atau perjalanan bisnis, situs web kami menawarkan berbagai pilihan yang dapat disesuaikan dengan kebutuhan Anda. Nikmati pengalaman belanja yang mudah dan menyenangkan dengan Parador Hotels, di mana kepuasan Anda adalah prioritas utama bagi kami."
            : "Parador Hotels is your go-to online shop for purchasing hotel vouchers for a wide range of hotels within our group. With parador-hotels.com, you'll have access to a convenient platform that allows you to browse through various hotel options, select your preferred location, and purchase vouchers in just a few clicks. Whether you're looking for a luxurious getaway, a romantic weekend, or a business trip, our website offers an extensive range of options to choose from. Enjoy hassle-free shopping with Parador Hotels, where your satisfaction is our top priority."
        }
        image="https://backend.parador-hotels.com/wp-content/uploads/2023/02/Home-1.webp"
      />
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
                  textAlign="center"
                  color={`white`}
                >
                  Thank you for purchasing, please check your email for payment
                </Heading>
                <Box>
                  <Button
                    variant="outline"
                    color="white"
                    _hover={{ opacity: 0.8 }}
                    onClick={() => {
                      setShowPop(false);
                    }}
                  >
                    CLOSE
                  </Button>
                </Box>
              </Center>
            )}
          </AbsoluteCenter>
        </Box>
      )}

      <Section bg="white" color={`black`}>
        <Box>
          <Heading
            as="h1"
            m={0}
            mb={2}
            fontWeight={400}
            letterSpacing="widest"
            color={`black`}
          >
            {locale == "id" ? "Kartu Hadiah" : "Gift Card"}
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

        {isLoading || !cards || !selectedCard ? (
          <Center h="50vh">
            <Spinner size="xl" />
          </Center>
        ) : (
          <Flex gap={8} flexDir={["column", null, null, "row"]}>
            <Flex flex={4} flexDir="column" gap={10}>
              <Flex mb={10}>
                <Divider
                  orientation="horizontal"
                  borderColor="blackAlpha.500"
                />
              </Flex>

              <Flex gap={2} flexDir={["column", null, null, "row"]}>
                <Flex
                  w={["100%", null, null, "50%"]}
                  h="100%"
                  flexDir="column"
                  gap={10}
                >
                  <Flex align="center" gap={4}>
                    <Center
                      h={62}
                      w={62}
                      borderWidth={2}
                      borderRadius="50%"
                      borderColor="blackAlpha.600"
                    >
                      <Text fontSize={30}>1</Text>
                    </Center>
                    <Heading
                      fontSize="2xl"
                      letterSpacing="widest"
                      fontWeight={400}
                    >
                      {locale == "id" ? "Kustomisasi" : "Customize"}
                    </Heading>
                  </Flex>
                  <Flex justify="space-between" flexDir="column">
                    <FormLabel
                      letterSpacing="widest"
                      fontSize="xl"
                      textTransform="uppercase"
                      fontWeight={400}
                      mb={[0, 2, 4]}
                    >
                      {locale == "id" ? "Pilih Desain:" : "Select Design:"}
                    </FormLabel>
                    <Box w="xs">
                      <Select
                        borderRadius={0}
                        fontSize="sm"
                        defaultValue={selectedCard.name}
                        onChange={(e) => {
                          setSelectedCard(cards[e.target.value]);
                        }}
                      >
                        {cards.map((card: any, i: any) => {
                          return (
                            <option key={card.name} value={i}>
                              {card.name}
                            </option>
                          );
                        })}
                      </Select>
                    </Box>
                  </Flex>
                </Flex>

                <Flex
                  mt={[8, null, null, 0]}
                  w={["100%", null, null, "50%"]}
                  h="100%"
                  flexDir="column"
                  gap={10}
                >
                  <Flex align="center" gap={4}>
                    <Center
                      h={62}
                      w={62}
                      borderWidth={2}
                      borderRadius="50%"
                      borderColor="blackAlpha.600"
                    >
                      <Text fontSize={30}>2</Text>
                    </Center>
                    <Heading
                      fontSize="2xl"
                      letterSpacing="widest"
                      fontWeight={400}
                    >
                      {locale == "id" ? "Pembayaran" : "Checkout"}
                    </Heading>
                  </Flex>

                  <AspectRatio ratio={16 / 9} mr={16}>
                    <Flex h="100%" w="100%" borderRadius={16}>
                      {selectedCard.image.sourceUrl ? (
                        <Image
                          src={selectedCard.image.sourceUrl}
                          alt={selectedCard.image.alt}
                          objectFit="cover"
                          layout="fill"
                        />
                      ) : (
                        <Flex bg="gray.300" w="100%" h="100%" />
                      )}
                    </Flex>
                  </AspectRatio>
                </Flex>
              </Flex>

              <Flex mb={10}>
                <Divider
                  orientation="horizontal"
                  borderColor="blackAlpha.500"
                />
              </Flex>

              <SimpleGrid columns={[1, null, 2]} rowGap={[2, 4, 10]}>
                <FormLabel
                  letterSpacing="widest"
                  fontSize="xl"
                  textTransform="uppercase"
                  fontWeight={400}
                  mb={[0, 2, 4]}
                >
                  {locale == "id" ? "Pilih Nominal" : "Select/Enter a Value"}
                </FormLabel>

                <Flex flexDir="column" gap={3}>
                  <Select
                    borderRadius={0}
                    fontSize="sm"
                    onChange={(e) => {
                      const temp = JSON.parse(e.target.value);
                      setSelectedPrice(temp.price);
                      setVariant(temp.variant);
                    }}
                    defaultValue={500000}
                  >
                    {selectedCard.price.split(",").map((p: any, i: any) => {
                      const value = { price: p, variant: i };
                      return (
                        <option key={p} value={JSON.stringify(value)}>
                          {formatRupiah(p)}
                        </option>
                      );
                    })}
                  </Select>
                  <Text fontSize="sm" mb={[4, 2]} color="blackAlpha.800">
                    {locale == "id"
                      ? "Pilih nominal antara"
                      : "Enter whole amount between"}{" "}
                    Rp500.000 - 2.000.000
                  </Text>
                  {/* <Flex gap={3}>
                    <Button bg="blackAlpha.500" color="white">
                      Rp 500.000
                    </Button>
                    <Button bg="blackAlpha.500" color="white">
                      Rp 1.000.000
                    </Button>
                    <Button bg="blackAlpha.500" color="white">
                      Rp 1.500.000
                    </Button>
                    <Button bg="blackAlpha.500" color="white">
                      Rp 2.000.000
                    </Button>
                  </Flex> */}
                </Flex>

                <FormLabel
                  letterSpacing="widest"
                  fontSize="xl"
                  textTransform="uppercase"
                  fontWeight={400}
                  mb={[0, 2, 4]}
                >
                  {locale == "id" ? "Jumlah" : "Quantity"}
                </FormLabel>
                <Flex flexDir="column" gap={3}>
                  <Select
                    borderRadius={0}
                    fontSize="sm"
                    defaultValue={`1`}
                    onChange={(e) => {
                      setQuantity(e.target.value);
                    }}
                  >
                    {cardValues}
                  </Select>
                  <Text fontSize="sm" mb={[4, 2]} color="blackAlpha.800">
                    {locale == "id"
                      ? "Tambahkan sampai 30 kartu ke orderan anda"
                      : "Add up to 30 cards to your order"}
                  </Text>
                </Flex>

                <FormLabel
                  letterSpacing="widest"
                  fontSize="xl"
                  textTransform="uppercase"
                  fontWeight={400}
                  mb={[0, 2, 4]}
                >
                  {locale == "id" ? "Pesan" : "Message"}
                </FormLabel>
                <Flex flexDir="column" gap={3}>
                  <Textarea
                    maxLength={200}
                    fontSize="sm"
                    id="messages"
                    name="messages"
                    borderRadius={0}
                    placeholder={
                      locale == "id"
                        ? "Masukkan pesan pribadi.."
                        : "Add your personal message here.."
                    }
                    onChange={(e) => {
                      setMessages(e.target.value);
                    }}
                  />
                  <Text fontSize="sm" mb={[4, 2]} color="blackAlpha.800">
                    {200 - messages.length}{" "}
                    {locale == "id" ? "karakter tersisa." : "Character left."}
                  </Text>
                </Flex>

                <FormLabel
                  letterSpacing="widest"
                  fontSize="xl"
                  textTransform="uppercase"
                  fontWeight={400}
                  mb={[0, 2, 4]}
                >
                  {locale == "id" ? "Tipe Kartu" : "Send as"}
                </FormLabel>
                <RadioGroup onChange={setCardtype} value={cardType}>
                  <Stack
                    direction="row"
                    gap={12}
                    color="blackAlpha.700"
                    defaultValue="0"
                  >
                    <Radio value="0">Digital</Radio>
                  </Stack>
                </RadioGroup>
              </SimpleGrid>

              <Flex>
                <Divider orientation="horizontal" />
              </Flex>

              <Heading
                as="h1"
                m={0}
                mb={2}
                fontWeight={400}
                letterSpacing="widest"
                color={`black`}
              >
                {locale == "id" ? "Pengiriman" : "Delivery"}
              </Heading>

              <Grid
                flex={2}
                templateColumns={["repeat(2, 1fr)", null, "repeat(4, 1fr)"]}
                columnGap={6}
                rowGap={8}
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
                      <Text fontSize="xs" color="red.500" mt={1}>
                        {formik.errors.country}
                      </Text>
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
                      <Input
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

                <GridItem colSpan={2}>
                  <Flex justify="flex-end" flexDir="column" h="100%">
                    {/* <Box /> */}

                    <Button
                      display={["none", null, null, "block"]}
                      variant="dark"
                      h="40px"
                      onClick={() =>
                        window.scrollTo({
                          top: 100,
                          behavior: "smooth",
                        })
                      }
                      disabled={
                        !(
                          formik.isValid &&
                          Object.keys(formik.touched).length > 0
                        )
                      }
                    >
                      {locale == "id" ? "Masukkan Keranjang" : "Add to Cart"}
                    </Button>
                  </Flex>
                </GridItem>
              </Grid>
            </Flex>
            <Flex
              flexDir="column"
              align="center"
              maxW={["full", null, null, "25%"]}
              flex={1}
              color="blackAlpha.600"
              gap={6}
              // position="sticky"
              // position="absolute"
              // top="50%"
              // right={0}
              // right={safeMarginX}
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
                  <Text as="span">{formatRupiah(selectedPrice)}</Text>
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
                  <Text as="span">{quanitity}</Text>
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
                onClick={handleClick}
                disabled={
                  selectedPrice <= 0 ||
                  quanitity <= 0 ||
                  !formik.isValid ||
                  !(Object.keys(formik.touched).length > 0)
                }
              >
                {locale == "id" ? "Pembayaran" : "Checkout"}
              </Button>
            </Flex>
          </Flex>
        )}
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
