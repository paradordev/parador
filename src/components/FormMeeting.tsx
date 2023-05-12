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
  InputGroup,
  InputLeftElement,
  Radio,
  RadioGroup,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spinner,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { capitalize, isEmpty, toNumber, toString } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {
  FaCircleNotch,
  FaEllipsisH,
  FaGripVertical,
  FaHockeyPuck,
  FaSpinner,
  FaTh,
  FaThLarge,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import NumberFormat from "react-number-format";
import * as Yup from "yup";
import Section from "../layout/Section";
import {
  postCapthca,
  postMeetingEnquiry,
  postSendMail,
  postWeddingEnquiry,
} from "../utils/api";
import { phoneRegExp } from "../utils/const";
import { safeMarginX, useLargeQuery } from "../utils/mediaQuery";

export default function FormMeeting({
  button,
  hotel,
  color,
  type,
  emailParticipants,
  headline,
}: {
  button: any;
  hotel: string;
  color: string;
  type: string;
  emailParticipants: any;
  headline: string;
}) {
  const { push, reload, locale } = useRouter();

  const formik = useFormik({
    initialValues: {
      title: "mr",
      name: "",
      email: "",
      phone: "",
      name_of_event: capitalize(type),
      date_start: "",
      date_end: "",
      total_pax: "",
      time_start: "",
      time_end: "",
      // package: "",
      setup_option: "",
      range_budget: "",
      special_request: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required(locale == "id" ? "Harus diisi" : "Required"),
      name: Yup.string().required(locale == "id" ? "Harus diisi" : "Required"),
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
      name_of_event: Yup.string(),
      date_start: Yup.string().required(
        locale == "id" ? "Harus diisi" : "Required"
      ),
      date_end: Yup.string().required(
        locale == "id" ? "Harus diisi" : "Required"
      ),
      total_pax: Yup.string().required(
        locale == "id" ? "Harus diisi" : "Required"
      ),
      time_start: Yup.string(),
      time_end: Yup.string(),
      // package: Yup.string().required(locale == "id" ? "Harus diisi" : "Required"),
      setup_option: Yup.string(),
      range_budget:
        type == "Social Events"
          ? Yup.string()
          : Yup.string().required(locale == "id" ? "Harus diisi" : "Required"),
      special_request: Yup.string(),
    }),
    onSubmit: ({}, { setSubmitting, setStatus }) => {},
  });

  const [selectedSetup, setSelectedSetup] = useState<any>();
  const [checkbox, setCheckbox] = useState(false);
  const [capKey, setCapKey] = useState("");
  const [isCapValid, setIsCapValid] = useState(false);

  useEffect(() => {
    postCapthca({ response: capKey }).then((res: any) => {
      res.data.success == true ? setIsCapValid(true) : setIsCapValid(false);
    });
  }, [capKey]);

  async function handleClick() {
    if (!formik.isValid) return;
    if (!checkbox) return;
    if (!isCapValid) return;

    //here
    formik.setSubmitting(true);

    const {
      date_end,
      date_start,
      email,
      name,
      name_of_event,
      phone,
      range_budget,
      setup_option,
      special_request,
      time_end,
      time_start,
      title,
      total_pax,
    } = formik.values;

    (type == "Venue" || type == "Social Events" || type == "Meeting Package") &&
      (await postMeetingEnquiry({
        date_end,
        date_start,
        email,
        name,
        name_of_event,
        phone,
        range_budget,
        setup_option,
        special_request,
        time_end,
        time_start,
        title,
        type: type,
        total_pax: toString(total_pax),
        hotel: hotel,
      }).then(async (res) => {
        if (res.status == 200) {
          await postSendMail({
            mailkey: "halo",
            emails: email,
            subject: `Your ${type} Enquiry Request`,
            title: `Your ${type} Enquiry Request`,
            hotel: hotel,
            name: name,
            body: `Just to let you know — we've received your ${type} Enquiry Request, and it is now being processed.`,
            type: type,
          }).then(async (res) => {
            if (res.status == 200) {
              await postSendMail({
                mailkey: "halo",
                emails: emailParticipants,
                subject: `Your ${type} Enquiry Request`,
                title: `Your ${type} Enquiry Request`,
                hotel: hotel,
                name: "Admins",
                body: `A ${type} Enquiry Request from Customer! Kindly check Admin Panel to process it.`,
                type: type,
              }).then((res) => {
                res.status == 200 && formik.setStatus("success");
              });
            }
          });
        }
      }));

    type == "wedding" &&
      (await postWeddingEnquiry({
        date_end,
        date_start,
        email,
        name,
        name_of_event,
        phone,
        range_budget,
        special_request,
        time_end,
        time_start,
        title,
        total_pax: toString(total_pax),
        hotel: hotel,
      }).then(async (res) => {
        if (res.status == 200) {
          await postSendMail({
            mailkey: "halo",
            emails: email,
            subject: `Your ${type} Enquiry Request`,
            title: `Your ${type} Enquiry Request`,
            hotel: hotel,
            name: name,
            body: `Just to let you know — we've received your ${type} Enquiry Request, and it is now being processed.`,
            type: type,
          }).then(async (res) => {
            if (res.status == 200) {
              await postSendMail({
                mailkey: "halo",
                emails: emailParticipants,
                subject: `Your ${type} Enquiry Request`,
                title: `Your ${type} Enquiry Request`,
                hotel: hotel,
                name: "Admins",
                body: `A ${type} Enquiry Request from Customer! Kindly check Admin Panel to process it.`,
                type: type,
              }).then((res) => {
                res.status == 200 && formik.setStatus("success");
              });
            }
          });
        }
      }));

    formik.setSubmitting(false);
  }

  const { isXLarge } = useLargeQuery();

  return (
    <Box
      position="fixed"
      top={0}
      zIndex={5}
      bg="blackAlpha.600"
      h="100vh"
      w="100vw"
    >
      {formik.isSubmitting || (formik.status && formik.status == "success") ? (
        <AbsoluteCenter
          w={["90vw", "85vw", "70vw", "60vw", "50vw"]}
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
                as="h4"
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
                  onClick={() => {
                    button(false);
                  }}
                >
                  {locale == "id" ? "TUTUP" : "CLOSE"}
                </Button>
              </Box>
            </Center>
          )}
        </AbsoluteCenter>
      ) : (
        <AbsoluteCenter
          w={["90vw", "85vw", "80vw", "75vw"]}
          h={["80vh"]}
          mt={10}
          overflowY="scroll"
          bg="white"
          px={safeMarginX}
          py={[6, 8, 12]}
          zIndex={6}
        >
          <Box position="relative">
            <Box
              position="absolute"
              top={[-4, 0]}
              right={[-2, 0]}
              cursor="pointer"
              onClick={() => {
                button(false);
              }}
            >
              <IoClose size={24} />
            </Box>
            <Section variant="zero">
              <Box>
                <Heading
                  mt={[5, null, null, 0]}
                  mb={2}
                  as="h1"
                  fontWeight={400}
                  letterSpacing="wider"
                  textAlign="center"
                  textTransform="uppercase"
                >
                  {headline}
                </Heading>
                <Text
                  mb={3}
                  fontSize="sm"
                  color="blackAlpha.600"
                  textTransform="uppercase"
                  textAlign="center"
                >
                  {hotel}
                </Text>
              </Box>
              <Flex flex={8} flexDir="column" gap={10}>
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
                    {locale == "id"
                      ? "INFORMASI KONTAK"
                      : "CONTACT INFORMATION"}
                  </Heading>

                  <Flex
                    gap={[0, 0, 0, 6]}
                    flexDir={["column", null, null, "row"]}
                  >
                    <Flex
                      w={["full", null, null, "15%"]}
                      flexDir="column"
                      mb={[3, null, null, 0]}
                    >
                      <FormLabel
                        htmlFor="title"
                        fontSize="xl"
                        textTransform="uppercase"
                        fontWeight={400}
                        noOfLines={1}
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
                      w={["full", null, null, "35%"]}
                      mb={[3, null, null, 0]}
                    >
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
                          placeholder={
                            locale == "id" ? "Nama Lengkap" : "Full Name"
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

                    <Flex
                      flexDir="column"
                      w={["full", null, null, "25%"]}
                      mb={[3, null, null, 0]}
                    >
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

                    <Flex
                      flexDir="column"
                      w={["full", null, null, "25%"]}
                      mb={[3, null, null, 0]}
                    >
                      <FormLabel
                        htmlFor="phone"
                        fontSize="xl"
                        textTransform="uppercase"
                        fontWeight={400}
                        noOfLines={1}
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
                    {locale == "id" ? "INFORMASI ACARA" : "EVENT INFORMATION"}
                  </Heading>

                  <Flex
                    gap={[0, 0, 0, 6]}
                    mb={6}
                    flexDir={["column", null, null, "row"]}
                  >
                    <Flex
                      flexDir="column"
                      w={["full", null, null, "50%"]}
                      mb={[3, null, null, 0]}
                    >
                      <FormLabel
                        htmlFor="name_of_event"
                        fontSize="xl"
                        textTransform="uppercase"
                        fontWeight={400}
                        noOfLines={1}
                      >
                        {locale == "id" ? "Nama acara" : "Name of Event"}
                      </FormLabel>
                      <Box>
                        <Input
                          fontSize="sm"
                          id="name_of_event"
                          name="name_of_event"
                          type="text"
                          borderRadius={0}
                          placeholder="Your Event"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.name_of_event}
                        />
                      </Box>
                    </Flex>
                    <Flex
                      flexDir="column"
                      w={["full", null, null, "25%"]}
                      mb={[3, null, null, 0]}
                    >
                      <FormLabel
                        fontSize="xl"
                        textTransform="uppercase"
                        fontWeight={400}
                        noOfLines={1}
                      >
                        {locale == "id" ? "Tanggal Mulai*" : "Start Date*"}
                      </FormLabel>
                      <Box>
                        <Input
                          fontSize="sm"
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          borderRadius={0}
                          onChange={(e) => {
                            formik.setValues({
                              ...formik.values,
                              date_start: e.target.value,
                            });
                          }}
                        />
                        <Text fontSize="xs" color="red.500" mt={1}>
                          {formik.errors.date_start}
                        </Text>
                      </Box>
                    </Flex>

                    <Flex
                      flexDir="column"
                      w={["full", null, null, "25%"]}
                      mb={[3, null, null, 0]}
                    >
                      <FormLabel
                        fontSize="xl"
                        textTransform="uppercase"
                        fontWeight={400}
                        noOfLines={1}
                      >
                        {locale == "id" ? "Tanggal Selesai*" : "End Date*"}
                      </FormLabel>
                      <Box>
                        <Input
                          fontSize="sm"
                          disabled={!formik.values.date_start}
                          min={
                            new Date(
                              new Date().setDate(
                                new Date(
                                  formik.values.date_start == ""
                                    ? new Date()
                                    : formik.values.date_start
                                ).getDate() + 1
                              )
                            )
                              .toISOString()
                              .split("T")[0]
                          }
                          type="date"
                          borderRadius={0}
                          onChange={(e) => {
                            formik.setValues({
                              ...formik.values,
                              date_end: e.target.value,
                            });
                          }}
                        />
                        <Text fontSize="xs" color="red.500" mt={1}>
                          {formik.errors.date_end}
                        </Text>
                      </Box>
                    </Flex>
                  </Flex>

                  <Flex gap={6} mb={6} flexDir={["column", null, null, "row"]}>
                    <Flex
                      flexDir="column"
                      w={["full", null, null, "50%"]}
                      mb={[3, null, null, 0]}
                    >
                      <FormLabel
                        htmlFor="total_pax"
                        fontSize="xl"
                        textTransform="uppercase"
                        fontWeight={400}
                        noOfLines={1}
                      >
                        {locale == "id" ? "Jumlah Orang*" : "Total pax*"}
                      </FormLabel>
                      <Box>
                        <Input
                          fontSize="sm"
                          id="total_pax"
                          name="total_pax"
                          type="number"
                          borderRadius={0}
                          placeholder={"500"}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.total_pax}
                        />
                        <Text fontSize="xs" color="red.500" mt={1}>
                          {formik.errors.total_pax}
                        </Text>
                      </Box>
                    </Flex>
                    <Flex
                      flexDir="column"
                      w={["full", null, null, "25%"]}
                      mb={[3, null, null, 0]}
                    >
                      <FormLabel
                        fontSize="xl"
                        textTransform="uppercase"
                        fontWeight={400}
                        noOfLines={1}
                      >
                        {locale == "id" ? "Waktu Mulai" : "Start Time"}
                      </FormLabel>
                      <Box>
                        <Input
                          fontSize="sm"
                          type="time"
                          borderRadius={0}
                          onChange={(e) => {
                            formik.setValues({
                              ...formik.values,
                              time_start: e.target.value,
                            });
                          }}
                        />
                      </Box>
                    </Flex>

                    <Flex
                      flexDir="column"
                      w={["full", null, null, "25%"]}
                      mb={[3, null, null, 0]}
                    >
                      <FormLabel
                        fontSize="xl"
                        textTransform="uppercase"
                        fontWeight={400}
                        noOfLines={1}
                      >
                        {locale == "id" ? "Waktu Selesai" : "End Time"}
                      </FormLabel>
                      <Box>
                        <Input
                          fontSize="sm"
                          type="time"
                          borderRadius={0}
                          disabled={!formik.values.time_start}
                          min={formik.values.time_start}
                          onChange={(e) => {
                            formik.setValues({
                              ...formik.values,
                              time_end: e.target.value,
                            });
                          }}
                        />
                      </Box>
                    </Flex>
                  </Flex>
                </Box>

                <Box>
                  {(type == "Venue" || type == "Meeting Package") && (
                    <>
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
                        {locale == "id"
                          ? "INFORMASI TENTANG"
                          : "INFORMATION ABOUT"}
                        <br />
                        {locale == "id" ? "RUANG RAPAT" : "MEETING ROOM"}
                      </Heading>

                      <Flex gap={6} mb={10}>
                        <Flex flexDir="column" w="100%" mb={[3, null, null, 0]}>
                          <FormLabel
                            htmlFor="name_of_event"
                            fontSize="xl"
                            textTransform="uppercase"
                            fontWeight={400}
                          >
                            {locale == "id"
                              ? "PILIHAN SUSUNAN"
                              : "SET-UP OPTIONS"}
                          </FormLabel>
                          <Box mt={2}>
                            <RadioGroup
                              onChange={(e) => {
                                setSelectedSetup(toString(e));
                                formik.setValues({
                                  ...formik.values,
                                  setup_option:
                                    locale == "id"
                                      ? setupOptions[toNumber(e)].name_id
                                      : setupOptions[toNumber(e)].name_en,
                                });
                              }}
                              value={selectedSetup}
                            >
                              <Stack
                                direction="row"
                                display="flex"
                                flexWrap="wrap"
                                justifyContent="space-between"
                                w="100%"
                              >
                                {setupOptions.map(
                                  ({ name_en, name_id, icon }, i) => {
                                    return (
                                      <Flex
                                        flexDir="column"
                                        key={i}
                                        alignItems="center"
                                        color="blackAlpha.600"
                                        gap={1}
                                        mb={[10, 8, 2, 0]}
                                      >
                                        {icon}
                                        <Text as="span" fontSize="sm" mb={2}>
                                          {locale == "id" ? name_id : name_en}
                                        </Text>
                                        <Radio value={toString(i)}></Radio>
                                      </Flex>
                                    );
                                  }
                                )}
                              </Stack>
                            </RadioGroup>
                          </Box>
                        </Flex>
                      </Flex>
                    </>
                  )}

                  <Flex mb={6}>
                    <Divider orientation="horizontal" />
                  </Flex>

                  <Flex
                    gap={[0, 0, 0, 6]}
                    mb={6}
                    flexDir={["column", null, null, "row"]}
                  >
                    {!(type == "Social Events") && (
                      <Flex
                        flexDir="column"
                        w={["full", null, null, "50%"]}
                        mb={[3, null, null, 0]}
                      >
                        <FormLabel
                          htmlFor="range_budget"
                          fontSize="xl"
                          textTransform="uppercase"
                          fontWeight={400}
                        >
                          {locale == "id" ? "Anggaran*" : "Range Budget*"}
                        </FormLabel>
                        <Box>
                          <InputGroup>
                            <InputLeftElement
                              pointerEvents="none"
                              color="blackAlpha.600"
                              fontSize="sm"
                            >
                              Rp.
                            </InputLeftElement>
                            <NumberFormat
                              className="input-currency"
                              placeholder="60.000.000"
                              isNumericString={true}
                              thousandSeparator={true}
                              value={formik.values.range_budget}
                              onValueChange={(vals) =>
                                formik.setValues({
                                  ...formik.values,
                                  range_budget: vals.formattedValue,
                                })
                              }
                            />
                          </InputGroup>

                          <Text fontSize="xs" color="red.500" mt={1}>
                            {formik.errors.range_budget}
                          </Text>

                          <Slider
                            mt={4}
                            mb={10}
                            colorScheme="blackAlpha"
                            defaultValue={60000000}
                            min={0}
                            max={1000000000}
                            step={10000000}
                            onChange={(v) =>
                              formik.setValues({
                                ...formik.values,
                                range_budget: toString(v),
                              })
                            }
                          >
                            <SliderTrack>
                              <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                          </Slider>

                          {isXLarge && (
                            <ReCAPTCHA
                              sitekey={
                                process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY ?? ""
                              }
                              onChange={(value: any) => setCapKey(value)}
                            />
                          )}
                        </Box>
                      </Flex>
                    )}
                    <Flex
                      flexDir="column"
                      w={["full", null, null, "50%"]}
                      mb={[3, null, null, 0]}
                    >
                      <FormLabel
                        fontSize="xl"
                        textTransform="uppercase"
                        fontWeight={400}
                      >
                        {locale == "id"
                          ? "Permintaan Spesial"
                          : "Special request"}
                      </FormLabel>
                      <Box>
                        <Textarea
                          fontSize="sm"
                          borderRadius={0}
                          placeholder={
                            locale == "id" ? "Permintaan Anda" : "Your Request"
                          }
                          onChange={(e) => {
                            formik.setValues({
                              ...formik.values,
                              special_request: e.target.value,
                            });
                          }}
                        />
                      </Box>
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

                      {(!isXLarge || type == "Social Events") && (
                        <Box mb={6}>
                          <ReCAPTCHA
                            sitekey={
                              process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY ?? ""
                            }
                            onChange={(value: any) => setCapKey(value)}
                          />
                        </Box>
                      )}

                      <Box>
                        <Button
                          variant="solid"
                          bg={color}
                          color="white"
                          px={8}
                          py={5}
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
                            !checkbox ||
                            !isCapValid ||
                            isEmpty(formik.values.name)
                          }
                        >
                          {locale == "id"
                            ? "Permintaan Anggaran"
                            : "REQUEST BUDGET"}
                        </Button>
                      </Box>
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
            </Section>
          </Box>
        </AbsoluteCenter>
      )}
    </Box>
  );
}

const setupOptions = [
  { name_id: "Classroom", name_en: "Classroom", icon: <FaTh /> },
  { name_id: "Cocktail", name_en: "Cocktail", icon: <FaSpinner /> },
  { name_id: "Board Room", name_en: "Board Room", icon: <FaGripVertical /> },
  { name_id: "Theatre", name_en: "Theatre", icon: <FaThLarge /> },
  { name_id: "U-Shape", name_en: "U-Shape", icon: <FaHockeyPuck /> },
  { name_id: "Banquet", name_en: "Banquet", icon: <FaCircleNotch /> },
  { name_id: "Lainnya", name_en: "Others", icon: <FaEllipsisH /> },
];
