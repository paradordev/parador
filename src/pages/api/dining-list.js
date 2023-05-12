import { getHashes, createHash } from "crypto";
import { capitalize, lowerCase, orderBy, startCase, toLower } from "lodash";
import { getDining, getHotelDetail } from "../../utils/api";
import { isEmptyObject } from "../../utils/functions";

export default async function handler(req, res) {
  const q = req.query;
  const s = await getDining({
    cct_status: "publish",
  }).then((r) => r.data);
  const data = await s
    .filter(function ({ brand, is_parador }) {
      if (brand === "Parador" || is_parador == "true") {
        return false; // skip
      }
      return true;
    })
    .map(function ({
      brand,
      hotel_code,
      hotel_location,
      thumbnail,
      logo_light,
      slug,
      start_from,
      phone,
      email,
    }) {
      return {
        name: `${brand} ${hotel_location}`,
        brand,
        hotel_code,
        hotel_location,
        thumbnail,
        logo_light,
        slug,
        start_from,
        phone,
        email,
      };
    });

  const orderedData = orderBy(data, "name");
  let filteredData;

  if (q.location) {
    if (q.location == "tangerang") {
      filteredData = await orderedData.filter(function ({ hotel_location }) {
        const loc = lowerCase(hotel_location);
        return loc == "serpong" || loc == "gading serpong" || loc == "bsd city";
      });
    } else if (q.location == "bali") {
      filteredData = await orderedData.filter(function ({ hotel_location }) {
        const loc = lowerCase(hotel_location);
        return loc == "sunset road";
      });
    } else if (q.location == "jakarta") {
      filteredData = await orderedData.filter(function ({ hotel_location }) {
        const loc = lowerCase(hotel_location);
        return loc == "jakarta airport";
      });
    } else if (q.location == "magelang") {
      filteredData = await orderedData.filter(function ({ hotel_location }) {
        const loc = lowerCase(hotel_location);
        return loc == "magelang";
      });
    } else if (q.location == "malang") {
      filteredData = await orderedData.filter(function ({ hotel_location }) {
        const loc = lowerCase(hotel_location);
        return loc == "malang";
      });
    }
  } else {
    filteredData = orderedData;
  }

  await res.status(200).json(s);
}
