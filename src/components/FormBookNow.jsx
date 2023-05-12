import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Input,
  Select,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  IoAddCircleOutline,
  IoChevronDown,
  IoRemoveCircleOutline,
} from "react-icons/io5";
import { objectToParams } from "../utils/functions";
import { BookNowContext } from "../utils/hooks";
import Single from "./DatePicker";

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

export default function FormBookNow({ hotelCode }) {
  const router = useRouter();
  const hotelRef = useRef(null);

  const [hotelPop, setHotelPop] = useState(false);

  const [hotelValue, setHotelvalue] = useState();

  const [arrivePop, setArrivePop] = useState(false);

  const [values, setValues] = useState({
    hotel_name: "",
    hotel: hotelCode ? hotelCode : null,
    hotel_error: false,
    arrivePop: false,
    deparPop: false,
    arrive: "",
    depart: "",
    adult: 1,
    child: 0,
    childAge: [],
    room: 1,
    roomPop: false,
    voucher: null,
    promo: "",
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
    if (!values.hotel) {
      setValues({ ...values, hotel_error: true });
      setHotelPop(true);
    }

    if (!values.hotel_error && values.hotel)
      router.push(
        `https://be.synxis.com/?${objectToParams({
          hotel,
          arrive,
          depart,
          child,
          rooms: room,
          adult,
          childages: childAge.toString("|"),
          promo,
        })}`
      );
  }

  return (
    <BookNowContext.Provider value={{ values, setValues }}>
      <Box
        position="absolute"
        bottom={16}
        zIndex={1000}
        w="100%"
        mb={2}
        className="book-now-container"
      >
        <Flex
          mx={100}
          justifyContent="space-between"
          alignItems="center"
          gap={6}
        >
          {/* HOTEL FIELD & POPUP */}
          {hotelPop && (
            <Box
              zIndex={9999}
              position="absolute"
              bottom={16}
              onClick={() => setHotelPop(false)}
            >
              <HotelPopUp
                setHotelValue={(hotelValue) => setHotelvalue(hotelValue)}
              />
            </Box>
          )}
          <FormField
            title="hotels"
            desc={hotel_name.length > 0 ? hotel_name : `Select a Hotel`}
            flex={13}
            onClick={() => setHotelPop(!hotelPop)}
          />

          {/* ARRIVE FIELD & POPUP */}
          {values.arrivePop && (
            <Box zIndex={9999} position="absolute" bottom={16} left="18%">
              <DatePopUp type="a" />
            </Box>
          )}
          <FormField
            title="arrival"
            desc={arrive ? arrive : `Choose Date`}
            flex={13}
            onClick={() => {
              setValues({ ...values, arrivePop: !values.arrivePop });
            }}
          />

          {/* DEPART FIELD & POPUP */}
          {values.deparPop && (
            <Box zIndex={9999} position="absolute" bottom={16} left="32%">
              <DatePopUp type="b" />
            </Box>
          )}
          <FormField
            title="departure"
            desc={depart ? depart : `Choose Date`}
            flex={13}
            onClick={() => {
              setValues({ ...values, deparPop: !values.deparPop });
            }}
          />

          {/* ROOM FIELD & POPUP */}
          {values.roomPop && (
            <Box zIndex={9999} position="absolute" bottom={16} left="48%">
              <RoomPopUp />
            </Box>
          )}
          <FormField
            title="guests and rooms"
            desc={`${adult} Adult(s), ${child} Child, ${room} Room`}
            flex={20}
            onClick={() => {
              setValues({ ...values, roomPop: !values.roomPop });
            }}
          />

          {/* PROMO POPUP */}
          {values.promoPop && (
            <Box zIndex={9999} position="absolute" bottom={16} right="16%">
              <Input
                placeholder="Type..."
                border={0}
                borderRadius={0}
                bg="blackAlpha.900"
                color="white"
                w="80%"
                textAlign="center"
                onChange={(e) =>
                  setValues({ ...values, promo: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setValues({
                      ...values,
                      promoPop: false,
                    });
                  }
                }}
              />
            </Box>
          )}
          <FormField
            title="code promo"
            desc={values.promo ? values.promo : `Insert`}
            flex={13}
            onClick={() => {
              setValues({ ...values, promoPop: !values.promoPop });
            }}
          />

          <Button
            colorScheme="whiteAlpha"
            flex={10}
            minW={120}
            onClick={handleClick}
            zIndex={20}
          >
            {router.locale == "id" ? "Pesan" : "Book Now"}
          </Button>
        </Flex>
      </Box>
    </BookNowContext.Provider>
  );
}

function FormField({ title, desc, flex, onClick }) {
  return (
    <>
      <Box width={flex + "%"}>
        <Flex direction="column" color="white" gap={2}>
          <Text textTransform="uppercase" color="whiteAlpha.700" fontSize="sm">
            {title}
          </Text>
          <Flex
            alignItems="center"
            justifyContent="space-between"
            onClick={onClick}
            cursor="pointer"
          >
            <Text className="max-text-1-line" w="100%">
              {desc}
            </Text>
            <IoChevronDown />
          </Flex>
        </Flex>
      </Box>
      <Center height="56px">
        <Divider
          orientation="vertical"
          opacity={1}
          my={3}
          borderWidth={0.5}
          py={0.1}
          borderColor="white"
          bg="white"
        />
      </Center>
    </>
  );
}

function HotelPopUp() {
  const { values, setValues } = useContext(BookNowContext);
  return (
    <>
      <Box
        bg="red.700"
        mb={2}
        justify="center"
        display={values.hotel_error ? `flex` : `none`}
      >
        <Text
          color="white"
          opacity={1}
          // textTransform="uppercase"
          fontSize="sm"
          py={2}
          px={14}
        >
          Please select a Hotel first
        </Text>
      </Box>
      <Box bg="blackAlpha.900" py={8} px={14}>
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
            <Divider />
            <LocToHotel
              loc={hotelList[5].location}
              list={hotelList[5].list}
              code={hotelList[5].code}
            />
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

function LocToHotel({ loc, list, code }) {
  const { values, setValues } = useContext(BookNowContext);
  return (
    <Flex flexDir="column" textTransform="uppercase" gap={3} fontSize="xs">
      <Text color="white" fontWeight={600} letterSpacing={7}>
        {loc}
      </Text>
      {list.map((name, i) => (
        <Text
          color="whiteAlpha.700"
          key={name}
          letterSpacing={2}
          cursor="pointer"
          onClick={() =>
            setValues({
              ...values,
              hotel: code[i],
              hotel_name: name,
              hotel_error: false,
            })
          }
          _hover={{ color: "white" }}
        >
          {name}
        </Text>
      ))}
    </Flex>
  );
}

function DatePopUp({ type }) {
  return (
    <Box className="date-container">
      <Single type={type} />
    </Box>
  );
}

function RoomPopUp() {
  const { values, setValues } = useContext(BookNowContext);
  const { adult, child, childAge, room } = values;

  const [el, setEl] = useState(childAge ? childAge : []);
  const items = [];

  const { locale } = useRouter();

  for (let i = 0; i < child; i++) {
    items.push(
      <Box key={i}>
        <Text fontSize=".9em" mb={1}>
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
          iconSize={12}
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
        <Center bg="red.700" mb={2} py={2} px={20} maxW="100%">
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
      <Flex
        direction="column"
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
          setValue={(adult) => setValues({ ...values, adult })}
          value={adult}
          name="adult"
        />
        <RoomPopSelect
          setValue={(child) => setValues({ ...values, child })}
          value={child}
          name="child"
          warning="Max. 9 children"
          max={9}
        />
        <RoomPopSelect
          setValue={(room) => setValues({ ...values, room })}
          value={room}
          name="room"
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
            {locale == "id" ? "Selesai" : "Done"}
          </Button>
        </Center>
      </Flex>
    </>
  );
}

function RoomPopSelect({ name, warning, value, setValue, max = 99 }) {
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
