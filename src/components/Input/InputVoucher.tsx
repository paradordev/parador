import { Box, Button, Flex, Input, Tooltip } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { IoChevronForwardOutline } from "react-icons/io5";
import { postCheckCoupon } from "../../utils/api";

export default function InputVoucher({
  isValid,
  codePromo,
}: {
  isValid: any;
  codePromo: any;
}) {
  const { locale } = useRouter();

  const [couponValue, setCouponValue] = useState("");

  function handleCheckCoupon(coupon: any) {
    codePromo(coupon);
    postCheckCoupon({ code: coupon }).then((res) => {
      isValid(res.data);
    });
  }

  return (
    <Flex w="full">
      <Tooltip
        label={
          locale == "id"
            ? "Tekan Enter setelah mengetik Kupon"
            : "Press Enter after type the Coupon"
        }
        aria-label="A tooltip"
      >
        <Input
          type="text"
          py={6}
          placeholder={
            locale == "id" ? "MASUKKAN KODE PROMO" : "INSERT PROMO CODE"
          }
          color="black"
          borderRadius={0}
          textAlign="center"
          textTransform="lowercase"
          _placeholder={{ textTransform: "uppercase" }}
          onChange={(e) => {
            setCouponValue(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              handleCheckCoupon(e.currentTarget.value);
            }
          }}
        />
      </Tooltip>
      <Button
        variant="solid"
        h="100%"
        bg="black"
        color="white"
        onClick={() => handleCheckCoupon(couponValue)}
      >
        <IoChevronForwardOutline size={26} />
      </Button>
    </Flex>
  );
}
