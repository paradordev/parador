import { getHotelDetail } from "../../utils/api";
import { isEmptyObject } from "../../utils/functions";

function mappingBrand(name, data) {
  let temp = { name: name, list: [], linkTo: [] };
  data.map(({ hotel_location, slug }, i) => {
    temp.list[i] = hotel_location;
    temp.linkTo[i] = slug;
  });
  return temp;
}

export default async function HotelNavBrands(req, res) {
  const a = await Promise.all([
    getHotelDetail({
      name: "Atria Hotel",
      _orderby: "hotel_location",
      _order: "asc",
    }).then((r) => {
      return mappingBrand("Atria Hotel", r.data);
    }),
    getHotelDetail({
      name: "Atria residences",
      orderby: "name",
      order: "asc",
    }).then((r) => {
      return mappingBrand("Atria residences", r.data);
    }),
    getHotelDetail({
      name: "Starlet Hotel",
      orderby: "name",
      order: "asc",
    }).then((r) => {
      return mappingBrand("Starlet Hotel", r.data);
    }),
    getHotelDetail({ name: "Vega Hotel", orderby: "name", order: "asc" }).then(
      (r) => {
        return mappingBrand("Vega Hotel", r.data);
      }
    ),
    getHotelDetail({ name: "Fame Hotel", orderby: "name", order: "asc" }).then(
      (r) => {
        return mappingBrand("Fame Hotel", r.data);
      }
    ),
    // getHotelDetail({ name: "HA-KA Hotel", orderby: "name", order: "asc" }).then(
    //   (r) => {
    //     return mappingBrand("HA-KA Hotel", r.data);
    //   }
    // ),
  ]).then((values) => {
    return values;
  });

  let x = a.map((aa) => {});

  await res.status(200).json(a);
}
