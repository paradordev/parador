import { safeMarginX, safeMarginY } from "../../utils/mediaQuery";

export const Section = {
  // The styles all  have in common
  baseStyle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
    maxWidth: "100vw",
    gap: 6,
  },

  variants: {
    smooth: {
      padding: safeMarginX,
      paddingTop: safeMarginY,
      paddingBottom: safeMarginY,
    },
    flat: {
      paddingLeft: safeMarginX,
      paddingRight: safeMarginX,
      paddingTop: ["20px", "50px"],
      paddingBottom: ["20px", "50px"],
    },
    zero: {
      padding: 0,
    },
  },

  defaultProps: {
    variant: "smooth",
  },
};
