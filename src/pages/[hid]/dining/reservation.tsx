import {
  AbsoluteCenter,
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
  FormLabel,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  Textarea,
} from "@chakra-ui/react";
import {
  capitalize,
  findIndex,
  isEmpty,
  lowerCase,
  sum,
  toNumber,
  toString,
} from "lodash";
import { useRouter } from "next/router";

import { useFormik } from "formik";
import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { IoAddSharp, IoRemoveSharp } from "react-icons/io5";
import "react-image-lightbox/style.css";
import "swiper/css";
import * as Yup from "yup";
import ItemNotFound from "../../../components/ItemNotFound";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Helmet from "../../../containers/Helmet";
import FooterHotel from "../../../layout/FooterHotel";
import HeaderV3 from "../../../layout/HeaderV3";
import Section from "../../../layout/Section";
import {
  getHotelBrands,
  getHotelDetail,
  getOneOrder,
  postCapthca,
  postOrder,
} from "../../../utils/api";
import { phoneRegExp } from "../../../utils/const";
import { formatRupiah } from "../../../utils/functions";
import { useFetchSWRv2, useSWRGraphQL } from "../../../utils/hooks";
import { useLargeQuery } from "../../../utils/mediaQuery";
import { IHeader, IHero } from "../../../utils/types";

export default function Reservation({
  header,
  hotelBrands,
  hero,
}: {
  header: IHeader;
  hotelBrands: any;
  hero: IHero;
}) {
  const { push, locale, query, reload, isReady } = useRouter();

  const { color_primary, slug, id, location, phone, logo_light, name } = header;

  const [diningList, isDiningListLoading] = useFetchSWRv2(`dining`, {
    cct_status: "publish",
    hotel_name: name,
  });

  const [selectedResto, setSelectedResto] = useState<any>(0);

  useEffect(() => {
    if (!diningList || isDiningListLoading) return;
    if (query.selected) {
      const idx = findIndex(
        diningList,
        (o: any) => {
          return o._ID == query.selected;
        },
        0
      );
      if (idx > 0) {
        setSelectedResto(idx);
      } else {
        setSelectedResto(0);
      }
    }
  }, [isReady, diningList]);

  const { isXLarge, isLarge } = useLargeQuery();

  const [products, isLoading, isError] = useSWRGraphQL(`query p_card {
      products(where: {search: "${
        diningList ? diningList[selectedResto].name : ``
      } ${name}", tagIn: "Reservation"}) {
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
                sku
                price
                regularPrice
              }
            }
          }
        }
      }
  }`);

  const [capKey, setCapKey] = useState("");
  const [isCapValid, setIsCapValid] = useState(false);
  const [prices, setPrices] = useState([]);
  const [adultCount, setAdultCount] = useState<any>([]);
  const [childCount, setChildCount] = useState<any>([]);
  const [totalCount, setTotalCount] = useState<any>([]);
  const [adultSubtotals, setAdultSubtotals] = useState<any>([]);
  const [childSubtotals, setChildSubtotals] = useState<any>([]);
  const [total, setTotal] = useState<any>({ subTotal: null, grandTotal: null });
  const [selectedDate, setSelectedDate] = useState<any>();
  const [selectedTime, setSelectedTime] = useState<any>();
  const [message, setMessage] = useState<any>();

  useEffect(() => {
    if (products && products.products.nodes.length > 0) {
      const tempPrices = products.products.nodes[0].variations.nodes.map(
        ({ price }: any) => price.replace(/\./g, "").replace("Rp", "")
      );
      setPrices(tempPrices);
    }
  }, [products]);

  useEffect(() => {
    if (prices.length > 0) {
      let temp = [];
      for (let i = 0; i < prices.length; i++) {
        temp[i] = 0;
      }
      setAdultCount([...temp]);
      setChildCount([...temp]);
      setAdultSubtotals([...temp]);
      setChildSubtotals([...temp]);
    }
  }, [prices]);

  console.log(prices, products);

  useEffect(() => {
    if (diningList && diningList.length > 0) {
      let temp = 0;
      if (adultSubtotals.length > 0) {
        temp += sum(adultSubtotals);
      }
      if (childSubtotals.length > 0) {
        temp += sum(childSubtotals);
      }
      setTotal({
        subTotal: temp,
        grandTotal:
          temp +
          (toNumber(diningList[selectedResto].service_price) ?? 0) +
          (toNumber(diningList[selectedResto].reservation_fee) ?? 0) +
          (toNumber(diningList[selectedResto].tax_price) ?? 0),
      });
    }
  }, [adultSubtotals, childSubtotals]);

  const [selectedMenus, setSelectedMenus] = useState<any[]>([]);

  useEffect(() => {
    let temp = [];
    temp = adultCount.map((value: any, index: any) => {
      return value + childCount[index];
    });

    setTotalCount(temp);
  }, [adultCount, childCount]);

  useEffect(() => {
    postCapthca({ response: capKey }).then((res: any) => {
      res.data.success == true ? setIsCapValid(true) : setIsCapValid(false);
    });
  }, [capKey]);

  const [checkbox, setCheckbox] = useState(false);
  const formik = useFormik({
    initialValues: {
      title: "mr",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      date: "",
      time: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required(locale == "id" ? "Harus diisi" : "Required"),
      date: Yup.string().required(locale == "id" ? "Harus diisi" : "Required"),
      time: Yup.string().required(locale == "id" ? "Harus diisi" : "Required"),
      firstName: Yup.string().required(
        locale == "id" ? "Harus diisi" : "Required"
      ),
      lastName: Yup.string().required(
        locale == "id" ? "Harus diisi" : "Required"
      ),
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
    }),
    onSubmit: ({}, { setSubmitting, setStatus }) => {},
  });

  async function handleClick() {
    if (!formik.isValid) return;

    formik.setSubmitting(true);

    const { email, date, firstName, lastName, title, phone } = formik.values;

    await postOrder({
      name: firstName + " " + lastName,
      email,
      phone,
      city: "Indonesia",
      country: "Indonesia",
      street: "Indonesia",
      price: toString(total.grandTotal),
      items: totalCount.map((v: any, i: number) => {
        const variation_id =
          products?.products?.nodes[0].variations?.nodes[i].databaseId;
        const product_id = products?.products?.nodes[0].databaseId;

        return {
          product_id,
          quantity: v ?? 0,
          variation_id,
        };
      }),
      message: `total adults = ${sum(adultCount)}, total children = ${sum(
        childCount
      )}, special message = ${message}`,
      type: `${query.hid}/dining/reservation`,
      slug: query.hid,
    }).then((res) => {
      res.status == 200 && formik.setStatus("success");
      // setShowPop(true); //COD
      window.open(res.data.redirect_url, "_self"); //RDP PAYMENT
    });
    formik.setSubmitting(false);
  }

  async function handleClickCod() {
    if (!formik.isValid) return;

    formik.setSubmitting(true);

    const { email, date, firstName, lastName, title, phone } = formik.values;

    await postOrder({
      name: firstName + " " + lastName,
      email,
      phone,
      city: "Indonesia",
      country: "Indonesia",
      street: "Indonesia",
      price: toString(total.grandTotal),
      payment: "cod",
      items: totalCount.map((v: any, i: number) => {
        const variation_id =
          products?.products?.nodes[0].variations?.nodes[i].databaseId;
        const product_id = products?.products?.nodes[0].databaseId;

        return {
          product_id,
          quantity: v ?? 0,
          variation_id,
        };
      }),
      message: {
        message: `total adults = ${sum(adultCount)}, total children = ${sum(
          childCount
        )}, special message = ${message}`,
        // type: ``,
      },
      type: `${query.hid}/dining/reservation`,
    }).then((res) => {
      res.status == 200 && formik.setStatus("success");
      setShowPop(true); //COD
      // window.open(res.data.redirect_url, "_self"); //RDP PAYMENT
    });
    formik.setSubmitting(false);
  }

  const [showPop, setShowPop] = useState(false);
  const [popText, setPopText] = useState(
    "Thank you for purchasing, please check your email for further details"
  );

  useEffect(() => {
    if (!isReady) return;
    if (query.proccess == "succes" || query.transaction_id) {
      if (!query.sig) return;
      formik.setSubmitting(true);
      setShowPop(true);
      getOneOrder({
        id: query.transaction_id,
        total: query.total,
        slug: query.hid,
      }).then((res) => {
        if (res.data.response_code == 0) {
        } else if (res.data.response_code == -1) {
          setPopText("Payment Failed. Please Try Again");
        } else {
          setPopText("Payment Failed. Please Try Again");
        }

        formik.setSubmitting(false);

        setInterval(function () {
          window.open(`/${query.hid}/dining/reservation`, "_self");
        }, 7000);
      });
    }
  }, [isReady]);

  return (
    <>
      <Helmet
        title={`Dining Reservation | ${capitalize(
          name
        )} | Parador Hotels & Resorts`}
      />
      <HeaderV3
        headerItem={header}
        isHomepage={false}
        hotelBrands={hotelBrands}
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
                  {popText}
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

      {isDiningListLoading ? (
        <LoadingSpinner />
      ) : (
        <Section>
          <Box>
            <Heading
              mb={2}
              as="h1"
              fontWeight={400}
              letterSpacing="wider"
              textAlign="center"
            >
              {locale == "id" ? "RESERVASI RESTORAN" : "DINING RESERVATION"}
            </Heading>
          </Box>

          <Flex gap={2}>
            <Box flex={1} />

            <Flex flex={8} flexDir="column" gap={6}>
              <Box>
                <Flex mb={6}>
                  <Divider orientation="horizontal" />
                </Flex>

                <Heading
                  mb={6}
                  as="h2"
                  fontWeight={400}
                  letterSpacing="wider"
                  fontSize="2xl"
                >
                  {locale == "id" ? "INFORMASI KONTAK" : "CONTACT INFORMATION"}
                </Heading>

                <Flex
                  gap={[0, 0, 0, 6]}
                  flexDir={["column", null, null, "row"]}
                >
                  <Flex
                    w={["full", null, null, "20%"]}
                    flexDir="column"
                    mb={[3, null, null, 0]}
                  >
                    <FormLabel
                      htmlFor="title"
                      fontSize="md"
                      textTransform="uppercase"
                      fontWeight={400}
                    >
                      {locale == "id" ? "Gelar*" : "Title*"}
                    </FormLabel>
                    <Box>
                      <Select
                        fontSize="sm"
                        id="title"
                        name="title"
                        borderRadius={0}
                        _focus={{}}
                        onChange={(e) => {
                          formik.setValues({
                            ...formik.values,
                            title: e.target.value,
                          });
                        }}
                      >
                        <option value="mr">
                          {locale == "id" ? "Bapak" : "Mr"}
                        </option>
                        <option value="mrs">
                          {locale == "id" ? "Ibu" : "Mrs"}
                        </option>
                      </Select>
                      <Text fontSize="xs" color="red.500" mt={1}>
                        {formik.errors.title}
                      </Text>
                    </Box>
                  </Flex>

                  <Flex
                    flexDir="column"
                    w={["full", null, null, "30%"]}
                    mb={[3, null, null, 0]}
                  >
                    <FormLabel
                      htmlFor="firstName"
                      fontSize="md"
                      whiteSpace="nowrap"
                      textTransform="uppercase"
                      fontWeight={400}
                    >
                      {locale == "id" ? "Nama Depan*" : "First Name*"}
                    </FormLabel>
                    <Box>
                      <Input
                        fontSize="sm"
                        id="firstName"
                        name="firstName"
                        type="text"
                        borderRadius={0}
                        placeholder={
                          locale == "id" ? "Nama Depan" : "First Name"
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.firstName}
                      />
                      <Text fontSize="xs" color="red.500" mt={1}>
                        {formik.errors.firstName}
                      </Text>
                    </Box>
                  </Flex>

                  <Flex
                    flexDir="column"
                    w={["full", null, null, "30%"]}
                    mb={[3, null, null, 0]}
                  >
                    <FormLabel
                      htmlFor="lastName"
                      fontSize="md"
                      textTransform="uppercase"
                      fontWeight={400}
                      whiteSpace="nowrap"
                    >
                      {locale == "id" ? "Nama Belakang*" : "Last Name*"}
                    </FormLabel>
                    <Box>
                      <Input
                        fontSize="sm"
                        id="lastName"
                        name="lastName"
                        type="text"
                        borderRadius={0}
                        placeholder={
                          locale == "id" ? "Nama Belakang" : "Last Name"
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.lastName}
                      />
                      <Text fontSize="xs" color="red.500" mt={1}>
                        {formik.errors.lastName}
                      </Text>
                    </Box>
                  </Flex>

                  <Flex
                    flexDir="column"
                    w={["full", null, null, "40%"]}
                    mb={[3, null, null, 0]}
                  >
                    <FormLabel
                      htmlFor="email"
                      fontSize="md"
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
                        type="text"
                        borderRadius={0}
                        placeholder={locale == "id" ? "Email" : "Your email"}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                      />
                      <Text fontSize="xs" color="red.500" mt={1}>
                        {formik.errors.email}
                      </Text>
                    </Box>
                  </Flex>

                  <Flex
                    flexDir="column"
                    w={["full", null, null, "40%"]}
                    mb={[3, null, null, 0]}
                  >
                    <FormLabel
                      htmlFor="phone"
                      fontSize="md"
                      textTransform="uppercase"
                      fontWeight={400}
                    >
                      {locale == "id" ? "Telepon*" : "phone*"}
                    </FormLabel>
                    <Box>
                      <Input
                        fontSize="sm"
                        id="phone"
                        name="phone"
                        type="tel"
                        borderRadius={0}
                        placeholder="123456"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phone}
                      />
                      <Text fontSize="xs" color="red.500" mt={1}>
                        {formik.errors.phone}
                      </Text>
                    </Box>
                  </Flex>
                </Flex>
              </Box>

              {isLoading ? (
                <LoadingSpinner />
              ) : diningList.length < 1 ? (
                <ItemNotFound />
              ) : (
                <Box letterSpacing="wide">
                  <Flex mb={6}>
                    <Divider orientation="horizontal" />
                  </Flex>

                  <Heading
                    mb={6}
                    as="h2"
                    fontWeight={400}
                    letterSpacing="wider"
                    fontSize="2xl"
                  >
                    {locale == "id" ? "KELOLA RESERVASI" : "MANAGE RESERVATION"}
                  </Heading>

                  <Flex
                    gap={[0, 0, 0, 6]}
                    flexDir={["column", null, null, "row"]}
                  >
                    <Flex
                      w={["full", null, null, "50%"]}
                      flexDir="column"
                      mb={[3, null, null, 0]}
                    >
                      <FormLabel
                        fontSize="md"
                        textTransform="uppercase"
                        fontWeight={400}
                      >
                        {locale == "id" ? "Restoran*" : "RESTAURANT*"}
                      </FormLabel>
                      <Box>
                        <Select
                          fontSize="sm"
                          borderRadius={0}
                          _focus={{}}
                          onChange={(e) => {
                            setSelectedResto(toNumber(e.target.value));
                          }}
                          value={selectedResto}
                        >
                          {diningList.map(({ name }: any, i: number) => {
                            return (
                              <option value={i} key={name}>
                                {name}
                              </option>
                            );
                          })}
                        </Select>
                      </Box>
                    </Flex>

                    <Flex
                      flexDir="column"
                      w={["full", null, null, "25%"]}
                      mb={[3, null, null, 0]}
                    >
                      <FormLabel
                        htmlFor="phone"
                        fontSize="md"
                        textTransform="uppercase"
                        fontWeight={400}
                      >
                        {locale == "id" ? "Tanggal*" : "Date*"}
                      </FormLabel>
                      <Box>
                        <Input
                          fontSize="sm"
                          id="phone"
                          name="phone"
                          min={new Date().toISOString().split("T")[0]}
                          type="date"
                          borderRadius={0}
                          placeholder="123456"
                          onChange={(e) => {
                            formik.setValues({
                              ...formik.values,
                              date: e.target.value,
                            });
                            setSelectedDate(e.target.value);
                          }}
                        />
                      </Box>
                      <Text fontSize="xs" color="red.500" mt={1}>
                        {formik.errors.date}
                      </Text>
                    </Flex>

                    <Flex
                      flexDir="column"
                      w={["full", null, null, "25%"]}
                      mb={[3, null, null, 0]}
                    >
                      <FormLabel
                        htmlFor="phone"
                        fontSize="md"
                        noOfLines={1}
                        textTransform="uppercase"
                        fontWeight={400}
                      >
                        {locale == "id"
                          ? "Waktu tersedia*"
                          : "AVAILABLE TIMES*"}
                      </FormLabel>
                      <Box>
                        <Input
                          fontSize="sm"
                          id="phone"
                          name="phone"
                          type="time"
                          borderRadius={0}
                          placeholder="123456"
                          onChange={(e) => {
                            formik.setValues({
                              ...formik.values,
                              time: e.target.value,
                            });
                            setSelectedTime(e.target.value);
                          }}
                        />{" "}
                        <Text fontSize="xs" color="red.500" mt={1}>
                          {formik.errors.time}
                        </Text>
                      </Box>
                    </Flex>
                  </Flex>

                  {products.products.nodes.length < 1 ? (
                    <ItemNotFound />
                  ) : (
                    <Box>
                      {!isXLarge && (
                        <Box>
                          <Flex w="full" my={4}>
                            <Divider orientation="horizontal" />
                          </Flex>
                          <Heading
                            mb={6}
                            as="h2"
                            fontWeight={400}
                            letterSpacing="wider"
                            fontSize="2xl"
                          >
                            {locale == "id" ? "Menu Makan*" : "MEAL MENU*"}
                          </Heading>
                        </Box>
                      )}
                      {isXLarge && (
                        <SimpleGrid
                          columns={[1, 2, 3, 4]}
                          bg="blackAlpha.100"
                          mt={8}
                          gap={6}
                          px={4}
                          py={4}
                          className="label-default"
                          borderTop="1px solid var(--chakra-colors-blackAlpha-600)"
                          borderBottom="1px solid var(--chakra-colors-blackAlpha-200)"
                        >
                          <FormLabel
                            fontSize="xl"
                            textTransform="uppercase"
                            noOfLines={1}
                            fontWeight={400}
                          >
                            {locale == "id" ? "Menu Makan*" : "MEAL MENU*"}
                          </FormLabel>{" "}
                          <FormLabel
                            fontSize="xl"
                            textTransform="uppercase"
                            fontWeight={400}
                            display={["none", null, "unset"]}
                            noOfLines={1}
                          >
                            {locale == "id" ? "Dewasa*" : "ADULTS*"}
                          </FormLabel>{" "}
                          <FormLabel
                            htmlFor="title"
                            fontSize="xl"
                            textTransform="uppercase"
                            fontWeight={400}
                            display={["none", null, "unset"]}
                          >
                            {locale == "id" ? "Anak" : "CHILDREN"} (5 - 11)
                          </FormLabel>{" "}
                          <FormLabel
                            textAlign="right"
                            htmlFor="title"
                            fontSize="xl"
                            textTransform="uppercase"
                            fontWeight={400}
                          >
                            SUBTOTAL
                          </FormLabel>
                        </SimpleGrid>
                      )}
                      {products.products.nodes[0].variations.nodes.map(
                        ({ name, sku }: any, i: any) => {
                          const showName = lowerCase(name)
                            .replace(lowerCase(header.name), "")
                            .replace(
                              lowerCase(diningList[selectedResto].name),
                              ""
                            );

                          return (
                            <SimpleGrid
                              key={name}
                              columns={[1, null, 3, 4]}
                              gap={6}
                              px={3}
                              py={4}
                              className="label-default"
                              borderBottom="1px solid var(--chakra-colors-blackAlpha-200)"
                            >
                              <Flex flexDir="column">
                                <Text
                                  fontSize="md"
                                  textTransform="capitalize"
                                  fontWeight={500}
                                >
                                  {showName}
                                </Text>
                                <Text
                                  fontSize="sm"
                                  textTransform="capitalize"
                                  fontWeight={400}
                                  color="blackAlpha.600"
                                >
                                  {formatRupiah(prices[i])}
                                </Text>
                              </Flex>
                              <Flex
                                justify="space-between"
                                align="center"
                                w="full"
                                p={2}
                                borderColor="gray.300"
                                color="gray.600"
                                borderWidth={1}
                              >
                                <Box
                                  cursor={
                                    adultCount[i] > 0
                                      ? "pointer"
                                      : "not-allowed"
                                  }
                                  color={
                                    adultCount[i] > 0 ? "gray.600" : "gray.300"
                                  }
                                  onClick={() => {
                                    let tempCount = [...adultCount],
                                      tempSubtotal = [...adultSubtotals];
                                    if (adultCount[i] > 0) {
                                      tempCount[i]--;
                                      tempSubtotal[i] =
                                        prices[i] * tempCount[i];
                                      setAdultSubtotals([...tempSubtotal]);
                                    }
                                    setAdultCount([...tempCount]);
                                  }}
                                >
                                  <IoRemoveSharp size={24} />
                                </Box>
                                <Text fontSize="md" as="span">
                                  <strong>{adultCount[i]}</strong>{" "}
                                  {locale == "id" ? "Dewasa" : "Adult"}
                                </Text>
                                <Box
                                  cursor={
                                    adultCount[i] < 99
                                      ? "pointer"
                                      : "not-allowed"
                                  }
                                  color={
                                    adultCount[i] < 99 ? "gray.600" : "gray.300"
                                  }
                                  onClick={() => {
                                    let tempCount = [...adultCount],
                                      tempSubtotal = [...adultSubtotals];
                                    if (adultCount[i] < 99) {
                                      tempCount[i]++;
                                      tempSubtotal[i] =
                                        prices[i] * tempCount[i];
                                      setAdultSubtotals([...tempSubtotal]);
                                    }
                                    setAdultCount([...tempCount]);
                                  }}
                                >
                                  <IoAddSharp size={24} />
                                </Box>
                              </Flex>
                              <Flex
                                justify="space-between"
                                align="center"
                                w="full"
                                p={2}
                                borderColor="gray.300"
                                color="gray.600"
                                borderWidth={1}
                              >
                                <Box
                                  cursor={
                                    childCount[i] > 0
                                      ? "pointer"
                                      : "not-allowed"
                                  }
                                  color={
                                    childCount[i] > 0 ? "gray.600" : "gray.300"
                                  }
                                  onClick={() => {
                                    let tempCount = [...childCount],
                                      tempSubtotal = [...childSubtotals];
                                    if (childCount[i] > 0) {
                                      tempCount[i]--;
                                      tempSubtotal[i] =
                                        prices[i] * tempCount[i];
                                      setChildSubtotals([...tempSubtotal]);
                                    }
                                    setChildCount([...tempCount]);
                                  }}
                                >
                                  <IoRemoveSharp size={24} />
                                </Box>
                                <Text fontSize="md" as="span">
                                  <strong>{childCount[i]}</strong>{" "}
                                  {locale == "id" ? "Anak" : "Child"}
                                </Text>
                                <Box
                                  cursor={
                                    childCount[i] < 99
                                      ? "pointer"
                                      : "not-allowed"
                                  }
                                  color={
                                    childCount[i] < 99 ? "gray.600" : "gray.300"
                                  }
                                  onClick={() => {
                                    let tempCount = [...childCount],
                                      tempSubtotal = [...childSubtotals];
                                    if (childCount[i] < 99) {
                                      tempCount[i]++;
                                      tempSubtotal[i] =
                                        prices[i] * tempCount[i];
                                      setChildSubtotals([...tempSubtotal]);
                                    }
                                    setChildCount([...tempCount]);
                                  }}
                                >
                                  <IoAddSharp size={24} />
                                </Box>
                              </Flex>
                              <Text
                                fontSize="md"
                                textTransform="capitalize"
                                fontWeight={500}
                                textAlign={{ base: "left", lg: "right" }}
                              >
                                {formatRupiah(
                                  childSubtotals[i] + adultSubtotals[i]
                                )}
                              </Text>
                            </SimpleGrid>
                          );
                        }
                      )}
                      <SimpleGrid
                        columns={[1, 1, 2]}
                        mt={2}
                        gap={6}
                        pr={3}
                        py={4}
                      >
                        <Box>
                          <FormLabel
                            htmlFor="title"
                            fontSize="xl"
                            textTransform="uppercase"
                            fontWeight={400}
                          >
                            {locale == "id"
                              ? "Permintaan Spesial"
                              : "SPECIAL REQUEST"}
                          </FormLabel>
                          <Textarea
                            fontSize="sm"
                            id="message"
                            name="message"
                            borderRadius={0}
                            placeholder={
                              locale == "id"
                                ? "Permintaan Kamu"
                                : "Your Request"
                            }
                            onChange={(e) => {
                              setMessage(e.target.value);
                            }}
                          />

                          {isLarge && (
                            <>
                              <Checkbox
                                mt={4}
                                mb={6}
                                defaultChecked={false}
                                isChecked={checkbox}
                                onChange={() => {
                                  setCheckbox(!checkbox);
                                }}
                              >
                                <Text fontSize="xs">
                                  {locale == "id"
                                    ? "Saya telah membaca dan menyetujui"
                                    : "I have read and accepted the"}{" "}
                                  <span
                                    onClick={() => {
                                      push(`/privacy-policy`);
                                    }}
                                    style={{
                                      fontWeight: 500,
                                      textDecoration: "underline",
                                    }}
                                  >
                                    {locale == "id"
                                      ? "Privasi & Kebijakan"
                                      : "privacy policy"}
                                  </span>
                                </Text>
                              </Checkbox>

                              <ReCAPTCHA
                                sitekey={
                                  process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY ?? ""
                                }
                                onChange={(value: any) => setCapKey(value)}
                              />
                            </>
                          )}
                        </Box>
                        <Flex flexDir="column" gap={3}>
                          <Flex justify="space-between">
                            <FormLabel
                              fontSize="xl"
                              textTransform="uppercase"
                              fontWeight={400}
                            >
                              SUBTOTAL
                            </FormLabel>
                            <Text
                              fontSize="md"
                              textTransform="capitalize"
                              fontWeight={400}
                              textAlign="right"
                            >
                              {formatRupiah(total.subTotal)}
                            </Text>
                          </Flex>
                          <Flex
                            justify="space-between"
                            borderBottom="1px solid var(--chakra-colors-blackAlpha-100)"
                          >
                            <FormLabel fontSize="sm" fontWeight={400}>
                              {locale == "id"
                                ? "Biaya Reservasi"
                                : "Reservation Fee"}
                            </FormLabel>
                            <Text
                              fontSize="sm"
                              textTransform="capitalize"
                              fontWeight={400}
                              textAlign="right"
                            >
                              {formatRupiah(
                                diningList[selectedResto].reservation_fee
                              )}
                            </Text>
                          </Flex>
                          <Flex
                            justify="space-between"
                            borderBottom="1px solid var(--chakra-colors-blackAlpha-100)"
                          >
                            <FormLabel fontSize="sm" fontWeight={400}>
                              {locale == "id" ? "Pajak" : "Tax"}
                            </FormLabel>
                            <Text
                              fontSize="sm"
                              textTransform="capitalize"
                              fontWeight={400}
                              textAlign="right"
                            >
                              {formatRupiah(
                                diningList[selectedResto].tax_price
                              )}
                            </Text>
                          </Flex>
                          <Flex
                            justify="space-between"
                            borderBottom="1px solid var(--chakra-colors-blackAlpha-500)"
                          >
                            <FormLabel fontSize="sm" fontWeight={400}>
                              {locale == "id" ? "Biaya Pelayanan" : "Service"}
                            </FormLabel>
                            <Text
                              fontSize="sm"
                              textTransform="capitalize"
                              fontWeight={400}
                              textAlign="right"
                            >
                              {formatRupiah(
                                diningList[selectedResto].service_price
                              )}
                            </Text>
                          </Flex>
                          <Flex justify="space-between">
                            <FormLabel fontSize="md" fontWeight={600}>
                              {locale == "id" ? "Jumlah Akhir" : "Grand Total"}
                            </FormLabel>
                            <Text
                              fontSize="md"
                              textTransform="capitalize"
                              fontWeight={600}
                              textAlign="right"
                            >
                              {formatRupiah(total.grandTotal)}
                            </Text>
                          </Flex>
                        </Flex>
                      </SimpleGrid>

                      {!isLarge && (
                        <>
                          <Checkbox
                            mt={4}
                            mb={6}
                            defaultChecked={false}
                            isChecked={checkbox}
                            onChange={() => {
                              setCheckbox(!checkbox);
                            }}
                          >
                            <Text fontSize="xs">
                              {locale == "id"
                                ? "Saya telah membaca dan menyetujui"
                                : "I have read and accepted the"}{" "}
                              <span
                                onClick={() => {
                                  push(`/privacy-policy`);
                                }}
                                style={{
                                  fontWeight: 500,
                                  textDecoration: "underline",
                                }}
                              >
                                {locale == "id"
                                  ? "Privasi & Kebijakan"
                                  : "privacy policy"}
                              </span>
                            </Text>
                          </Checkbox>

                          <ReCAPTCHA
                            sitekey={
                              process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY ?? ""
                            }
                            onChange={(value: any) => setCapKey(value)}
                          />
                        </>
                      )}

                      <SimpleGrid columns={[1, 1, 2]} mt={3} gap={6} py={4}>
                        <Button
                          size="md"
                          variant="solid"
                          bg={header.color_primary}
                          color="white"
                          py={6}
                          cursor={
                            formik.isSubmitting ||
                            !formik.isValid ||
                            formik.status == "success"
                              ? `not-allowed`
                              : `pointer`
                          }
                          onClick={handleClick}
                          disabled={
                            formik.isSubmitting ||
                            !formik.isValid ||
                            formik.status == "success" ||
                            !isCapValid ||
                            isEmpty(formik.values.firstName) ||
                            !total.subTotal ||
                            checkbox == false
                          }
                        >
                          {locale == "id"
                            ? "PESAN & BAYAR"
                            : "RESERVE & PAY NOW"}
                        </Button>
                        <Button
                          size="md"
                          variant="outline"
                          borderColor={header.color_primary}
                          color={header.color_primary}
                          py={6}
                          cursor={
                            formik.isSubmitting ||
                            !formik.isValid ||
                            formik.status == "success"
                              ? `not-allowed`
                              : `pointer`
                          }
                          onClick={handleClickCod}
                          disabled={
                            formik.isSubmitting ||
                            !formik.isValid ||
                            formik.status == "success" ||
                            !isCapValid ||
                            isEmpty(formik.values.firstName) ||
                            !total.subTotal ||
                            checkbox == false
                          }
                        >
                          {locale == "id" ? "PESAN" : "RESERVE"}
                        </Button>
                      </SimpleGrid>
                    </Box>
                  )}
                </Box>
              )}
            </Flex>

            <Box flex={1} />
          </Flex>
        </Section>
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

function ColoredButton({
  type = "outline",
  children,
  color = "black",
  onClick,
}: any) {
  return (
    <Button
      bg={type === "outline" ? "white" : color}
      border={`1.5px solid ${color}`}
      color={type === "outline" ? color : "white"}
      // px={16}
      _hover={{ bg: color, color: "white" }}
      w={260}
      py={4}
      fontWeight={500}
    >
      {children}
    </Button>
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
