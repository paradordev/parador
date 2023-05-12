import { Box, Link, useStyleConfig } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";

export default function LinkTo(props) {
  const router = useRouter();

  const {
    variant,
    to = "#",
    active = false,
    activeColor = "white",
    children,
    disabled = false,
    ...rest
  } = props;
  const styles = useStyleConfig("LinkTo", { variant });

  // Pass the computed styles into the `__css` prop

  // const {  } = props;

  return (
    <NextLink href={to} passHref>
      <Link
        _disabled={disabled}
        __css={styles}
        {...rest}
        position="relative"
        _after={
          active
            ? {
                background: "none repeat scroll 0 0 transparent",
                bottom: -1,
                left: 0,
                content: `""`,
                display: "block",
                height: "1px",
                position: "absolute",
                background: activeColor,
                transition: "all 0.3s ease 0s, left 0.3s ease 0s",
                width: "100%",
              }
            : {
                background: "none repeat scroll 0 0 transparent",
                bottom: -1,
                content: `""`,
                display: "block",
                height: "1px",
                left: "50%",
                position: "absolute",
                background: activeColor,
                transition: "all 0.3s ease 0s, left 0.3s ease 0s",
                width: 0,
              }
        }
        _focus={{}}
        _hover={
          !active && {
            _after: { width: "100%", left: 0 },
          }
        }
      >
        {children}
      </Link>
    </NextLink>
  );
}
