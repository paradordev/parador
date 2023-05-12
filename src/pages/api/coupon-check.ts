import woocommerceRestApi from "@woocommerce/woocommerce-rest-api";
import axios from "axios";
import { createHash } from "crypto";
import { filter, toNumber, toString } from "lodash";
import { setLocalStorage } from "../../utils/functions";

const WooCommerce = new woocommerceRestApi({
  url: process.env.WOOCOMMERCE_URL ?? "",
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY ?? "",
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET ?? "",
  version: "wc/v3",
});

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    // Process a POST request
    if (req.query.user != "guest") {
      res.status(401).json({ error: "Not Authorized" });
    } else {
      //logic goes here

      const x = await WooCommerce.get("coupons")
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log(error.response.data);
          res.status(403).json({ error: "Forbidden" });
        });

      const y = filter(x, function (o) {
        return o.code == req.body.code;
      });

      if (y.length > 0) {
        await res.status(200).json({
          isUsable: true,
          id: y[0].id,
          amount: y[0].amount,
          discount_type: y[0].discount_type,
          date_expires: y[0].date_expires,
          usage_count: y[0].usage_count,
          individual_use: y[0].individual_use,
          free_shipping: y[0].free_shipping,
          status: y[0].status,
        });
      } else {
        res.status(200).json({ isUsable: false });
      }
      //end of logicsense
    }
  } else {
    res.status(403).json({ error: "Forbidden" });
  }
}
