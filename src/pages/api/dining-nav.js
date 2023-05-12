import { compact } from "lodash";
import { getWPDining } from "../../utils/api";
import { fetcher } from "../../utils/functions";

function mapping(name, data) {
  let temp = { name, list: [], linkTo: [], subList: [] };
  data.map(({ name, _ID, hotel_name }, i) => {
    temp.list[i] = name;
    temp.linkTo[i] = "dining/" + _ID;
    temp.subList[i] = hotel_name;
  });
  return temp;
}

export default async function HotelNavBrands(req, res) {
  const params = {};

  const temp = await Promise.all([
    getWPDining({
      location: "gading serpong",
      _orderby: "name",
      _order: "asc",
      cct_status: "publish",
    }).then((r) => {
      return mapping("tangerang", r.data);
    }),
    ,
    getWPDining({
      location: "magelang",
      _orderby: "name",
      _order: "asc",
      cct_status: "publish",
    }).then((r) => {
      return mapping("magelang", r.data);
    }),
    ,
    // getWPDining({
    //   location: "semarang",
    //   _orderby: "name",
    //   _order: "asc",
    //   cct_status: "publish",
    // }).then((r) => {
    //   return mapping("semarang", r.data);
    // }),
    ,
    getWPDining({
      location: "malang",
      _orderby: "name",
      _order: "asc",
      cct_status: "publish",
    }).then((r) => {
      return mapping("malang", r.data);
    }),
    ,
    getWPDining({
      location: "sunset road",
      _orderby: "name",
      _order: "asc",
      cct_status: "publish",
    }).then((r) => {
      return mapping("bali", r.data);
    }),
    ,
  ]).then((values) => values);

  await res.status(200).json(compact(temp));
}
