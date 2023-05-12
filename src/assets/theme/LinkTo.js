export const LinkTo = {
  // The styles all  have in common
  baseStyle: {},

  variants: {
    white: { color: "white" },
    black: { color: "black" },
    customColor: (props) => ({ color: props.color }),
  },

  defaultProps: {
    // variant: "white",
  },
};
