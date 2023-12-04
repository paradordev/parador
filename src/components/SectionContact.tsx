import {
  Box,
  Button,
  Flex,
  FormLabel,
  Heading,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import * as Yup from "yup";
import Section from "../layout/Section";
import { postCapthca, postMessages, postSendMail } from "../utils/api";
import { phoneRegExp } from "../utils/const";

export default function SectionContact({
  color = "black",
  email,
  emailParticipants,
  location,
  phone,
  srcMap,
  hotel,
}: {
  color: string;
  location: string;
  phone: string | number;
  email: string | undefined;
  emailParticipants: string | undefined;
  srcMap?: string | undefined;
  hotel?: string | undefined;
}) {
  const { locale } = useRouter();

  const [capKey, setCapKey] = useState("");
  const [isCapValid, setIsCapValid] = useState(false);

  useEffect(() => {
    postCapthca({ response: capKey }).then((res) => {
      res.data.success == true ? setIsCapValid(true) : setIsCapValid(false);
    });
  }, [capKey]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
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
      message: Yup.string().required(
        locale == "id" ? "Harus diisi" : "Required"
      ),
    }),
    onSubmit: (
      { name, email, message, phone },
      { setSubmitting, setStatus }
    ) => {},
  });

  async function handleClick() {
    if (!formik.isValid) return;
    if (!isCapValid) return;

    formik.setSubmitting(true);
    const { email, name, message, phone } = formik.values;
    await postMessages({ name, email, phone, message, hotel }).then(
      async (res) => {
        if (res.status == 200) {
          await postSendMail({
            mailkey: "halo",
            emails: email,
            subject: "Your Contact Request",
            title: "Your Contact Request",
            hotel: hotel ?? "Home",
            name: name,
            body: "Just to let you know — we've received your Contact Request, and it is now being processed.",
            type: "Contact Us",
          }).then(async (res) => {
            if (res.status == 200) {
              await postSendMail({
                mailkey: "halo",
                emails: emailParticipants,
                subject: "A Contact Request from Hotel Website",
                title: "A Contact Request from Hotel Website",
                hotel: hotel ?? "Parador",
                name: "Admins",
                body: `<div>
                  <h3>
                  A Message from Customer!
                  </h3>
                  <table class="detail-table">
                    <tr>
                      <td>Hotel</td>
                      <td> : </td>
                      <td>${hotel ?? "Parador"}</td>
                    </tr>
                    <tr>
                      <td>Name</td>
                      <td> : </td>
                      <td>${name}</td>
                    </tr>
                    <tr>
                      <td>Email</td>
                      <td> : </td>
                      <td>${email}</td>
                    </tr>
                    <tr>
                      <td>Phone</td>
                      <td> : </td>
                      <td>${phone}</td>
                    </tr>
                    <tr>
                      <td>Message</td>
                      <td> : </td>
                      <td>${message}</td>
                    </tr>
                  </table>
                </div>`,
                type: "Contact Us",
              }).then((res) => {
                res.status == 200 && formik.setStatus("success");
              });
            }
          });
        }
      }
    );
    formik.setSubmitting(false);
  }

  return (
    <Section bg="white">
      <Flex flexDir="column" gap={16}>
        {srcMap && (
          <Box>
            <iframe
              src={srcMap}
              width="100%"
              style={{ height: "70vh" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Box>
        )}
        <Box>
          <Heading
            mb={12}
            as="h1"
            fontWeight={400}
            letterSpacing="wider"
            color={color}
          >
            {locale == "id" ? "KONTAK KAMI" : "CONTACT US"}
          </Heading>
          <Flex
            justify="space-between"
            gap={[20]}
            flexDir={["column", null, null, "row"]}
          >
            <Box flex={6}>
              <form onSubmit={formik.handleSubmit}>
                <Flex flexDir="column" gap={[5, null, null, 10]}>
                  <Flex
                    flexDir={["column", null, null, "row"]}
                    justify="space-between"
                  >
                    <FormLabel
                      htmlFor="name"
                      fontSize="xl"
                      textTransform="uppercase"
                      fontWeight={400}
                    >
                      {locale == "id" ? "Nama*" : "Name*"}
                    </FormLabel>
                    <Box w={["100%", null, null, 600]}>
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

                  <Flex
                    flexDir={["column", null, null, "row"]}
                    justify="space-between"
                  >
                    <FormLabel
                      htmlFor="email"
                      fontSize="xl"
                      textTransform="uppercase"
                      fontWeight={400}
                    >
                      Email*
                    </FormLabel>
                    <Box w={["100%", null, null, 600]}>
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
                    flexDir={["column", null, null, "row"]}
                    justify="space-between"
                  >
                    <FormLabel
                      htmlFor="phone"
                      fontSize="xl"
                      textTransform="uppercase"
                      fontWeight={400}
                    >
                      {locale == "id" ? "Telepon*" : "Phone*"}
                    </FormLabel>
                    <Box w={["100%", null, null, 600]}>
                      <Input
                        fontSize="sm"
                        id="phone"
                        name="phone"
                        type="text"
                        borderRadius={0}
                        placeholder="12345678"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phone}
                      />
                      <Text fontSize="xs" color="red.500" mt={1}>
                        {formik.errors.phone}
                      </Text>
                    </Box>
                  </Flex>

                  <Flex
                    flexDir={["column", null, null, "row"]}
                    justify="space-between"
                  >
                    <FormLabel
                      htmlFor="message"
                      fontSize="xl"
                      textTransform="uppercase"
                      fontWeight={400}
                    >
                      {locale == "id" ? "Pesan*" : "Message*"}
                    </FormLabel>
                    <Flex flexDir="column">
                      <Textarea
                        fontSize="sm"
                        w={["full", null, null, 600]}
                        id="message"
                        name="message"
                        borderRadius={0}
                        placeholder={
                          locale == "id"
                            ? "Tambahkan pesan pribadi disini..."
                            : "Add your personal message here..."
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.message}
                      />
                      <Text fontSize="xs" color="red.500" mt={1}>
                        {formik.errors.message}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </form>

              <Flex justify={["flex-start", null, null, "flex-end"]} mt={10}>
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY ?? ""}
                  onChange={(value: any) => setCapKey(value)}
                />
              </Flex>

              <Flex justify={["flex-start", null, null, "flex-end"]} mt={10}>
                <Button
                  variant="dark"
                  bg={color}
                  type="submit"
                  _hover={{}}
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
                    !formik.values.name ||
                    formik.status == "success" ||
                    !isCapValid
                  }
                >
                  {formik.isSubmitting
                    ? locale == "id"
                      ? `Mengirim Pesan..`
                      : `Sending Messages..`
                    : formik.status == "success"
                    ? locale == "id"
                      ? `Pesan berhasil terkirim!`
                      : `Thank you for getting in touch!`
                    : locale == "id"
                    ? `Kirim Pesan`
                    : `Messages`}
                </Button>
              </Flex>
            </Box>
            <Box flex={3} ml={30} fontSize="sm">
              <Text mb={4}>{location}</Text>
              <Text>tel:{phone}</Text>
              <Text>mail:{email}</Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Section>
  );
}
