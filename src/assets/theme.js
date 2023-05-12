import { extendTheme } from "@chakra-ui/react";
import { LinkTo } from "./theme/LinkTo";
import { Section } from "./theme/Section";

const theme = extendTheme({
  components: {
    Section,
    LinkTo,
    Heading: {
      baseStyle: {
        textTransform: "uppercase",
      },
    },
    Select: {
      baseStyle: {
        fontWeight: 400,
        textTransform: "uppercase",
        letterSpacing: "widest",
        borderRadius: 0,
      },
    },
    Button: {
      baseStyle: {
        fontWeight: 400,
        textTransform: "uppercase",
        letterSpacing: "widest",
        borderRadius: 0,
      },
      // Two sizes: sm and md
      sizes: {
        sm: {
          fontSize: "xs",
          px: 5, // <-- px is short for paddingLeft and paddingRight
          py: 3, // <-- py is short for paddingTop and paddingBottom
        },
        md: {
          fontSize: "md",
          px: 6, // <-- these values are tokens from the design system
          py: 4, // <-- these values are tokens from the design system
        },
        xl: {},
      },
      // Two variants: outline and solid
      variants: {
        light: {
          border: 0,
          bg: "white",
          color: "black",
        },
        dark: {
          bg: "black",
          color: "white",
          border: "1px solid black",
          _hover: {
            border: "1px solid black",
            color: "black",
            bg: "white",
          },
        },
        outlineWhite: {
          border: "1px solid black",
          bg: "white",
          color: "black",
        },
        outlineBlack: {
          border: "1px solid white",
          bg: "black",
          color: "white",
        },
      },
      // The default size and variant values
      defaultProps: {
        size: "sm",
        variant: "light",
      },
    },
  },
  fonts: {
    heading: "Montserrat, sans-serif",
    body: "Montserrat, sans-serif",
  },
  letterSpacings: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
    widestx: "0.35em",
  },
  fontSizes: {},
  textStyles: {
    h1: {
      // you can also use responsive styles
      fontSize: { base: "20px", lg: "40px" },
      fontWeight: 300,
      lineHeight: "110%",
      letterSpacing: "5%",
    },
    h2: {
      fontSize: ["36px", "48px"],
      fontWeight: 400,
      lineHeight: "110%",
      letterSpacing: "1%",
    },
  },
});

export default theme;
