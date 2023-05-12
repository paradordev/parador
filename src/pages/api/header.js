import { getHotelDetail } from "../../utils/api";
import { isEmptyObject } from "../../utils/functions";

export default async function handler(req, res) {
  const s = await getHotelDetail({ slug: "parador" }).then((r) => r.data);

  await res.status(200).json(s[0]);
}
