import {
  AspectRatio,
  Box,
  Divider,
  Flex,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useDayzed } from "dayzed";
import React, { useContext, useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { BookNowContext } from "../utils/hooks";

const monthNamesShort = [
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
const weekdayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Calendar({ calendars, getBackProps, getForwardProps, getDateProps }) {
  const { values, setValues } = useContext(BookNowContext);
  if (calendars.length) {
    return (
      <Box
        w={320}
        textAlign="center"
        bg="blackAlpha.900"
        p={8}
        color="white"
        fontSize="xs"
      >
        {calendars.map((calendar) => (
          <div key={`${calendar.month}${calendar.year}`}>
            <Flex
              justify="space-between"
              align="center"
              fontWeight={600}
              fontSize="sm"
            >
              <button {...getBackProps({ calendars })}>
                <IoChevronBack size={20} />
              </button>
              <Box>
                {monthNamesShort[calendar.month]} {calendar.year}
              </Box>
              <button {...getForwardProps({ calendars })}>
                <IoChevronForward size={20} />
              </button>
            </Flex>

            <Divider mt={4} mb={1} />

            <SimpleGrid columns={7}>
              {weekdayNamesShort.map((weekday) => (
                <AspectRatio
                  key={`${calendar.month}${calendar.year}${weekday}`}
                  ratio={1}
                >
                  <Text>{weekday}</Text>
                </AspectRatio>
              ))}
            </SimpleGrid>

            <SimpleGrid columns={7} columnGap={5} rowGap={3}>
              {calendar.weeks.map((week, weekIndex) =>
                week.map((dateObj, index) => {
                  let key = `${calendar.month}${calendar.year}${weekIndex}${index}`;
                  if (!dateObj) {
                    return (
                      <AspectRatio key={key} ratio={1}>
                        <Box color="blackAlpha.200" />
                      </AspectRatio>
                    );
                  }
                  let {
                    date,
                    selected,
                    selectable,
                    today,
                    prevMonth,
                    nextMonth,
                  } = dateObj;
                  let colorToday = today ? "var(--chakra-colors-red-400)" : "";
                  let color =
                    prevMonth || nextMonth ? "whiteAlpha.500" : "white";

                  return (
                    <AspectRatio key={key} ratio={1} onClick={() => {}}>
                      <Text
                        _hover={{
                          background: "var(--chakra-colors-red-800)",
                          borderRadius: "100%",
                        }}
                        color={color}
                        style={{
                          color: colorToday,
                        }}
                        {...getDateProps({ dateObj })}
                      >
                        {selectable ? date.getDate() : "X"}
                      </Text>
                    </AspectRatio>
                  );
                })
              )}
            </SimpleGrid>
          </div>
        ))}
      </Box>
    );
  }
  return null;
}

function Datepicker(props) {
  let dayzedData = useDayzed(props);
  return <Calendar {...dayzedData} />;
}

function Single({ type }) {
  const { values, setValues } = useContext(BookNowContext);
  const [selectedDate, setSelectedDate] = useState();

  const _handleOnDateSelected = ({ selected, selectable, date }) => {
    setSelectedDate(date);
    const dateISO = date.addDays(1).toISOString().split("T")[0];
    if (type === "a") {
      setValues({ ...values, arrive: dateISO, arrivePop: false });
    } else if (type === "b") {
      setValues({ ...values, depart: dateISO, deparPop: false });
    }
  };

  return (
    <Datepicker
      selected={selectedDate}
      onDateSelected={_handleOnDateSelected}
      showOutsideDays
    />
  );
}

export default Single;
