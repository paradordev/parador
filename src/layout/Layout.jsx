import { Box } from "@chakra-ui/react";
import Header from "./HeaderTrash";

export default function Layout({ children }) {
  return (
    <Box bg="pink.300" position="relative">
      <Header />
      <main>{children}</main>
    </Box>
  );
}
