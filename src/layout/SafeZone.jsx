import { Box, Center } from "@chakra-ui/react";

export default function SafeZone(){
  return (
    <Center position="sticky" top={0} px={100} bg="purple.200" zIndex={9999}>
      <Box zIndex={999} w="100%" maxW={1400} bg="green.500">
        hai
      </Box>
    </Center>
  );
}