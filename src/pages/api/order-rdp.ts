import woocommerceRestApi from "@woocommerce/woocommerce-rest-api";
import axios from "axios";
const WooCommerce = new woocommerceRestApi({
  url: process.env.WOOCOMMERCE_URL ?? "",
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY ?? "",
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET ?? "",
  version: "wc/v3",
});

export default function handler(req: any, res: any) {
  if (req.method === "POST") {
    if (req.body.response_code === 0) {
      const data = {
        set_paid: true,
        status: "processing",
      };

      WooCommerce.put(`orders/${req.body.order_id}`, data)
        .then((response) => {
          console.log(response);
          res.status(200).json({ msg: "success" });
        })
        .catch((error) => {
          console.log(error.response.data);
          res.status(200).json({ error: "error" });
        });
    } else {
      res.status(200).json({ msg: "unpaid/error" });
    }
  } else {
    res.status(403).json({ error: "Forbidden" });
  }
}
