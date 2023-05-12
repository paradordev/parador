import { Box, Center, Text, useOutsideClick } from "@chakra-ui/react";
import { isEmpty } from "lodash";
import { useRef } from "react";
import { IoClose } from "react-icons/io5";
import { convertImgHttps } from "../utils/functions";
import { useLargeQuery } from "../utils/mediaQuery";

export default function FlipBook({
  link,
  isModalOpen,
}: {
  link: string;
  isModalOpen: any;
}) {
  const { isLarge } = useLargeQuery();

  const modalRef = useRef(null);

  useOutsideClick({
    ref: modalRef,
    handler: () => isModalOpen(false),
  });

  return (
    <Box
      position="fixed"
      w="100vw"
      h="100vh"
      bg="blackAlpha.700"
      zIndex={999}
      top={0}
    >
      <Center w="100%" h="100%" position="relative">
        {isEmpty(link) ? (
          <Text color="white">Not Found.</Text>
        ) : (
          <>
            <Box
              position="absolute"
              top={isLarge ? "5%" : "60px"}
              right={isLarge ? "12%" : "10px"}
              cursor="pointer"
              onClick={() => isModalOpen(false)}
            >
              <IoClose size={24} color="white" />
            </Box>
            <iframe
              ref={modalRef}
              src={`https://flowpaper.com/flipbook/${convertImgHttps(link)}`}
              width={isLarge ? "70%" : "100%"}
              height={isLarge ? "90%" : "75%"}
              style={{ border: "none" }}
              allowFullScreen
            ></iframe>
          </>
        )}
      </Center>
    </Box>
  );
}
