import {
  AbsoluteCenter,
  AspectRatio,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useDayzed } from "dayzed";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { BookNowContext } from "./FormBookNowV2";

function Calendar(props) {
  return <Box w="100%">{props.children}</Box>;
}

function Month(props) {
  return (
    <SimpleGrid columns={7} spacing={0}>
      {props.children}
    </SimpleGrid>
  );
}

function DayOfMonth({
  unavailable = false,
  today = false,
  isInRange,
  ...props
}) {
  const { selected } = props;

  // let cellStyle = "";
  // if (today) cellStyle = "bg-blue-200 text-blue-900";
  // if (selected || isInRange) cellStyle = "bg-purple-200 text-purple-900";
  // if (unavailable) cellStyle = "opacity-25 cursor-not-allowed";

  const selectedStyle = {
    background: `white`,
    // borderRadius: `50%`,
    color: `black`,
    fontWeight: 600,
  };

  const inRangeStyle = {
    backgroundColor: `var(--chakra-colors-whiteAlpha-500)`,
  };

  const finalStyle = selected ? inRangeStyle : isInRange ? inRangeStyle : {};

  return (
    <Box pt={2}>
      <AspectRatio ratio={4 / 3}>
        <button type="button" style={finalStyle}>
          <Box
            color={
              unavailable ? `whiteAlpha.500` : selected ? `black` : `white`
            }
            cursor={unavailable ? `not-allowed` : `pointer`}
            {...props}
          >
            {selected ? (
              <AbsoluteCenter w="100%" h="100%" style={selectedStyle}>
                <Center w="100%" h="100%">
                  {props.children}
                </Center>
              </AbsoluteCenter>
            ) : (
              <Flex>{props.children}</Flex>
            )}
          </Box>
        </button>
      </AspectRatio>
    </Box>
  );
}

function DayOfMonthEmpty(props) {
  return <div>{props.children}</div>;
}

function RangeDatepicker(props) {
  const { values, setValues } = useContext(BookNowContext);

  const [hoveredDate, setHoveredDate] = useState(null);

  let {
    calendars,
    getBackProps,
    getForwardProps,
    getDateProps,
    showOutsideDays,
  } = useDayzed(props);

  useEffect(() => {
    function navigate(e) {
      switch (e.keyCode) {
        case 37: // leftArrow
          getKeyOffset(-1);
          break;
        case 38: // leftArrow
          getKeyOffset(-7);
          break;
        case 39: // leftArrow
          getKeyOffset(1);
          break;
        case 40: // leftArrow
          getKeyOffset(7);
          break;
        default:
          break;
      }
    }

    addEventListener("keydown", navigate);

    return () => removeEventListener("keydown", navigate);
  });

  function getKeyOffset(number) {
    const e = document.activeElement;
    let buttons = document.querySelectorAll("button");

    buttons.forEach((el, i) => {
      const newNodeKey = i + number;
      if (el == e) {
        if (newNodeKey <= buttons.length - 1 && newNodeKey >= 0) {
          buttons[newNodeKey].focus();
        } else {
          buttons[0].focus();
        }
      }
    });
  }

  function onMouseLeave() {
    setHoveredDate(null);
  }

  function onMouseEnter(date) {
    if (!props.selected.length) return;

    setHoveredDate(date);
  }

  function isInRange(date) {
    let { selected } = props;

    if (selected.length) {
      let firstSelected = selected[0].getTime();
      if (selected.length === 2) {
        let secondSelected = selected[1].getTime();
        return firstSelected < date && secondSelected > date;
      } else {
        return (
          hoveredDate &&
          ((firstSelected < date && hoveredDate >= date) ||
            (date < firstSelected && date >= hoveredDate))
        );
      }
    }

    return false;
  }

  const router = useRouter();

  if (calendars.length) {
    return (
      <Flex
        flexDir="column"
        h="100%"
        w="100%"
        bg="blackAlpha.900"
        color="white"
        fontSize="xs"
        textTransform="uppercase"
        py={8}
        px={6}
        borderRadius={10}
      >
        <Flex gap={20}>
          {calendars.map((calendar, i) => (
            <Flex key={i} flexDir="column">
              <Flex w="100%" justify="space-between" alignItems="center">
                {i == 0 ? (
                  <button
                    {...getBackProps({ calendars })}
                    style={{
                      opacity: calendars[0].weeks[0][0].prevMonth ? 1 : 0.4,
                      cursor: calendars[0].weeks[0][0].prevMonth
                        ? `pointer`
                        : `not-allowed`,
                    }}
                  >
                    <IoChevronBack size={20} />
                  </button>
                ) : (
                  <Box w="20px" />
                )}
                <Center alignSelf="center">
                  <Text as="span" fontWeight={500} fontSize="md">
                    {
                      (router.locale == "id"
                        ? monthNamesFullId
                        : monthNamesFullEn)[calendar.month]
                    }{" "}
                    {calendar.year}
                  </Text>
                </Center>
                {i == 1 ? (
                  <button {...getForwardProps({ calendars })}>
                    <IoChevronForward size={20} />
                  </button>
                ) : (
                  <Box w="20px" />
                )}
              </Flex>

              <Flex my={4}>
                <Divider
                  orientation="horizontal"
                  borderColor="whiteAlpha.700"
                />
              </Flex>

              <SimpleGrid columns={7} columnGap={2}>
                {(router.locale == "id"
                  ? weekdayNamesShortId
                  : weekdayNamesShortEn
                ).map((weekday) => (
                  <Center key={`${calendar.month}${calendar.year}${weekday}`}>
                    <Text fontWeight={500} textAlign="center">
                      {weekday}
                    </Text>
                  </Center>
                ))}
              </SimpleGrid>

              <SimpleGrid columns={7} textAlign="center" cursor="default">
                {calendar.weeks.map((week, windex) =>
                  week.map((dateObj, index) => {
                    let key = `${calendar.month}${calendar.year}${windex}${index}`;
                    if (!dateObj) {
                      return <DayOfMonthEmpty key={key} />;
                    }

                    let {
                      date,
                      selected,
                      selectable,
                      today,
                      nextMonth,
                      prevMonth,
                    } = dateObj;

                    return (
                      <DayOfMonth
                        key={key}
                        {...getDateProps({
                          dateObj,
                          onMouseEnter: () => onMouseEnter(date),
                        })}
                        selected={selected}
                        unavailable={!selectable || prevMonth || nextMonth}
                        today={today}
                        isInRange={isInRange(date)}
                      >
                        {date.getDate()}
                      </DayOfMonth>
                    );
                  })
                )}
              </SimpleGrid>
            </Flex>
          ))}
        </Flex>
        <Center mt={4}>
          <Button
            borderColor="whiteAlpha.400"
            size="sm"
            variant="outlineBlack"
            mt={2}
            onClick={() => {
              setValues({ ...values, arrivePop: false });
            }}
          >
            {router.locale == "id" ? "Selesai" : "Done"}
          </Button>
        </Center>
      </Flex>
    );
  }

  if (calendars.length) {
    return (
      <Calendar onMouseLeave={onMouseLeave}>
        <Box bg="blackAlpha.900" color="white">
          <button {...getBackProps({ calendars })}>
            <IoChevronBack size={20} />
          </button>
          <button {...getForwardProps({ calendars })}>
            <IoChevronForward size={20} />
          </button>
        </Box>
        <Flex bg="grey.400" color="white">
          {calendars.map((calendar, i) => (
            <Flex key={i} bg="yellow.300" margin={2}>
              {
                (router.locale == "id" ? monthNamesFullId : monthNamesFullEn)[
                  calendar.month
                ]
              }{" "}
              {calendar.year}
            </Flex>
          ))}
          <Flex>
            {calendars.map((calendar) => (
              <Month key={`${calendar.month}${calendar.year}`}>
                <Flex bg="pink.300" margin={2}>
                  {
                    (router.locale == "id" ? monthNamesFullId : monthNamesFullEn)[
                      calendar.month
                    ]
                  }{" "}
                  {calendar.year}
                </Flex>

                {(router.locale == "id"
                  ? weekdayNamesShortId
                  : weekdayNamesShortEn
                ).map((weekday) => (
                  <DayOfMonthEmpty
                    key={`${calendar.month}${calendar.year}${weekday}`}
                  >
                    {weekday}
                  </DayOfMonthEmpty>
                ))}

                {calendar.weeks.map((week, windex) =>
                  week.map((dateObj, index) => {
                    let key = `${calendar.month}${calendar.year}${windex}${index}`;
                    if (!dateObj) {
                      return <DayOfMonthEmpty key={key} />;
                    }

                    let { date, selected, selectable, today } = dateObj;

                    return (
                      <DayOfMonth
                        key={key}
                        {...getDateProps({
                          dateObj,
                          onMouseEnter: () => onMouseEnter(date),
                        })}
                        selected={selected}
                        unavailable={!selectable}
                        today={today}
                        isInRange={isInRange(date)}
                      >
                        {date.getDate()}
                      </DayOfMonth>
                    );
                  })
                )}
              </Month>
            ))}
          </Flex>
        </Flex>
      </Calendar>
    );
  }

  return null;
}

function Range(props) {
  const { values, setValues } = useContext(BookNowContext);

  const [selectedDates, setSelectedDates] = useState([]);
  const [date] = useState(new Date());

  useEffect(() => {
    if (!isEmpty(values.depart) && !isEmpty(values.arrive)) {
      const temp = [new Date(values.arrive), new Date(values.depart)];
      setSelectedDates([...temp]);
    }
    if (!isEmpty(values.arrive)) {
      setSelectedDates([new Date(values.arrive)]);
    }
  }, []);

  function _handleOnDateSelected({ selected, selectable, date }) {
    if (!selectable) return;

    let dateTime = date.getTime();
    let newDates = [...selectedDates];
    if (selectedDates.length) {
      if (selectedDates.length === 1) {
        let firstTime = selectedDates[0].getTime();

        if (firstTime < dateTime) newDates.push(date);
        else newDates.unshift(date);

        setSelectedDates(newDates);

        setValues({
          ...values,
          arrive: newDates[0].toLocaleDateString(),
          depart: newDates[1].toLocaleDateString(),
        });
      } else if (newDates.length === 2) {
        setSelectedDates([date]);
        setValues({ ...values, arrive: [date][0].toLocaleDateString() });
      }
    } else {
      newDates.push(date);
      setSelectedDates(newDates);

      setValues(
        newDates.length == 2
          ? {
              ...values,
              arrive: newDates[0].toLocaleDateString(),
              depart: newDates[1].toLocaleDateString(),
            }
          : {
              ...values,
              arrive: newDates[0].toLocaleDateString(),
            }
      );
    }
  }

  let minDate = new Date();
  minDate.setDate(minDate.getDate() - 1);

  return (
    <RangeDatepicker
      showOutsideDays={true}
      minDate={minDate}
      date={date}
      selected={selectedDates}
      onDateSelected={_handleOnDateSelected}
      monthsToDisplay={2}
    />
  );
}

export default Range;

export const monthNamesFullEn = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const monthNamesFullId = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export const monthNamesShort = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const weekdayNamesShortEn = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

export const weekdayNamesShortId = [
  "Min",
  "Sen",
  "Sel",
  "Rab",
  "Kam",
  "Jum",
  "Sab",
];
