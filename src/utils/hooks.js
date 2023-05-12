import { createContext } from "react";
import useSWR from "swr";
import env from "./env";
import { fetcherGraphQL, fetcherSWR, objectToParams } from "./functions";

export const BookNowContext = createContext({});

export const ThemeContext = createContext(null);

export const NavContext = createContext(null);

export const usePopUpBackground = (params) => {
  const { data, error } = useSWR(
    `${env.apiUrl}/hotels/?${objectToParams(params)}`,
    fetcherSWR
  );

  let temp;
  if (data && data.length > 0 && data[0].hotel_sliders) {
    temp = data[0].hotel_sliders[0].url;
  } else {
    temp = ``;
  }

  return {
    popUpBackground: temp,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useHeaderImage = (params, addParams) => {
  const { data, error } = useSWR(
    `${env.apiUrl}/hotels/?${objectToParams(params)}`,
    fetcherSWR
  );
  let images = [];
  if (!error && data) {
    if (addParams == "dining") {
      images = data[0].dining_sliders;
    } else {
      images = data[0].sliders;
    }
  }
  return {
    images: images,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useHeaderImage2 = (params) => {
  const { data, error } = useSWR(
    `${env.apiUrl}/home_sliders/?${objectToParams(params)}`,
    fetcherSWR
  );
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useSpecialOffer = (params) => {
  const { data, error } = useSWR(
    `${env.apiUrl}/special_offers/?${objectToParams(params)}`,
    fetcherSWR
  );
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useSliderSpecialOffer = (params) => {
  const { data, error } = useSWR(
    `${env.nextUrl}/special-offer-slider/?${objectToParams(params)}`,
    fetcherSWR
  );
  return {
    slider: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useDining = (params) => {
  const { data, error } = useSWR(
    `${env.apiUrl}/dining/?${objectToParams(params)}`,
    fetcherSWR
  );
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useNextDining = (params) => {
  const { data, error } = useSWR(
    `${env.nextUrl}/dining-nav/?${objectToParams(params)}`,
    fetcherSWR
  );
  return {
    listDining: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useFetchSWR = (path, params) => {
  const { data, error } = useSWR(
    `${env.apiUrl}/${path}/?${objectToParams(params)}`,
    fetcherSWR
  );
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useFetchNextSWR = (path, params) => {
  const { data, error } = useSWR(
    `${env.nextUrl}/${path}/?${objectToParams(params)}`,
    fetcherSWR
  );

  let isLoading = !error && !data;
  let isError = error;

  return [data, isLoading, isError];
};

export const useFetchSWRv2 = (path, params) => {
  const { data, error } = useSWR(
    `${env.apiUrl}/${path}/?${objectToParams(params)}`,
    fetcherSWR
  );

  let isLoading = !error && !data;
  let isError = error;

  return [data, isLoading, isError];
};

export const useFetchWPImageSWR = (path, params) => {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_URL_WP_MEDIA}/${path}/?${objectToParams(
      params
    )}`,
    fetcherSWR
  );

  let isLoading = !error && !data;
  let isError = error;

  return [data, isLoading, isError];
};


import { useEffect, useState } from "react";

export function useMediaQuery(query) {
  const getMatches = (query) => {
    // Prevents SSR issues
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return true;
  };

  const [matches, setMatches] = useState(getMatches(query));

  function handleChange() {
    setMatches(getMatches(query));
  }

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Listen matchMedia
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener("change", handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener("change", handleChange);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return matches;
}

export function useGetListHotel(params) {
  const { data, error } = useSWR(
    `${env.nextUrl}/hotel-list/?${objectToParams(params)}`,
    fetcherSWR
  );
  return {
    hotels: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export const useSWRGraphQL = (query) => {
  const { data, error } = useSWR(query, fetcherGraphQL);

  let isLoading = !error && !data;
  let isError = error;

  return [data, isLoading, isError];
};

export function useOutsideAlerter(ref, handle) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      handle;
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}
