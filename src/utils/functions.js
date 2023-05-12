import axios from "axios";
import request from "graphql-request";
import { isEmpty, toString } from "lodash";
import { monthEn } from "./const";
import env from "./env";

export const isDev = () => {
  const environmentMode = process.env.NODE_ENV;
  if (environmentMode === "development") return true;
  return false;
};

export function capEachWord(text) {
  return text.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
}

// export const fetcherSWR = (url) => fetch(url).then((res) => res.json());

export function isEmptyObject(obj) {
  return isEmpty(obj);
}

export const fetcherSWR = (url) =>
  axios
    .get(url, {
      headers: {
        Authorization:
          // "Basic " + base64.encode("developer" + ":" + env.apiAuth),
          env.apiAuth,
      },
    })
    .then((res) => res.data);

export const fetcherGraphQL = (query) => request(env.gqlUrl, query);

export const fetcher = axios.create({
  baseURL: env.apiUrl,
  timeout: 15000,
  headers: {
    Authorization: env.apiAuth,
  },
});

export const fetcherNext = axios.create({
  baseURL: env.nextUrl,
  timeout: 15000,
});

export const fetcherWPImage = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_WP_MEDIA,
  timeout: 15000,
});

export const objectToParams = (obj) => new URLSearchParams(obj).toString();

export const formatRupiah = (num, prefix = "Rp") => {
  const hasNumber = /\d/;

  if (!hasNumber.test(toString(num))) return `[price]`;

  let reverse = num.toString().split("").reverse().join(""),
    ribuan = reverse.match(/\d{1,3}/g);
  ribuan = ribuan.join(".").split("").reverse().join("");
  return prefix + ribuan;
};

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

export function convertImgHttps(url) {
  if (!url) return;
  return url.replace("http://", "https://");
}

export function mappingBrand(name, data) {
  let temp = { name: name, list: [], linkTo: [] };
  data.map(({ hotel_location, slug }, i) => {
    temp.list[i] = hotel_location;
    temp.linkTo[i] = slug;
  });
  return temp;
}

export function timeConvertion({ UNIX_timestamp, months }) {
  let a = new Date(UNIX_timestamp * 1000);
  let monthsx = [...months];
  let year = a.getFullYear();
  let month = months[a.getMonth()];
  let date = a.getDate();
  let hour = a.getHours();
  let min = a.getMinutes();
  let sec = a.getSeconds();
  let time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return { date, month, year, hour, min, sec };
}

export function getAvailDate(dates) {
  if (dates.length > 1) {
    if (dates[0].year === dates[1].year)
      return `  ${dates[0].month} ${dates[0].date} - ${dates[1].month} ${dates[1].date}, ${dates[0].year}`;

    return `${dates[0].month} ${dates[0].date} ${dates[0].year} - ${dates[1].month} ${dates[1].date} ${dates[1].year}`;
  }
  return `Until ${dates[0].month} ${dates[0].date} ${dates[0].year}`;
}

export function getFormDate(dates) {
  if (dates.length > 1) {
    if (dates[0].year === dates[1].year)
      return `  ${dates[0].month} ${dates[0].date} - ${dates[1].month} ${dates[1].date}, ${dates[0].year}`;

    return `${dates[0].month} ${dates[0].date} ${dates[0].year} - ${dates[1].month} ${dates[1].date} ${dates[1].year}`;
  }
  return `Until ${dates[0].month} ${dates[0].date} ${dates[0].year}`;
}

export function getFormattedDate() {
  let a = new Date(Math.floor(new Date().getTime() / 1000) * 1000);
  let months = [...monthEn];
  let year = a.getFullYear();
  let month = months[a.getMonth()];
  let date = a.getDate();
  let hour = a.getHours();
  let min = a.getMinutes();
  let sec = a.getSeconds();
  let time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return month + " " + date + ", " + year;
}

export function objParserWP(obj, type) {
  const temp = Object.values(obj);
  let temp2 = [];

  if (type) {
    temp.map((v, i) => {
      temp2[i] = Object.values(v)[0];
    });
    return temp2;
  }

  return temp;
}

export function objParserWPLv2(obj, type) {
  const temp = Object.values(obj);
  let temp2 = [];

  if (type) {
    temp.map((v, i) => {
      temp2[i] = Object.values(v)[1];
    });
    return temp2;
  }

  return temp;
}

export function objParserWPLv3(obj, type) {
  const temp = Object.values(obj);
  let temp2 = [];

  if (type) {
    temp.map((v, i) => {
      temp2[i] = Object.values(v)[2];
    });
    return temp2;
  }

  return temp;
}

export function objParserWPLv4(obj, type) {
  const temp = Object.values(obj);
  let temp2 = [];

  if (type) {
    temp.map((v, i) => {
      temp2[i] = Object.values(v)[3];
    });
    return temp2;
  }

  return temp;
}

export function strParser(str) {
  return JSON.parse(str.replace(/\\/g, ""));
}

export function setLocalStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // catch possible errors:
    // https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
  }
}

export function getLocalStorage(key, initialValue) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : initialValue;
  } catch (e) {
    // if error, return initial value
    return initialValue;
  }
}

export function deleteLocalStorage(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (e) {}
}

export function letEncrypt(str) {
  return CryptoJS.TripleDES.encrypt(str, "process.env.CUSTOM_SECRET_KEY");
}

export function letDecrypt(str) {
  return CryptoJS.TripleDES.decrypt(str, "process.env.CUSTOM_SECRET_KEY");
}

export function getRDP(str) {
  if (str === "parador") {
    return [process.env.MID, process.env.REDDOT_SECRET_KEY];
  } else if (str === "atria-hotel-gading-serpong") {
    return [process.env.MID_AHGS, process.env.SECRET_KEY_AHGS];
  } else if (str === "atria-hotel-magelang") {
    return [process.env.MID_AHMG, process.env.SECRET_KEY_AHMG];
  } else if (str === "atria-hotel-malang") {
    return [process.env.MID_AHML, process.env.SECRET_KEY_AHML];
  } else if (str === "atria-residences-gading-serpong") {
    return [process.env.MID_ARGS, process.env.SECRET_KEY_ARGS];
  } else if (str === "fame-hotel-gading-serpong") {
    return [process.env.MID_FHGS, process.env.SECRET_KEY_FHGS];
  } else if (str === "fame-hotel-sunset-road") {
    return [process.env.MID_FHSR, process.env.SECRET_KEY_FHSR];
  } else if (str === "starlet-hotel-bsd-city") {
    return [process.env.MID_SHBSD, process.env.SECRET_KEY_SHBSD];
  } else if (str === "starlet-hotel-jakarta-airport") {
    return [process.env.MID_SHJ, process.env.SECRET_KEY_SHJ];
  } else if (str === "starlet-hotel-serpong") {
    return [process.env.MID_SHS, process.env.SECRET_KEY_SHS];
  } else if (str === "vega-hotel-gading-serpong") {
    return [process.env.MID_VHGS, process.env.SECRET_KEY_VHGS];
  } else if (str === "haka-hotel-semarang") {
    return [process.env.MID_HHS, process.env.SECRET_KEY_HHS];
  } else {
    return ["", ""];
  }
}

export function increaseDate(date_str) {
  var parts = date_str.split("-");
  var dt = new Date(
    parseInt(parts[0], 10), // year
    parseInt(parts[1], 10) - 1, // month (starts with 0)
    parseInt(parts[2], 10) // date
  );
  dt.setDate(dt.getDate() + 1);
  parts[0] = "" + dt.getFullYear();
  parts[1] = "" + (dt.getMonth() + 1);
  if (parts[1].length < 2) {
    parts[1] = "0" + parts[1];
  }
  parts[2] = "" + dt.getDate();
  if (parts[2].length < 2) {
    parts[2] = "0" + parts[2];
  }
  return parts.join("-");
}