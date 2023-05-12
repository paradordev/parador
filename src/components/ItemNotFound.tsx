import { Center, Spinner, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function ItemNotFound() {
  const { locale } = useRouter();
  return (
    <Center h="50vh">
      <Text>{locale == "id" ? `Tidak Ditemukan.` : `Not Found.`}</Text>
    </Center>
  );
}
