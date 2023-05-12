import { Center, Spinner } from "@chakra-ui/react";

export default function LoadingSpinner() {
  return (
    <Center h="50vh">
      <Spinner size="xl" />
    </Center>
  );
}
