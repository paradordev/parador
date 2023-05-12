import {
  AbsoluteCenter, Box
} from "@chakra-ui/react";
import Image from "next/image";

export default function ImagePop({ src, alt }: any) {
  return (
    <Box
      position="fixed"
      top={0}
      zIndex={5}
      bg="blackAlpha.600"
      h="100vh"
      w="100vw"
    >
      <AbsoluteCenter
        w={`100%`}
        h={["60vh", null, "70vh"]}
        bg="black"
        px={20}
        borderColor="white"
        borderRadius={0}
        borderWidth={10}
        zIndex={6}
      >
        <Image src={src} alt={alt} objectFit="contain" layout="fill" />
      </AbsoluteCenter>
    </Box>
  );
}
