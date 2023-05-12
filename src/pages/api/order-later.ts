import woocommerceRestApi from "@woocommerce/woocommerce-rest-api";
import axios from "axios";
import { createHash } from "crypto";
import { toNumber, toString } from "lodash";
import { setLocalStorage } from "../../utils/functions";

const WooCommerce = new woocommerceRestApi({
  url: process.env.WOOCOMMERCE_URL ?? "",
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY ?? "",
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET ?? "",
  version: "wc/v3",
});

const fetcher = axios.create({
  baseURL: process.env.REDDOT_URL,
  timeout: 15000,
});

const postPayment = (body: any) => fetcher.post("", body);

export default function handler(req: any, res: any) {
  if (req.method === "POST") {
    const data = {
      set_paid: true,
    };

    WooCommerce.put(`orders/${req.body.id}`, data)
      .then((response) => {
        res.status(200).json({ msg: "yey" });
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  } else {
    res.status(403).json({ error: "Forbidden" });
  }
}
