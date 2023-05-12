import {
  fetcher,
  fetcherNext,
  fetcherWPImage,
  mappingBrand,
} from "./functions";

//wordpress endpoint
export const getHotelDetail = (params) => fetcher.get("/hotels/", { params });

export const getRoomDetail = (params) => fetcher.get("/rooms/", { params });

export const getBlogDetail = (params) => fetcher.get("/blog/", { params });

export const getSitemap = (params) => fetcher.get("/sitemap/", { params });

export const getSpecialOffer = (params) =>
  fetcher.get("/special_offers/", { params });

export const getWPDining = (params) => fetcher.get("/dining/?", { params });

//nextjs endpoint
export const getCountryList = (params) =>
  fetcherNext.get("/country-list/?", { params });

export const getDining = (params) =>
  fetcherNext.get("/dining-nav/?", { params });

export const getSliderSpecialOffer = (params) =>
  fetcherNext.get("/special-offer-slider/?", { params });

export const getHotelNavBrands = (params) =>
  fetcherNext.get("/hotel-nav-brands/?", { params });

export const getHotelBrands = (params) =>
  Promise.all([
    getHotelDetail({
      brand: "Atria Hotel",
      _orderby: "hotel_location",
      _order: "asc",
    }).then((r) => {
      return mappingBrand("Atria Hotel", r.data);
    }),
    getHotelDetail({
      brand: "Atria residences",
      _orderby: "hotel_location",
      _order: "asc",
    }).then((r) => {
      return mappingBrand("Atria residences", r.data);
    }),
    getHotelDetail({
      brand: "Starlet Hotel",
      _orderby: "hotel_location",
      _order: "asc",
    }).then((r) => {
      return mappingBrand("Starlet Hotel", r.data);
    }),
    getHotelDetail({
      brand: "Vega Hotel",
      orderby: "hotel_location",
      _order: "asc",
    }).then((r) => {
      return mappingBrand("Vega Hotel", r.data);
    }),
    getHotelDetail({
      brand: "Fame Hotel",
      orderby: "hotel_location",
      _order: "asc",
    }).then((r) => {
      return mappingBrand("Fame Hotel", r.data);
    }),
    // getHotelDetail({
    //   brand: "HA-KA Hotel",
    //   _orderby: "hotel_location",
    //   _order: "asc",
    // }).then((r) => {
    //   return mappingBrand("HA-KA Hotel", r.data);
    // }),
  ]).then((values) => {
    return values;
  });

export const postMessages = (body) => fetcher.post("/messages/", body);

export const postMeetingEnquiry = (body) =>
  fetcher.post("/meeting_enquiry/", body);

export const postWeddingEnquiry = (body) =>
  fetcher.post("/wedding_enquiry/", body);

export const postAccount = (body) => fetcher.post("/accounts/", body);

export const postOrder = (body) =>
  fetcherNext.post("/order-now?user=guest", body);

export const getSigMatch = (params) =>
  fetcherNext.get("/is-paid/?", { params });

export const getOneOrder = (params) =>
  fetcherNext.get("/check-order/?", { params });

export const postOrderLater = (body) => fetcherNext.post("/order-later", body);

export const postRDPnotify = (body) => fetcherNext.post("/order-rdp", body);

export const postCapthca = (body) => fetcherNext.post("/captcha", body);

export const postCheckCoupon = (body) =>
  fetcherNext.post("/coupon-check?user=guest", body);

export const getWPImage = (id) => fetcherWPImage.get(`/${id}`);

export const postSendMail = (body) =>
  fetcherNext.post("/mail?user=guest", body);
