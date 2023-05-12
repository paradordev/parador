import woocommerceRestApi from "@woocommerce/woocommerce-rest-api";
import axios from "axios";
import { createHash } from "crypto";
import { getRDP } from "../../utils/functions";
const WooCommerce = new woocommerceRestApi({
  url: process.env.WOOCOMMERCE_URL ?? "",
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY ?? "",
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET ?? "",
  version: "wc/v3",
});

const fetcher = axios.create({
  baseURL: process.env.REDDOT_REDIRECTION_URL,
  timeout: 15000,
});

const postRedirectionRDP = (body: any) => fetcher.post("", body);

export default function handler(req: any, res: any) {
  const selectedHotel = getRDP(req.query.slug);
  const signature = createHash("sha512")
    .update(`${selectedHotel[0]}${req.query.id}${selectedHotel[1]}`)
    .digest("hex");

  const redirectReq = {
    request_mid: selectedHotel[0],
    transaction_id: req.query.id,
    signature: signature,
  };
  postRedirectionRDP(redirectReq)
    .then((r) => {
      console.log({
        req: {
          request_mid: selectedHotel[0],
          transaction_id: req.query.id,
          signature: signature,
        },
        res: r.data,
      });
      return res.status(200).json(r.data);
    })
    .catch((e) => {
      return res.status(400).json(e);
    });
}
