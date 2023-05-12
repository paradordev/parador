import { getHotelDetail } from "../../utils/api";
import { isEmptyObject } from "../../utils/functions";

export default async function handler(req, res) {
  const q = req.query;
  let s;

  //if params empty
  if (isEmptyObject(q)) {
    s = { res: "kosong" };
  } else if (q.list == "true") {
    s = { res: "sup" };
    //get all hotel data
  } else if (q.all == "true") {
    s = await getHotelDetail().then((r) => r.data);

    //nothing
  } else {
    s = { res: "why?" };
  }

  await res.status(200).json(s);
}
