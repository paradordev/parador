import {
  Box,
  AbsoluteCenter,
  Text,
  Flex,
  AspectRatio,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  useClipboard,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaFacebook, FaFacebookF, FaLink, FaWhatsapp } from "react-icons/fa";

export default function SharePopup({ color = "black" }: { color?: string }) {
  const { locale } = useRouter();

  const { hasCopied, onCopy } = useClipboard(window.location.href);

  const whatsAppURL = `https://wa.me?text=${encodeURIComponent(
    window.location.href
  )}`;

  const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;

  return (
    <Box
      zIndex={1}
      position="absolute"
      // top={`160px`}
      top={10}
      left={2}
      bg="white"
      color="blackAlpha.700"
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
        left={10}
        style={{
          width: 0,
          height: 0,
          borderLeft: "12px solid transparent",
          borderRight: "12px solid transparent",
          borderBottom: "12px solid white",
        }}
      />
      <Box fontSize="sm" color="blackAlpha.600">
        <Text as="span">{locale == "id" ? "Bagikan ke:" : "Share to:"}</Text>
        <Flex gap={3} mt={2} mb={6}>
          <Box
            bg="facebook.500"
            h={12}
            w={12}
            p={3}
            cursor="pointer"
            onClick={() => {
              window.open(facebookURL, `_blank`);
            }}
          >
            <FaFacebookF size="100%" color="white" />
          </Box>
          <Box
            bg="whatsapp.500"
            h={12}
            w={12}
            p={2}
            cursor="pointer"
            onClick={() => {
              window.open(whatsAppURL, `_blank`);
            }}
          >
            <FaWhatsapp size="100%" color="white" />
          </Box>
        </Flex>
        <Text as="span">
          {locale == "id" ? "Atau salin alamat" : "Or copy link:"}
        </Text>
        <Flex align="center" mt={2} mb={4}>
          <InputGroup m={0} maxW={52}>
            <InputLeftElement pointerEvents="none">
              <FaLink size={14} />
            </InputLeftElement>
            <Input
              placeholder={window.location.href}
              isReadOnly
              _focus={{}}
              borderRadius={0}
            />
          </InputGroup>
          <Button
            variant="solid"
            bg={color}
            color="white"
            w={24}
            h="full"
            _hover={{
              bg: "transparent",
              color: color,
            }}
            onClick={onCopy}
          >
            {hasCopied
              ? locale == "id"
                ? "Disalin"
                : "Copied"
              : locale == "id"
              ? "Salin"
              : "Copy"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
