import { compact, min } from "lodash";
import { getSpecialOffer } from "../../utils/api";

// query =
// hotel
// limit
// is_group

export default async function handler(req, res) {
  const q = req.query;
  let result = [];

  if (q.hotel) {
    const data = await getSpecialOffer();
    let temp = data.data;

    if (q.is_group) {
      if (q.is_group == "false") {
        result = await temp
          .filter(function ({ hotel_names }) {
            if (hotel_names.includes("parador")) {
              return false; // skip
            }
            return true;
          })
          .map((item) => {
            return item;
          });
      } else {
        result = await temp.filter((item) => {
          return item.hotel_names.includes(q.hotel);
        });
      }
    } else {
      result = await temp.filter((item) => {
        return item.hotel_names.includes(q.hotel);
      });
    }

    let finalResult = [];

    if (q.limit && !(q.limit === "null")) {
      for (let i = 0; i < min([q.limit, result.length]); i++) {
        finalResult[i] = await result[i];
      }
    } else {
      finalResult = [...result];
    }

    await res.status(200).json(await compact(finalResult));
  } else {
    await res.status(405).json("error");
  }
}
