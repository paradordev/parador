import { Box, useStyleConfig } from "@chakra-ui/react";

export default function Section(props) {
  const { variant, ...rest } = props;

  const styles = useStyleConfig("Section", { variant });

  // Pass the computed styles into the `__css` prop
  return <Box as="section" __css={styles} {...rest} />;
}
