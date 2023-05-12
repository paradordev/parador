import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Text,
  useOutsideClick,
  SimpleGrid,
  Select,
  Input,
} from "@chakra-ui/react";
import { isEmpty } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  IoChevronDown,
  IoAddCircleOutline,
  IoRemoveCircleOutline,
} from "react-icons/io5";
import { monthEn, monthId } from "../utils/const";
import {
  getFormDate,
  objectToParams,
  timeConvertion,
} from "../utils/functions";
// import { BookNowContext } from "../utils/hooks";
import Range from "./DatePickerV2";

const hotelList = [
  {
    location: "tangerang",
    list: [
      "Atria Hotel Gading Serpong",
      "Atria Residences Gading Serpong",
      "Vega Hotel Gading Serpong",
      "Fame Hotel Gading Serpong",
      "Starlet Hotel Serpong",
      "Starlet Hotel BSD City",
    ],
    code: [36461, 36462, 36463, 36464, 36465, 36471],
  },
  {
    location: "jakarta",
    list: ["Starlet Hotel Jakarta Airport"],
    code: [36470],
  },
  // { location: "SEMARANG", list: ["HA-KA Hotel Semarang"], code: [36469] },
  { location: "magelang", list: ["Atria Hotel Magelang"], code: [36467] },
  { location: "malang", list: ["Atria Hotel Malang"], code: [36466] },
  { location: "bali", list: ["Fame Hotel Sunset Road Bali"], code: [36468] },
];

export const BookNowContext = createContext<any>(null);

export default function FormBookNowV2({
  hotelCode,
  colorPrimary,
}: {
  hotelCode: any;
  colorPrimary: any;
}) {
  const router = useRouter();
  const container = useRef<any>(null);

  const [hotelValue, setHotelvalue] = useState<any>();

  // const [hotelPop, setHotelPop] = useState<boolean>(false);
  const [arrivePop, setArrivePop] = useState(false);

  const [values, setValues] = useState<any | null>({
    hotel_name: "",
    hotel: hotelCode ? hotelCode : null,
    hotel_error: false,
    arrive: "",
    depart: "",
    adult: 2,
    child: 0,
    childAge: [],
    room: 1,
    voucher: null,
    promo: "",
    hotelPop: false,
    arrivePop: false,
    deparPop: false,
    roomPop: false,
    promoPop: false,
  });

  const {
    hotel_name,
    hotel,
    arrive,
    depart,
    adult,
    child,
    room,
    voucher,
    childAge,
    promo,
  } = values;

  // useEffect(() => {
  //   if (container) {
  //     getHeight(container.current.offsetHeight);
  //   }
  // }, []);

  useEffect(() => {
    if (hotelCode) {
      for (let i = 0; i < hotelList.length; i++) {
        for (let j = 0; j < hotelList[i].code.length; j++) {
          if (hotelList[i].code[j] == hotelCode) {
            setValues({ ...values, hotel_name: hotelList[i].list[j] });
          }
        }
      }
    }
  }, []);

  function handleClick() {
    function handleDate(s: string) {
      let a = s.split("/");
      let temp = `${a[2]}-${a[0]}-${a[1]}`;
      return temp;
    }

    if (!values.hotel) {
      setValues({ ...values, hotel_error: true, hotelPop: true });
      return;
    }

    if (!values.hotel_error && values.hotel)
      window.open(
        `https://be.synxis.com/?${objectToParams({
          hotel,
          arrive: isEmpty(arrive) ? `` : handleDate(arrive),
          depart: isEmpty(depart) ? `` : handleDate(depart),
          child,
          rooms: room,
          adult,
          childages: childAge.toString("|"),
          promo,
        })}`,
        "_blank"
      );
  }

  return (
    <BookNowContext.Provider value={{ values, setValues }}>
      <Box
        ref={container}
        display={{ base: "none", lg: "block" }}
        zIndex={50}
        w="100%"
        py={6}
        className="book-now-container"
      >
        <Flex
          mx={100}
          justifyContent="space-between"
          alignItems="center"
          gap={6}
        >
          {/* HOTEL FIELD & POPUP */}
          {values.hotelPop && (
            <Box zIndex={51} position="absolute" bottom={"160%"}>
              <HotelPopUp />
            </Box>
          )}

          <FormField
            title={router.locale == "id" ? "hotel" : "hotels"}
            desc={
              !isEmpty(hotel_name)
                ? hotel_name
                : router.locale == "id"
                ? `Pilih hotel`
                : `Select a Hotel`
            }
            flex={31}
            onClick={() => {
              setValues({
                ...values,
                hotelPop: !values.hotelPop,
                arrivePop: false,
                roomPop: false,
                promoPop: false,
              });
            }}
          />

          {/* DATES FIELD & POPUP */}
          {values.arrivePop && (
            <Box zIndex={51} position="absolute" bottom={"160%"} left="27%">
              <DatePopUp />
            </Box>
          )}
          <FormField
            title={router.locale == "id" ? "tanggal" : "dates"}
            desc={
              arrive && depart
                ? getFormDate([
                    timeConvertion({
                      UNIX_timestamp: Math.floor(
                        new Date(arrive).getTime() / 1000
                      ),
                      months: router.locale == "id" ? monthId : monthEn,
                    }),
                    timeConvertion({
                      UNIX_timestamp: Math.floor(
                        new Date(depart).getTime() / 1000
                      ),
                      months: router.locale == "id" ? monthId : monthEn,
                    }),
                  ])
                : router.locale == "id"
                ? `Kedatangan - Keberangkatan`
                : `Arrival - Departure`
            }
            flex={31}
            onClick={() => {
              setValues({
                ...values,
                hotelPop: false,
                arrivePop: !values.arrivePop,
                roomPop: false,
                promoPop: false,
              });
            }}
          />

          {/* ROOM FIELD & POPUP */}
          {values.roomPop && (
            <Box zIndex={51} position="absolute" bottom={"160%"} left="48%">
              <RoomPopUp />
            </Box>
          )}
          <FormField
            title={
              router.locale == "id" ? "tamu dan kamar" : "guests and rooms"
            }
            desc={`${adult} ${
              router.locale == "id" ? `Dewasa` : `Adult(s)`
            }, ${child} ${router.locale == "id" ? `Anak` : `Child`}, ${room} ${
              router.locale == "id" ? `Ruangan` : `Room`
            }`}
            flex={33}
            onClick={() => {
              setValues({
                ...values,
                hotelPop: false,
                arrivePop: false,
                roomPop: !values.roomPop,
                promoPop: false,
              });
            }}
          />

          {/* PROMO POPUP */}
          {values.promoPop && (
            <Box zIndex={51} position="absolute" bottom={"160%"} right="10%">
              <Flex
                flexDir="column"
                w={300}
                bg="blackAlpha.900"
                gap={4}
                p={4}
                borderRadius={10}
              >
                <Input
                  placeholder={
                    router.locale == "id" ? "KETIK DISINI" : "TYPE IN HERE"
                  }
                  fontSize="sm"
                  borderColor="whiteAlpha.500"
                  borderRadius={0}
                  color="white"
                  w="100%"
                  onChange={(e) =>
                    setValues({ ...values, promo: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setValues({
                        ...values,
                        hotelPop: false,
                        arrivePop: false,
                        roomPop: false,
                        promoPop: !values.promoPop,
                      });
                    }
                  }}
                />
                <Center>
                  <Button
                    borderColor="whiteAlpha.400"
                    size="sm"
                    variant="outlineBlack"
                    mt={2}
                    onClick={() => {
                      setValues({
                        ...values,
                        promoPop: false,
                      });
                    }}
                  >
                    {router.locale == "id" ? "Selesai" : "Done"}
                  </Button>
                </Center>
              </Flex>
            </Box>
          )}
          <FormField
            title={router.locale == "id" ? "kode promo" : "promo code"}
            desc={
              values.promo
                ? values.promo
                : router.locale == "id"
                ? `Masukkan`
                : `Insert`
            }
            flex={20}
            hasDivider={false}
            onClick={() => {
              setValues({
                ...values,
                hotelPop: false,
                arrivePop: false,
                roomPop: false,
                promoPop: !values.promoPop,
              });
            }}
          />

          <Button
            colorScheme="whiteAlpha"
            width="15%"
            maxW={300}
            onClick={handleClick}
            zIndex={20}
            fontWeight={500}
          >
            {router.locale == "id" ? "Pesan" : "Book Now"}
          </Button>
        </Flex>
      </Box>
    </BookNowContext.Provider>
  );
}

function FormField({
  title,
  desc,
  flex,
  onClick,
  hasDivider = true,
}: {
  title: string;
  flex: number;
  desc: string;
  onClick: any;
  hasDivider?: boolean;
}) {
  return (
    <>
      <Box width={flex + "%"}>
        <Flex direction="column" color="white" gap={2}>
          <Text
            textTransform="uppercase"
            color="white"
            fontSize="sm"
            letterSpacing="wider"
            noOfLines={1}
          >
            {title}
          </Text>
          <Flex
            alignItems="center"
            justifyContent="space-between"
            onClick={onClick}
            cursor="pointer"
          >
            <Text
              className="max-text-1-line"
              w="100%"
              fontWeight={500}
              letterSpacing="wider"
            >
              {desc}
            </Text>
            {hasDivider ? <IoChevronDown /> : <Box />}
          </Flex>
        </Flex>
      </Box>
      {hasDivider && (
        <Center height="56px">
          <Divider orientation="vertical" borderColor="whiteAlpha.700" />
        </Center>
      )}
    </>
  );
}

function HotelPopUp() {
  const { values, setValues } = useContext(BookNowContext);
  const { locale } = useRouter();

  return (
    <>
      <Box
        bg="red.700"
        borderRadius={10}
        mb={2}
        display={values.hotel_error ? `flex` : `none`}
      >
        <Text color="white" opacity={1} fontSize="xs" py={2} px={5}>
          {locale == "id"
            ? `Silakan pilih Hotel terlebih dahulu`
            : `Please select a Hotel first`}
        </Text>
      </Box>
      <Box bg="blackAlpha.900" py={6} px={5} borderRadius={10}>
        <Flex gap={14}>
          <LocToHotel
            loc={hotelList[0].location}
            list={hotelList[0].list}
            code={hotelList[0].code}
          />
          <Flex direction="column" gap={5}>
            <LocToHotel
              loc={hotelList[1].location}
              list={hotelList[1].list}
              code={hotelList[1].code}
            />
            <Divider />
            <LocToHotel
              loc={hotelList[2].location}
              list={hotelList[2].list}
              code={hotelList[2].code}
            />
            <Divider />
            <LocToHotel
              loc={hotelList[3].location}
              list={hotelList[3].list}
              code={hotelList[3].code}
            />
          </Flex>
          <Flex direction="column" gap={5}>
            <LocToHotel
              loc={hotelList[4].location}
              list={hotelList[4].list}
              code={hotelList[4].code}
            />
            {/* <Divider />
            <LocToHotel
              loc={hotelList[5].location}
              list={hotelList[5].list}
              code={hotelList[5].code}
            /> */}
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

function LocToHotel({ loc, list, code }: any) {
  const { values, setValues } = useContext(BookNowContext);
  return (
    <Flex flexDir="column" textTransform="uppercase" gap={3} fontSize="x-small">
      <Text color="white" fontWeight={600} letterSpacing={4}>
        {loc}
      </Text>
      {list.map((name: any, i: string | number) => (
        <Text
          color="whiteAlpha.800"
          key={name}
          letterSpacing={1}
          cursor="pointer"
          onClick={() => {
            setValues({
              ...values,
              hotel: code[i],
              hotel_name: name,
              hotelPop: false,
              hotel_error: false,
            });
          }}
          _hover={{ color: "white" }}
        >
          {name}
        </Text>
      ))}
    </Flex>
  );
}

function DatePopUp() {
  return (
    <Box className="date-container">
      <Range />
    </Box>
  );
}

function RoomPopUp() {
  const { values, setValues } = useContext(BookNowContext);
  const { adult, child, childAge, room } = values;

  const [el, setEl] = useState(childAge ? childAge : []);
  const items = [];

  const router = useRouter();

  for (let i = 0; i < child; i++) {
    items.push(
      <Box key={i}>
        <Text fontSize=".75em" mb={1}>
          CHILD {i + 1}
        </Text>
        <Select
          fontSize=".8em"
          placeholder="Age"
          border="1px"
          borderColor="whiteAlpha.400"
          paddingInline={0}
          paddingInlineEnd={0}
          borderRadius={0}
          color="whiteAlpha.700"
          iconSize="12px"
          variant="outline"
          value={el[i]}
          onChange={(e) => {
            let temp = [...el];
            temp[i] = e.target.value;
            setEl(temp);
          }}
        >
          <option value={0}>{`< 1`}</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
          <option value={8}>8</option>
          <option value={9}>9</option>
        </Select>
      </Box>
    );
  }

  return (
    <>
      {!(child < 9 || room < 9) && (
        <Center
          bg="red.700"
          mb={2}
          py={2}
          px={20}
          maxW="100%"
          borderRadius={10}
        >
          <Text
            color="white"
            fontSize="xs"
            as="span"
            maxInlineSize="44"
            align="center"
          >
            {`Maximum number of rooms and child become 9`}
          </Text>
        </Center>
      )}

      {!(room <= adult) && (
        <Center
          bg="red.700"
          mb={2}
          py={2}
          px={10}
          maxW="100%"
          borderRadius={10}
        >
          <Text
            color="white"
            fontSize="xs"
            as="span"
            maxInlineSize="56"
            align="center"
          >
            {`Number of room (s) can't be more than number of adult guest(s)`}
          </Text>
        </Center>
      )}

      <Flex
        direction="column"
        borderRadius={10}
        bg="blackAlpha.900"
        color="white"
        px={6}
        pt={5}
        pb={3}
        w={430}
        fontSize="sm"
        gap={2}
      >
        <RoomPopSelect
          setValue={(adult: any) => setValues({ ...values, adult })}
          value={adult}
          name={router.locale == "id" ? "dewasa" : "adult"}
          warning={undefined}
        />
        <RoomPopSelect
          setValue={(child: any) => setValues({ ...values, child })}
          value={child}
          name={router.locale == "id" ? "anak" : "child"}
          warning="Max. 9 children"
          max={9}
        />
        <RoomPopSelect
          setValue={(room: any) => setValues({ ...values, room })}
          value={room}
          name={router.locale == "id" ? "ruangan" : "room"}
          warning="Max. 9 rooms"
          max={9}
        />
        {child > 0 && (
          <Box>
            <Box fontSize="xs" my={2}>
              <Text>{`ENTER CHILD'S AGES`}</Text>
              <Text
                color="whiteAlpha.600"
                fontSize=".9em"
              >{`Knowing your children's ages will help us find you suitable accomodations`}</Text>
            </Box>
            <SimpleGrid columns={5} spacing={2} fontSize="xs">
              {items}
            </SimpleGrid>
          </Box>
        )}
        <Center>
          <Button
            borderColor="whiteAlpha.400"
            size="sm"
            variant="outlineBlack"
            mt={2}
            onClick={() => {
              let temp = el.slice(0, child);
              setValues({ ...values, roomPop: false, childAge: temp });
            }}
          >
            {router.locale == "id" ? "Selesai" : "Done"}
          </Button>
        </Center>
      </Flex>
    </>
  );
}

function RoomPopSelect({ name, warning, value, setValue, max = 99 }: any) {
  return (
    <Flex
      justify="space-between"
      align="center"
      border="1px"
      px={4}
      py={2}
      borderColor="whiteAlpha.400"
      fontSize="xs"
    >
      <Flex align="center" gap={3}>
        <Text textTransform="uppercase">{name}</Text>
        {value >= max && warning && (
          <Text fontSize=".8em" color="red.400">
            ({warning})
          </Text>
        )}
      </Flex>
      <Flex justify="space-between" align="center" w={90}>
        <IoRemoveCircleOutline
          onClick={() => {
            value > 0 && setValue(value - 1);
          }}
          size={20}
          opacity={value > 0 ? 1 : 0.4}
          cursor={value > 0 ? `pointer` : `not-allowed`}
        />
        <Text>{value}</Text>
        <IoAddCircleOutline
          onClick={() => {
            value < max && setValue(value + 1);
          }}
          size={20}
          opacity={value < max ? 1 : 0.4}
          cursor={value < max ? `pointer` : `not-allowed`}
        />
      </Flex>
    </Flex>
  );
}
