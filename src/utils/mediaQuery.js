// import { useMediaQuery } from "@chakra-ui/react";
// import { useMediaQuery } from "react-responsive";
import { useState } from "react";
import { useMediaQuery } from "./hooks";

export const safeMarginX = [4, 8, 16, 20, 24, 28];
export const safeMarginY = [5, 22, 50];

export const sliderQuery = [1, 2, 3];

export const cardWidthQuery = ["35vh", "40vh", "45vh", "50vh", "55vh", "65vh"];

export function useLargeQuery() {
  const isLarge = useMediaQuery("(min-width: 768px)");
  const isXLarge = useMediaQuery("(min-width:  992px)");
  const is2XLarge = useMediaQuery("(min-width:  1160px)");
  const is3XLarge = useMediaQuery("(min-width:  1536px)");

  return { isLarge, isXLarge, is2XLarge, is3XLarge };
}

export const safeMarginDesc = [10, 20, 50];
export const safeMarginSectionY = [5, 20, 50];

// chakra UI
// export function useLargeQuery() {
//   const [isLarge] = useMediaQuery("(min-width: 54em)");
//   return { isLarge };
// }
