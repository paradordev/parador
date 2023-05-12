import {
  AbsoluteCenter,
  Box,
  Divider,
  Flex,
  Text,
  useOutsideClick,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, ReactNode, useRef, useState } from "react";
import ENFlag from "../../assets/svg/en.svg";
import IDFlag from "../../assets/svg/id.svg";

export default function InputSelect({
  icon,
  placeHolder,
  items,
}: {
  icon: ReactNode | null;
  placeHolder: string;
  items: Array<any>;
}) {
  const { pathname, asPath, query, push, locale } = useRouter();

  const modalRef = useRef<any>(null);

  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);

  useOutsideClick({
    ref: modalRef,
    handler: () => setIsOptionsOpen(false),
  });

  return (
    <Box ref={modalRef}>
      <Flex
        alignItems="center"
        gap={1}
        justifyContent="space-evenly"
        onClick={() => {
          setIsOptionsOpen(!isOptionsOpen);
        }}
        cursor="pointer"
      >
        {icon}
        <Box w="100%">
          <Text>{placeHolder}</Text>
        </Box>

        {/* {!isString(items) && <IoChevronDown />} */}
      </Flex>
      {isOptionsOpen && (
        <Box
          zIndex={1}
          position="absolute"
          top={14}
          right={10}
          bg="white"
          color="blackAlpha.800"
          fontSize="md"
          minW={220}
          px={6}
          py={4}
          borderBottomRadius="10px"
          display="flex"
          flexDir="column"
          gap={2}
          className="header-box-shadows"
        >
          <AbsoluteCenter
            top={-1.5}
            style={{
              width: 0,
              height: 0,
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderBottom: "12px solid white",
            }}
          />
          {items.length > 0 &&
            items.map((item: any, i: any) => (
              <Fragment key={item.value}>
                <Flex align="center" gap={1}>
                  <Box position="relative" h={4} w={6}>
                    <Image
                      src={item.value == "id" ? IDFlag : ENFlag}
                      alt=""
                      layout="fill"
                      objectFit="contain"
                    />
                  </Box>
                  <Text
                    onClick={() => {
                      push({ pathname, query }, asPath, { locale: item.value });
                      setIsOptionsOpen(false);
                    }}
                    cursor="pointer"
                    _hover={{
                      color: "black",
                    }}
                  >
                    {item.name}
                  </Text>
                </Flex>
                {i != items.length - 1 && (
                  <Flex>
                    <Divider orientation="horizontal" />
                  </Flex>
                )}
              </Fragment>
            ))}
        </Box>
      )}
    </Box>
  );
}
