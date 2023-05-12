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
  Spinner,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import * as Yup from "yup";
import Helmet from "../../containers/Helmet";
import Footer from "../../layout/Footer";
import HeaderV3 from "../../layout/HeaderV3";
import Section from "../../layout/Section";
import {
  getHotelBrands,
  getHotelDetail,
  postAccount,
  postCapthca,
  postSendMail,
} from "../../utils/api";
import { phoneRegExp } from "../../utils/const";
import { IHeader } from "../../utils/types";

export default function RegisterPage({
  header,
  hotelBrands,
}: {
  header: IHeader;
  hotelBrands: any;
}) {
  const { locale, push, isReady, reload } = useRouter();

  const [showPop, setShowPop] = useState(false);
  const [capKey, setCapKey] = useState("");
  const [isCapValid, setIsCapValid] = useState(false);

  useEffect(() => {
    postCapthca({ response: capKey }).then((res) => {
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
      companyType: "corporate",
      companyName: "",
      address: "",
      country: "Indonesia",
      city: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required(locale == "id" ? "Harus diisi" : "Required"),
      firstName: Yup.string().required(
        locale == "id" ? "Harus diisi" : "Required"
      ),
      lastName: Yup.string().required(
        locale == "id" ? "Harus diisi" : "Required"
      ),
      companyType: Yup.string().required(
        locale == "id" ? "Harus diisi" : "Required"
      ),
      companyName: Yup.string().required(
        locale == "id" ? "Harus diisi" : "Required"
      ),
      address: Yup.string().required(
        locale == "id" ? "Harus diisi" : "Required"
      ),
      country: Yup.string().required(
        locale == "id" ? "Harus diisi" : "Required"
      ),
      city: Yup.string().required(locale == "id" ? "Harus diisi" : "Required"),
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
    if (!checkbox) return;
    if (!isCapValid) return;

    //here
    formik.setSubmitting(true);
    const {
      email,
      address,
      city,
      companyName,
      companyType,
      country,
      firstName,
      lastName,
      phone,
      title,
    } = formik.values;

    await postAccount({
      email,
      phone,
      address,
      city,
      company_name: companyName,
      title,
      country,
      company_type: companyType,
      first_name: firstName,
      last_name: lastName,
    }).then(async (res) => {
      if (res.status == 200) {
        await postSendMail({
          mailkey: "halo",
          emails: email,
          subject: "Your Register Request",
          title: "Your Register Request",
          hotel: "Home",
          name: firstName,
          body: "Just to let you know — we've received your Register Request, and it is now being processed.",
          type: "Register",
        }).then(async (res) => {
          if (res.status == 200) {
            await postSendMail({
              mailkey: "halo",
              emails: header.email_participants,
              subject: "A Contact Request",
              title: "A Contact Request",
              hotel: "Home",
              name: "Admins",
              body: "A Register Request from Customer! Kindly check Admin Panel to process it.",
              type: "Register",
            }).then((res) => {
              res.status == 200 && formik.setStatus("success");
              setShowPop(true);
            });
          }
        });
      }
    });
    formik.setSubmitting(false);
  }

  return (
    <>
      <Helmet title="Sign Up | Parador Hotels & Resorts" />
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
                  color={`white`}
                  textAlign="center"
                >
                  Thank you, our representatives will contact you shortly
                  regarding your request.
                </Heading>
                <Box>
                  <Button
                    variant="outline"
                    color="white"
                    _hover={{ opacity: 0.8 }}
                    onClick={() => {
                      setShowPop(false);
                      reload();
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

      <Section>
        <Box>
          <Heading
            mb={2}
            as="h1"
            fontWeight={400}
            letterSpacing="wider"
            textAlign="center"
          >
            {locale == "id" ? "MENDAFTARKAN PERUSAHAAN" : "Company Sign Up"}
          </Heading>
          <Flex
            w="100%"
            justify="center"
            color="blackAlpha.700"
            fontSize="small"
          >
            <Text>
              {locale == "id"
                ? "Nikmati harga untuk anggota terdaftar saat memesan"
                : "To enjoy your member rate when booking"}
            </Text>
          </Flex>
        </Box>
        <Center my={6}>
          <Flex w={20}>
            <Divider orientation="horizontal" />
          </Flex>
        </Center>
        <Flex gap={2}>
          <Box flex={1} />
          <Flex flex={2} flexDir="column" gap={6}>
            <Flex gap={4} display={["unset", null, null, "flex"]}>
              <Flex
                flexDir="column"
                w={["full", null, null, "30%"]}
                mb={[3, null, null, 0]}
              >
                <FormLabel
                  htmlFor="title"
                  fontSize="xl"
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

              <Flex flexDir="column" w="full" mb={[3, null, null, 0]}>
                <FormLabel
                  htmlFor="firstName"
                  fontSize="xl"
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
                    placeholder={locale == "id" ? "Nama Depan" : "First Name"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                  />
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {formik.errors.firstName}
                  </Text>
                </Box>
              </Flex>

              <Flex flexDir="column" w="full" mb={[3, null, null, 0]}>
                <FormLabel
                  htmlFor="lastName"
                  fontSize="xl"
                  textTransform="uppercase"
                  fontWeight={400}
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
                    placeholder={locale == "id" ? "Nama Belakang" : "Last Name"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                  />
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {formik.errors.lastName}
                  </Text>
                </Box>
              </Flex>
            </Flex>

            <Flex gap={4} display={["unset", null, null, "flex"]}>
              <Flex flexDir="column" w="full" mb={[3, null, null, 0]}>
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

              <Flex flexDir="column" w="full" mb={[3, null, null, 0]}>
                <FormLabel
                  htmlFor="phone"
                  fontSize="xl"
                  textTransform="uppercase"
                  fontWeight={400}
                >
                  phone*
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

            <Flex gap={4} display={["unset", null, null, "flex"]}>
              <Flex flexDir="column" w="full" mb={[3, null, null, 0]}>
                <FormLabel
                  htmlFor="companyType"
                  fontSize="xl"
                  textTransform="uppercase"
                  fontWeight={400}
                >
                  {locale == "id" ? "Tipe Perusahaan*" : "Company Type*"}
                </FormLabel>
                <Box>
                  <Select
                    fontSize="sm"
                    id="companyType"
                    name="companyType"
                    borderRadius={0}
                    onChange={(e) => {
                      formik.setValues({
                        ...formik.values,
                        companyType: e.target.value,
                      });
                    }}
                    onBlur={formik.handleBlur}
                  >
                    <option value="corporate">
                      {locale == "id" ? "Korporat" : "CORPORATE"}
                    </option>
                    <option value="travel agent">
                      {locale == "id" ? "Biro Perjalanan" : "TRAVEL AGENT"}
                    </option>
                  </Select>
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {formik.errors.companyType}
                  </Text>
                </Box>
              </Flex>
              <Flex flexDir="column" w="full" mb={[3, null, null, 0]}>
                <FormLabel
                  htmlFor="companyName"
                  fontSize="xl"
                  textTransform="uppercase"
                  fontWeight={400}
                >
                  {locale == "id" ? "Nama Perusahaan*" : "Company Name*"}
                </FormLabel>
                <Box>
                  <Input
                    fontSize="sm"
                    id="companyName"
                    name="companyName"
                    type="text"
                    borderRadius={0}
                    placeholder={
                      locale == "id" ? "Nama Perusahaan" : "Company Name"
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.companyName}
                  />
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {formik.errors.companyName}
                  </Text>
                </Box>
              </Flex>
            </Flex>

            <Flex gap={4} display={["unset", null, null, "flex"]}>
              <Flex flexDir="column" w="full" mb={[3, null, null, 0]}>
                <FormLabel
                  htmlFor="address"
                  fontSize="xl"
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
                    placeholder={locale == "id" ? "Alamat" : "Address"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.address}
                  />
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {formik.errors.address}
                  </Text>
                </Box>
              </Flex>
            </Flex>

            <Flex gap={4} display={["unset", null, null, "flex"]}>
              <Flex flexDir="column" w="full" mb={[3, null, null, 0]}>
                <FormLabel
                  htmlFor="country"
                  fontSize="xl"
                  textTransform="uppercase"
                  fontWeight={400}
                >
                  {locale == "id" ? "Negara*" : "Country*"}
                </FormLabel>
                <Box>
                  <Input
                    fontSize="sm"
                    id="country"
                    name="country"
                    type="text"
                    borderRadius={0}
                    placeholder="Indonesia"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.country}
                  />
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {formik.errors.country}
                  </Text>
                </Box>
              </Flex>
              <Flex flexDir="column" w="full" mb={[3, null, null, 0]}>
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
            </Flex>

            <Center mt={4} flexDir="column" gap={12}>
              <Checkbox
                defaultChecked={false}
                isChecked={checkbox}
                onChange={() => {
                  setCheckbox(!checkbox);
                }}
              >
                <Text fontSize="xs">
                  {/* {locale == "id"
                    ? `Saya telah membaca dan menyetujui ketentuan `
                    : `I have read and accepted the `} */}
                  {locale == "id"
                    ? "Saya telah membaca dan menyetujui"
                    : "I have read and accepted the"}{" "}
                  <span
                    onClick={() => {
                      push(`/privacy-policy`);
                    }}
                    style={{ fontWeight: 500, textDecoration: "underline" }}
                  >
                    {locale == "id" ? "Privasi & Kebijakan" : "privacy policy"}
                  </span>
                </Text>
              </Checkbox>

              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY ?? ""}
                onChange={(value: any) => setCapKey(value)}
              />
              <Box>
                <Button
                  size="lg"
                  variant="dark"
                  px={20}
                  disabled={
                    !formik.isValid ||
                    !checkbox ||
                    formik.isSubmitting ||
                    formik.status == "success" ||
                    !isCapValid
                  }
                  onClick={handleClick}
                >
                  {formik.isSubmitting
                    ? locale == "id"
                      ? `Mendaftar..`
                      : `SIGNING UP..`
                    : formik.status == "success"
                    ? locale == "id"
                      ? `Berhasil`
                      : `DONE`
                    : locale == "id"
                    ? `Daftar`
                    : `Sign Up`}
                </Button>
              </Box>
            </Center>
          </Flex>
          <Flex flex={1}></Flex>
        </Flex>
      </Section>
      <Box h={10} />
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
    home_headline,
    hotel_sliders,
    hotel_gallery,
    location_short_en,
    has_dining,
    has_wedding,
    has_meeting_events,
    location_long,
    location_long_en,
    email,
    email_participants,
    email_notify_account,
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
    email_participants: email_notify_account ?? email_participants,
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
