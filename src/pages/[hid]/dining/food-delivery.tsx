import {
  AbsoluteCenter,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormLabel,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Slide,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { findIndex, includes, sum, toNumber, toString } from "lodash";
import { useRouter } from "next/router";

import { useFormik } from "formik";
import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { IoAddSharp, IoCartOutline, IoRemoveSharp } from "react-icons/io5";
import "react-image-lightbox/style.css";
import "swiper/css";
import * as Yup from "yup";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Helmet from "../../../containers/Helmet";
import FooterHotel from "../../../layout/FooterHotel";
import HeaderV3 from "../../../layout/HeaderV3";
import Section from "../../../layout/Section";
import {
  getHotelBrands,
  getHotelDetail,
  postCapthca,
  postOrder,
} from "../../../utils/api";
import { phoneRegExp } from "../../../utils/const";
import { formatRupiah } from "../../../utils/functions";
import { useFetchSWRv2, useSWRGraphQL } from "../../../utils/hooks";
import {
  safeMarginX,
  safeMarginY,
  useLargeQuery,
} from "../../../utils/mediaQuery";
import { IHeader, IHero } from "../../../utils/types";

const today = new Date();

export default function Reservation({
  header,
  hotelBrands,
  hero,
}: {
  header: IHeader;
  hotelBrands: any;
  hero: IHero;
}) {
  const { push, isReady, query, reload, locale } = useRouter();

  const { color_primary, slug, id, location, phone, logo_light, name } = header;

  const [diningList, isDiningListLoading] = useFetchSWRv2(`dining`, {
    hotel_name: name,
    cct_status: "publish",
  });

  const [selectedResto, setSelectedResto] = useState(0);
  const [isSelectedLoading, setIsSelectedLoading] = useState(false);

  useEffect(() => {
    if (isDiningListLoading || diningList.length <= 0 || !query.selected)
      return;

    setIsSelectedLoading(true);

    const idx = findIndex(
      diningList,
      (o: any) => {
        return o._ID == query.selected;
      },
      0
    );

    setSelectedResto(idx);

    setIsSelectedLoading(false);
  }, [diningList]);

  const [foods, isLoading, isError] = useSWRGraphQL(`query p_card {
    products(where: {tagIn: "food", stockStatus: IN_STOCK, search: "${
      diningList ? diningList[selectedResto].name : ``
    } ${name}"}) {
      nodes {
        id
        databaseId
        slug
        sku
        image {
          id
          altText
          sourceUrl
        }
        name
        ... on SimpleProduct {
          price(format: RAW)
          regularPrice(format: RAW)
          id
          databaseId
          sku
        }
      }
    }
  }`);

  const [zips, setZips] = useState([]);

  useEffect(() => {
    if (!diningList) return;
    const x = diningList[selectedResto].zip_code
      .replace(/\s/g, "")
      .split(",")
      .map((x: any) => +x);

    setZips(x);
  }, [selectedResto, diningList]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      zip: zips[0],
      notes: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(locale == "id" ? "Harus diisi" : "Required"),
      address: Yup.string().required(
        locale == "id" ? "Harus diisi" : "Required"
      ),
      email: Yup.string()
        .email(
          locale == "id" ? "Email tidak valid" : "Please enter a valid email"
        )
        .required(locale == "id" ? "Harus diisi" : "Required"),
      zip: Yup.number(),
      phone: Yup.string()
        .min(
          10,
          locale == "id"
            ? "Nomor telepon tidak valid"
            : "Phone must be a valid phone number"
        )
        .matches(
          phoneRegExp,
          locale == "id"
            ? "Nomor telepon tidak valid"
            : "Phone must be a valid phone number"
        )
        .required(locale == "id" ? "Harus diisi" : "Required"),
      notes: Yup.string(),
    }),
    onSubmit: ({}, { setSubmitting, setStatus }) => {},
  });

  async function handleClick() {
    if (!formik.isValid) return;

    formik.setSubmitting(true);
    const { address, name, zip, phone, email, notes } = formik.values;
    await postOrder({
      name,
      email,
      phone,
      payment: "cod",
      city: diningList[selectedResto].location,
      country: "Indonesia",
      street: address,
      zip: toString(zip),
      price: toString(grandTotal),
      message: notes,
      items: cart.map(({ databaseId }: any, i: any) => {
        return { product_id: databaseId, quantity: cartTotal[i] };
      }),
    }).then((res) => {
      res.status == 200 && formik.setStatus("success");
    });
    formik.setSubmitting(false);
  }

  const [cart, setCart] = useState<any[]>([]);
  const [cartTotal, setCartTotal] = useState<any[]>([]);

  const [subTotal, setSubTotal] = useState<null | number>(null);
  const [grandTotal, setGrandTotal] = useState<null | number>(null);

  const [flatFee, setFlatFee] = useState<null | number>(null);

  useEffect(() => {
    if (cart.length <= 0) {
      setSubTotal(null);
      setGrandTotal(null);
      setFlatFee(null);
    } else {
      const x = cart.map((c, i) => {
        return toNumber(c.price) * cartTotal[i];
      });

      setFlatFee(0);
      setSubTotal(sum(x));
      setGrandTotal(sum(x) + sum(x) * 0.1 + (flatFee ?? 20000));
    }
  }, [cart, cartTotal]);

  function handleAddCart(food: any) {
    let temp = [...cart];
    if (!includes(cart, food)) {
      temp.push(food);
      setCart(temp);

      let totalTemp = [...cartTotal];
      totalTemp[temp.length - 1] = 1;
      setCartTotal(totalTemp);
    }
  }

  function formatFoodName(name: any) {
    return name.substring(0, name.indexOf("-"));
  }

  const [capKey, setCapKey] = useState("");
  const [isCapValid, setIsCapValid] = useState(false);

  useEffect(() => {
    postCapthca({ response: capKey }).then((res) => {
      res.data.success == true ? setIsCapValid(true) : setIsCapValid(false);
    });
  }, [capKey]);

  const { isLarge } = useLargeQuery();
  const cartRef = useRef<any>(null);

  const [addedToCart, setAddedToCart] = useState([]);

  const { onOpen, onClose, isOpen } = useDisclosure();

  useEffect(() => {
    isOpen &&
      setTimeout(() => {
        onClose();
      }, 2000);
  }, [isOpen]);

  return (
    <>
      <Helmet title={`Food Delivery | Parador Hotels & Resorts`} />
      <HeaderV3
        headerItem={header}
        isHomepage={false}
        hotelBrands={hotelBrands}
      />

      {((formik.status && formik.status == "success") ||
        formik.isSubmitting) && (
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
                  Thank You for Your Order, We Will Contact You Soon.
                </Heading>
                <Box>
                  <Button
                    variant="outline"
                    color="white"
                    onClick={() => {
                      reload();
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

      <Slide direction="bottom" in={isOpen} style={{ zIndex: 9999 }}>
        <Box
          p={10}
          color="white"
          mt="4"
          bg={color_primary + "e6"}
          // pb={12}
          shadow="md"
          borderTopRadius="md"
        >
          <Text align="center">
            {locale == "id" ? "Item berhasil ditambahkan!" : "Added to Cart!"}
          </Text>
        </Box>
      </Slide>

      {isDiningListLoading || isSelectedLoading ? (
        <LoadingSpinner />
      ) : (
        <Box position="relative">
          <Box
            display={{ base: "unset", xl: "none" }}
            position="fixed"
            cursor="pointer"
            bottom={safeMarginY}
            left={safeMarginX}
            bg="white"
            padding={4}
            borderRadius="50%"
            zIndex={50}
            className="header-box-shadows"
            onClick={() => {
              window.scrollTo({
                top: cartRef.current.offsetTop + 70,
                behavior: "smooth",
              });
            }}
          >
            <Center
              position="absolute"
              right={2}
              top={2}
              w={4}
              h={4}
              color="white"
              bg={header.color_primary}
              borderRadius="50%"
            >
              <Text as="span" fontSize="small">
                {sum(cartTotal)}
              </Text>
            </Center>
            <IoCartOutline size={28} color={header.color_primary} />
          </Box>
          <Section variant="zero" py={safeMarginY}>
            <Heading
              mb={2}
              as="h1"
              fontWeight={400}
              letterSpacing="wider"
              textAlign="center"
            >
              {locale == "id" ? "PESAN ANTAR" : "FOOD DELIVERY"}
            </Heading>

            <Flex flexDir={["column", null, null, "row"]}>
              <Box flex={7} letterSpacing="wide" pl={safeMarginX}>
                <Flex mb={6}>
                  <Divider orientation="horizontal" />
                </Flex>

                <Flex
                  gap={[2, 4, 6]}
                  mb={8}
                  align={["flex-start", null, null, "flex-end"]}
                  flexDir={["column", null, null, "row"]}
                >
                  <Flex
                    w={["full", null, null, "25%"]}
                    flexDir={["column"]}
                    mb={[3, null, null, 0]}
                  >
                    <FormLabel
                      fontSize="xl"
                      textTransform="uppercase"
                      fontWeight={400}
                    >
                      {locale == "id" ? "RESTORAN*" : "RESTAURANT*"}
                    </FormLabel>
                    <Box>
                      <Select
                        fontSize="sm"
                        borderRadius={0}
                        _focus={{}}
                        value={toString(selectedResto)}
                        onChange={(e) => {
                          setSelectedResto(toNumber(e.target.value));
                        }}
                      >
                        {diningList.map(({ name }: any, i: any) => {
                          return (
                            <option value={i} key={name}>
                              {name}
                            </option>
                          );
                        })}
                      </Select>
                    </Box>
                  </Flex>
                  <Text
                    fontSize={["sm", "md", "lg"]}
                    textTransform="uppercase"
                    fontWeight={400}
                    noOfLines={1}
                  >
                    {locale == "id"
                      ? "*RADIUS MAKSIMUM PENGANTARAN ADALAH 8 KM"
                      : "*DELIVERY MAXIMUM RADIUS OF 8 KM"}
                  </Text>
                </Flex>

                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  foods && (
                    <SimpleGrid columns={[2, 2, 2, 2, 3, 3]} gap={5} mr={5}>
                      {foods.products.nodes.map((food: any, i: any) => {
                        const foodName = food.name.substring(
                          0,
                          food.name.indexOf("-")
                        );
                        return (
                          <Flex key={i} flexDir="column" gap={3}>
                            <Box
                              h={["24vh", "30vh", "32vh"]}
                              w="100%"
                              position="relative"
                            >
                              {food.image.sourceUrl ? (
                                <Image
                                  alt={food.image.altText}
                                  src={food.image.sourceUrl}
                                  layout="fill"
                                  objectFit="cover"
                                />
                              ) : (
                                <Box w="full" h="full" bg="blackAlpha.300" />
                              )}
                            </Box>
                            <Heading
                              as="h4"
                              fontSize={["sm", "md", "lg", "2xl"]}
                              fontWeight={500}
                              noOfLines={1}
                            >
                              {foodName}
                            </Heading>
                            <Flex>
                              <Divider orientation="horizontal" />
                            </Flex>
                            <Flex
                              alignItems={["unset", "center"]}
                              justify="space-between"
                              gap={2}
                              flexDir={["column", null, null, "row"]}
                            >
                              <Text
                                color="blackAlpha.700"
                                fontWeight={600}
                                fontSize="sm"
                              >
                                {formatRupiah(food.price)}
                              </Text>
                              <Button
                                variant="outline"
                                borderColor={header.color_primary}
                                color={header.color_primary}
                                fontSize={["x-small", null, null, "xs"]}
                                _hover={{
                                  bg: header.color_primary,
                                  color: "white",
                                }}
                                onClick={() => {
                                  handleAddCart(food);
                                  !isLarge && onOpen();
                                }}
                              >
                                {locale == "id"
                                  ? "Masukkan Keranjang"
                                  : "Add to Cart"}
                              </Button>
                            </Flex>
                          </Flex>
                        );
                      })}
                    </SimpleGrid>
                  )
                )}
              </Box>

              <Flex
                flex={2}
                flexDir="column"
                px={7}
                py={5}
                mt={[8, 4, 0]}
                bg="blackAlpha.100"
                ref={cartRef}
              >
                <Heading
                  mb={2}
                  ml={3}
                  as="h2"
                  fontWeight={500}
                  letterSpacing="wider"
                  fontSize="2xl"
                >
                  {locale == "id" ? "PESANAN ANDA" : "YOUR ORDER"}
                </Heading>
                <Accordion defaultIndex={[0, 1]} allowToggle allowMultiple>
                  <AccordionItem>
                    <h2>
                      <AccordionButton py={3}>
                        <Box
                          flex="1"
                          textAlign="left"
                          fontSize="md"
                          fontWeight={500}
                        >
                          {locale == "id"
                            ? "LOKASI & INFO ANDA"
                            : "YOUR LOCATION & INFO"}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel
                      pb={4}
                      display="flex"
                      flexDir="column"
                      gap={2}
                    >
                      <Flex flexDir="column" w="100%" mb={[3, null, null, 0]}>
                        <FormLabel
                          htmlFor="zip"
                          fontSize="sm"
                          textTransform="uppercase"
                          fontWeight={400}
                        >
                          {locale == "id"
                            ? "PILIH KODE POS*"
                            : "SELECT YOUR ZIP CODE*"}
                        </FormLabel>
                        <Box>
                          <Select
                            fontSize="sm"
                            borderRadius={0}
                            _focus={{}}
                            onChange={(e) => {
                              setSelectedResto(toNumber(e.target.value));
                            }}
                          >
                            {zips.map((zip) => {
                              return (
                                <option value={zip} key={zip}>
                                  {zip}
                                </option>
                              );
                            })}
                          </Select>
                          {/* <Input
                          fontSize="sm"
                          id="zip"
                          name="zip"
                          type="number"
                          borderRadius={0}
                          placeholder="0000"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.zip}
                        /> */}
                        </Box>
                      </Flex>

                      <Flex flexDir="column" w="100%" mb={[3, null, null, 0]}>
                        <FormLabel
                          htmlFor="address"
                          fontSize="sm"
                          textTransform="uppercase"
                          fontWeight={400}
                        >
                          {locale == "id" ? "Alamat*" : "Address*"}
                        </FormLabel>
                        <Box>
                          <Textarea
                            fontSize="sm"
                            id="address"
                            name="address"
                            borderRadius={0}
                            placeholder={
                              locale == "id"
                                ? "Detail Alamat"
                                : "Detail Address"
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.address}
                          />
                          <Text fontSize="xs" color="red.500" mt={1}>
                            {formik.errors.address}
                          </Text>
                        </Box>
                      </Flex>

                      <Flex flexDir="column" w="100%" mb={[3, null, null, 0]}>
                        <FormLabel
                          htmlFor="name"
                          fontSize="sm"
                          textTransform="uppercase"
                          fontWeight={400}
                        >
                          {locale == "id" ? "Nama*" : "Name*"}
                        </FormLabel>
                        <Box>
                          <Input
                            fontSize="sm"
                            id="name"
                            type="text"
                            name="name"
                            borderRadius={0}
                            placeholder={
                              locale == "id" ? "Nama Anda" : "Your Name"
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                          />
                          <Text fontSize="xs" color="red.500" mt={1}>
                            {formik.errors.name}
                          </Text>
                        </Box>
                      </Flex>

                      <Flex flexDir="column" w="100%" mb={[3, null, null, 0]}>
                        <FormLabel
                          htmlFor="email"
                          fontSize="sm"
                          textTransform="uppercase"
                          fontWeight={400}
                        >
                          email*
                        </FormLabel>
                        <Box>
                          <Input
                            fontSize="sm"
                            id="email"
                            type="email"
                            name="email"
                            borderRadius={0}
                            placeholder={
                              locale == "id" ? "Email" : "Your email"
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                          />
                          <Text fontSize="xs" color="red.500" mt={1}>
                            {formik.errors.email}
                          </Text>
                        </Box>
                      </Flex>

                      <Flex flexDir="column" w="100%" mb={[3, null, null, 0]}>
                        <FormLabel
                          htmlFor="phone"
                          fontSize="sm"
                          textTransform="uppercase"
                          fontWeight={400}
                        >
                          {locale == "id" ? "WhatsApp*" : "WhatsApp*"}
                        </FormLabel>
                        <Box>
                          <Input
                            fontSize="sm"
                            id="phone"
                            name="phone"
                            type="tel"
                            borderRadius={0}
                            placeholder="0123456"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.phone}
                          />
                          <Text fontSize="xs" color="red.500" mt={1}>
                            {formik.errors.phone}
                          </Text>
                        </Box>
                      </Flex>

                      <Flex flexDir="column" w="100%" mb={[3, null, null, 0]}>
                        <FormLabel
                          htmlFor="phone"
                          fontSize="sm"
                          textTransform="uppercase"
                          fontWeight={400}
                        >
                          {locale == "id" ? "Catatan" : "Notes"}
                        </FormLabel>
                        <Box>
                          <Textarea
                            fontSize="sm"
                            id="notes"
                            name="notes"
                            borderRadius={0}
                            placeholder={
                              locale == "id" ? "Catatan Anda" : "Your Notes"
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.notes}
                          />
                          <Text fontSize="xs" color="red.500" mt={1}>
                            {formik.errors.notes}
                          </Text>
                        </Box>
                      </Flex>
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem>
                    <h2>
                      <AccordionButton py={3}>
                        <Box
                          flex="1"
                          textAlign="left"
                          fontSize="md"
                          fontWeight={500}
                        >
                          {locale == "id" ? "KERANJANG" : "MY CART"}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Flex flexDir="column" gap={2}>
                        {cart.map((c, i) => {
                          return (
                            <Fragment key={i}>
                              <Flex
                                justify="space-between"
                                color="blackAlpha.700"
                              >
                                <Box>
                                  <Text fontSize="sm" mb={2}>
                                    {formatFoodName(c.name)}
                                  </Text>
                                  <Flex
                                    justify="space-between"
                                    align="center"
                                    w={110}
                                    p={1}
                                    borderColor="gray.300"
                                    color="gray.600"
                                    borderWidth={1}
                                  >
                                    <Box
                                      cursor={"pointer"}
                                      color={"gray.600"}
                                      onClick={() => {
                                        let tempTotal = [...cartTotal];

                                        if (cartTotal[i] <= 1) {
                                          let tempCart = [...cart];
                                          tempCart.splice(i, 1);
                                          setCart(tempCart);

                                          tempTotal.splice(i, 1);
                                          setCartTotal(tempTotal);
                                        } else {
                                          tempTotal[i]--;
                                          setCartTotal(tempTotal);
                                        }
                                      }}
                                    >
                                      <IoRemoveSharp size={24} />
                                    </Box>
                                    <Text fontSize="xl" as="span">
                                      {cartTotal[i]}
                                    </Text>
                                    <Box
                                      cursor={true ? "pointer" : "not-allowed"}
                                      color={true ? "gray.600" : "gray.300"}
                                      onClick={() => {
                                        let tempTotal = [...cartTotal];
                                        tempTotal[i]++;
                                        setCartTotal(tempTotal);
                                      }}
                                    >
                                      <IoAddSharp size={24} />
                                    </Box>
                                  </Flex>
                                </Box>
                                <Text fontSize="sm" fontWeight={600}>
                                  {formatRupiah(c.price * cartTotal[i])}
                                </Text>
                              </Flex>
                              <Flex mt={2}>
                                <Divider orientation="horizontal" />
                              </Flex>
                            </Fragment>
                          );
                        })}
                      </Flex>

                      <Flex
                        flexDir="column"
                        gap={2}
                        mt={2}
                        fontSize="sm"
                        color="blackAlpha.700"
                      >
                        <Flex justify="space-between" fontSize="sm">
                          <Text as="span">SUBTOTAL</Text>
                          <Text as="span">{formatRupiah(subTotal ?? 0)}</Text>
                        </Flex>{" "}
                        <Flex>
                          <Divider orientation="horizontal" />
                        </Flex>
                        {/* <Flex justify="space-between">
                        <Text as="span">Delivery Fee</Text>
                        <Text as="span">FREE</Text>
                      </Flex>
                      <Flex>
                        <Divider orientation="horizontal" />
                      </Flex> */}
                        <Flex justify="space-between">
                          <Text as="span">
                            {locale == "id" ? "Biaya Antar" : "Delivery Fee"}
                          </Text>
                          {/* <Text as="span">{formatRupiah(flatFee ?? 0)}</Text> */}
                          <Text as="span">
                            {locale == "id" ? "GRATIS" : "FREE"}
                          </Text>
                        </Flex>{" "}
                        <Flex>
                          <Divider orientation="horizontal" />
                        </Flex>
                        <Flex justify="space-between">
                          <Text as="span">
                            {locale == "id" ? "Pajak" : "Tax"}
                          </Text>
                          <Text as="span">
                            {/* {formatRupiah((subTotal ?? 0) * 0.1)} */}
                            {formatRupiah(0)}
                          </Text>
                        </Flex>
                        <Flex>
                          <Divider orientation="horizontal" />
                        </Flex>
                        <Flex
                          justify="space-between"
                          fontSize="sm"
                          fontWeight={600}
                        >
                          <Text as="span">
                            {locale == "id" ? "TOTAL AKHIR" : "GRAND TOTAL"}
                          </Text>
                          <Text as="span">{formatRupiah(grandTotal ?? 0)}</Text>
                        </Flex>
                      </Flex>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>

                <Box my={3}>
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY ?? ""}
                    onChange={(value: any) => setCapKey(value)}
                  />
                </Box>

                <Button
                  mt={4}
                  mx={3}
                  py={5}
                  variant="solid"
                  bg={header.color_primary}
                  color="white"
                  disabled={
                    !grandTotal ||
                    !subTotal ||
                    cart.length <= 0 ||
                    !formik.isValid ||
                    !isCapValid ||
                    !formik.values.name
                  }
                  onClick={handleClick}
                >
                  {locale == "id" ? "BELI" : "PURCHASE"}
                </Button>
              </Flex>
            </Flex>
          </Section>
        </Box>
      )}

      <FooterHotel
        instagram={header.instagram}
        facebook={header.facebook}
        locationLink={header.location_url}
        location={header.location_long}
        email={header.email}
        phone={header.phone}
        bg={color_primary}
        color="white"
        logo={logo_light}
      />
    </>
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
    room_subheadline,
    location_short_en,
    brand,
    dining_headline,
    dining_subheadline,
    dining_slider,
    has_dining,
    has_wedding,
    has_meeting_events,
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
  };

  const hero: IHero = {
    id: _ID,
    banner: dining_headline,
    sub_banner: dining_subheadline,
    color_primary,
    name,
    slider: dining_slider,
    hotel_code,
    is_parador: is_parador === "true",
  };

  const hotelBrands = await getHotelBrands();

  return {
    props: {
      header,
      hotelBrands,
      hero,
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
