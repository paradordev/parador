import {
  Box,
  Button,
  Center,
  Flex,
  FormLabel,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { findKey, isEmpty, toNumber, toString } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { increaseDate, objectToParams } from "../utils/functions";
import { useGetListHotel } from "../utils/hooks";
import LoadingSpinner from "./LoadingSpinner";

export default function FormBookNowTop({
  hotelCode,
  colorPrimary,
}: {
  hotelCode: any;
  colorPrimary: any;
}) {
  const router = useRouter();

  const { hotels, isLoading } = useGetListHotel();

  const [selectedHotel, setSelectedHotel] = useState<any>("-1");

  useEffect(() => {
    if (hotels && hotelCode) {
      const temp = findKey(hotels, function (o) {
        return o.hotel_code == hotelCode;
      });
      setSelectedHotel(toString(temp));
    }
  }, [hotels]);

  useEffect(() => {
    if (hotels && selectedHotel !== -1) {
      formik.setValues({
        ...formik.values,
        hotel: hotels[selectedHotel],
      });
    }
  }, [selectedHotel, hotels]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      arrival: "",
      departure: "",
      hotel: hotels ? hotels[0] : {},
      rooms: 1,
      adults: 2,
      child: 0,
      voucher: "",
    },
    validationSchema: Yup.object({
      arrival: Yup.string().required(
        router.locale == "id" ? "Harus diisi" : "Required"
      ),
      departure: Yup.string().required(
        router.locale == "id" ? "Harus diisi" : "Required"
      ),
      hotel: Yup.object(),
      rooms: Yup.number(),
      adults: Yup.number(),
      child: Yup.number(),
      voucher: Yup.string(),
    }),
    onSubmit: ({}, { setSubmitting, setStatus }) => {},
  });

  function handleClick() {
    const { adults, arrival, child, departure, hotel, rooms, voucher } =
      formik.values;

    window.open(
      `https://be.synxis.com/?${objectToParams({
        hotel: hotel ? hotel.hotel_code : hotels[0].hotel_code,
        arrive: isEmpty(arrival) ? `` : arrival,
        depart: isEmpty(departure) ? `` : departure,
        child,
        rooms,
        adult: adults,
        promo: voucher,
      })}`,
      "_blank"
    );
  }

  useEffect(() => {
    formik.setValues({
      ...formik.values,
      departure: increaseDate(formik.values.arrival),
    });
  }, [formik.values.arrival]);

  if (isLoading || !selectedHotel)
    return (
      <Flex
        bg={colorPrimary}
        color="white"
        py={6}
        px={5}
        borderRadius={10}
        flexDir="column"
        gap={4}
        w="100%"
        fontSize="sm"
        // opacity={0.9}
      >
        <Center h={10}>
          <LoadingSpinner />
        </Center>
      </Flex>
    );

  return (
    <Flex
      bg={colorPrimary}
      color="white"
      py={6}
      px={5}
      borderRadius={10}
      flexDir="column"
      gap={4}
      w="100%"
      maxW={600}
      fontSize="sm"
      opacity={0.9}
      border="1px solid var(--chakra-colors-whiteAlpha-600)"
    >
      <Flex
        gap={[0, null, null, 8]}
        w="full"
        flexWrap={["wrap", null, null, "nowrap"]}
      >
        <Flex
          flexDir="column"
          w={["full", null, null, "50%"]}
          mb={[3, null, null, 0]}
        >
          <FormLabel fontSize="xs" textTransform="uppercase" fontWeight={500}>
            {router.locale == "id" ? "Kedatangan" : "Arrival"}
          </FormLabel>
          <Box>
            <Input
              textTransform="uppercase"
              fontSize="sm"
              color="white"
              colorScheme="white"
              type="date"
              lang="fr-CA"
              borderRadius={0}
              borderColor="whiteAlpha.600"
              _placeholder={{ color: "white", opacity: 1 }}
              style={{ colorScheme: "dark" }}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                formik.setValues({
                  ...formik.values,
                  arrival: e.target.value,
                });
              }}
              id="arrival"
              name="arrival"
              value={formik.values.arrival}
            />
            <Text fontSize="xs" color="red.500" mt={1}>
              {formik.errors.arrival}
            </Text>
          </Box>
        </Flex>

        <Flex
          flexDir="column"
          w={["full", null, null, "50%"]}
          mb={[3, null, null, 0]}
        >
          <FormLabel fontSize="xs" textTransform="uppercase" fontWeight={500}>
            {router.locale == "id" ? "Kepergian" : "Departure"}
          </FormLabel>
          <Box>
            <Input
              textTransform="uppercase"
              fontSize="sm"
              disabled={!formik.values.arrival}
              min={
                new Date(
                  new Date().setDate(
                    new Date(
                      formik.values.arrival == ""
                        ? new Date()
                        : formik.values.arrival
                    ).getDate() + 1
                  )
                )
                  .toISOString()
                  .split("T")[0]
              }
              color="white"
              colorScheme="white"
              type="date"
              borderRadius={0}
              borderColor="whiteAlpha.600"
              _placeholder={{ color: "white", opacity: 1 }}
              style={{ colorScheme: "dark" }}
              onChange={(e) => {
                formik.setValues({
                  ...formik.values,
                  departure: e.target.value,
                });
              }}
              id="departure"
              name="departure"
              value={formik.values.departure}
            />
            <Text fontSize="xs" color="red.500" mt={1}>
              {formik.errors.departure}
            </Text>
          </Box>
        </Flex>
      </Flex>

      <Flex flexDir="column" w="100%" mb={[3, null, null, 0]}>
        <FormLabel fontSize="xs" textTransform="uppercase" fontWeight={500}>
          {router.locale == "id" ? "Pilih Hotel" : "Choose Hotel"}
        </FormLabel>
        <Box>
          <Select
            fontSize="sm"
            color="white"
            colorScheme="white"
            borderRadius={0}
            borderColor="whiteAlpha.600"
            _focus={{}}
            // defaultValue={selectedHotel}
            value={selectedHotel}
            onChange={(e) => {
              setSelectedHotel(e.target.value);
              formik.setValues({
                ...formik.values,
                hotel: hotels[e.target.value],
              });
            }}
          >
            {hotels.map((hotel: any, i: any) => {
              const tempHotel = JSON.stringify(hotel);
              return (
                <option key={hotel.name} value={i} style={{ color: "black" }}>
                  {hotel.name}
                </option>
              );
            })}
          </Select>
        </Box>
      </Flex>

      <Flex gap={8} w="full">
        <Flex flexDir="column" w="33%" mb={[3, null, null, 0]}>
          <FormLabel fontSize="xs" textTransform="uppercase" fontWeight={500}>
            {router.locale == "id" ? "Kamar" : "Rooms"}
          </FormLabel>
          <Box>
            <Input
              fontSize="sm"
              color="white"
              colorScheme="white"
              type="number"
              borderRadius={0}
              borderColor="whiteAlpha.600"
              _placeholder={{ color: "white", opacity: 1 }}
              placeholder="1"
              onChange={(e) => {
                formik.setValues({
                  ...formik.values,
                  rooms: toNumber(e.target.value),
                });
              }}
            />
            <Text fontSize="xs" color="red.500" mt={1}>
              {formik.errors.rooms}
            </Text>
          </Box>
        </Flex>{" "}
        <Flex flexDir="column" w="33%" mb={[3, null, null, 0]}>
          <FormLabel fontSize="xs" textTransform="uppercase" fontWeight={500}>
            {router.locale == "id" ? "Dewasa" : "Adults"}
          </FormLabel>
          <Box>
            <Input
              fontSize="sm"
              color="white"
              colorScheme="white"
              type="number"
              borderRadius={0}
              borderColor="whiteAlpha.600"
              _placeholder={{ color: "white", opacity: 1 }}
              placeholder="2"
              onChange={(e) => {
                formik.setValues({
                  ...formik.values,
                  adults: toNumber(e.target.value),
                });
              }}
            />
            <Text fontSize="xs" color="red.500" mt={1}>
              {formik.errors.adults}
            </Text>
          </Box>
        </Flex>{" "}
        <Flex flexDir="column" w="33%" mb={[3, null, null, 0]}>
          <FormLabel fontSize="xs" textTransform="uppercase" fontWeight={500}>
            {router.locale == "id" ? "Anak" : "Child"}
          </FormLabel>
          <Box>
            <Input
              fontSize="sm"
              color="white"
              colorScheme="white"
              type="number"
              borderRadius={0}
              borderColor="whiteAlpha.600"
              _placeholder={{ color: "white", opacity: 1 }}
              placeholder="0"
              onChange={(e) => {
                formik.setValues({
                  ...formik.values,
                  child: toNumber(e.target.value),
                });
              }}
            />
            <Text fontSize="xs" color="red.500" mt={1}>
              {formik.errors.child}
            </Text>
          </Box>
        </Flex>
      </Flex>

      <Flex flexDir="column" w="100%" mb={[3, null, null, 0]}>
        <FormLabel fontSize="xs" textTransform="uppercase" fontWeight={500}>
          {router.locale == "id" ? "Kode Promo" : "Promo Code"}
        </FormLabel>
        <Box>
          <Input
            fontSize="sm"
            color="white"
            colorScheme="white"
            type="text"
            borderRadius={0}
            borderColor="whiteAlpha.600"
            placeholder={
              router.locale == "id" ? "Masukkan Kode" : "Insert Code"
            }
            _placeholder={{ color: "white", opacity: 1 }}
            onChange={(e) => {
              formik.setValues({
                ...formik.values,
                voucher: e.target.value,
              });
            }}
          />
          <Text fontSize="xs" color="red.500" mt={1}>
            {formik.errors.voucher}
          </Text>
        </Box>
      </Flex>

      <Center>
        <Button
          variant="solid"
          bg="white"
          color="black"
          onClick={handleClick}
          disabled={!formik.isValid || isEmpty(formik.values.arrival)}
        >
          {router.locale == "id" ? "Pesan" : "Book Now"}
        </Button>
      </Center>
    </Flex>
  );
}
