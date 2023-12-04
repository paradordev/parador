import woocommerceRestApi from "@woocommerce/woocommerce-rest-api";
import axios from "axios";
import { createHash } from "crypto";
import { isEmpty, toNumber, toString } from "lodash";
import { getRDP } from "../../utils/functions";

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
    if (req.query.user != "guest") {
      res.status(401).json({ error: "Not Authorized" });
    } else {
      const params = req.body;
      const name = params.name.split(" ");
      const selectedHotel = getRDP(params.slug);

      const shipping = {
        first_name: name[0],
        last_name: name[1] ?? "",
        address_1: params.street,
        address_2: "",
        city: params.city,
        // state: "CA",
        postcode: params.zip,
        country: params.country,
        email: params.email,
        phone: params.phone,
      };

      const dataOrder = params.total
        ? {
            payment_method: params.payment ?? "reddot",
            set_paid: false,
            status: params.payment == "cod" ? "processing" : "pending",
            billing: shipping,
            shipping,
            line_items: params.items,
            total: toString(params.total),
            coupon_lines: params.coupon
              ? [
                  {
                    code: params.coupon,
                  },
                ]
              : [],
          }
        : {
            payment_method: params.payment ?? "reddot",
            set_paid: false,
            status: params.payment == "cod" ? "processing" : "pending",
            billing: shipping,
            shipping,
            line_items: params.items,
            coupon_lines: params.coupon
              ? [
                  {
                    code: params.coupon,
                  },
                ]
              : [],
          };
      let dataPayment: any = {};
      let resRdp: any = {};

      WooCommerce.post("orders", dataOrder)
        .then(async (response) => {
          const { id, total, order_key } = response.data;
          const env = process.env.NODE_ENV;
          const msg = isEmpty(params.message)
            ? ``
            : JSON.stringify(params?.message);

          const note = {
            note: msg,
          };

          msg &&
            (await WooCommerce.post(`orders/${id}/notes`, note)
              .then((response) => {})
              .catch((error) => {
                console.log(error.response.data);
              }));

          if (params.payment == "cod") {
            res.status(200).json({ message: "success" });
          } else {
            const signature = createHash("sha512")
              .update(`${selectedHotel[0]}${id}S${total}IDR${selectedHotel[1]}`)
              .digest("hex");

            let redirectUrl = `shop/cart/checkout`;

            if (params.type == "card") {
              redirectUrl = `gift-card`;
            } else if (params.type) {
              redirectUrl = params.type;
            } else {
              redirectUrl = `shop/cart/checkout`;
            }

            let lcs: any;
            const dataPaymentReal = {
              mid: selectedHotel[0],
              api_mode: "redirection_hosted",
              payment_type: "S",
              order_id: toString(id),
              ccy: "IDR",
              amount: toNumber(total),
              back_url:
                env == "production"
                  ? `${process.env.NEXT_PUBLIC_URL_PROD}${redirectUrl}`
                  : `${process.env.NEXT_PUBLIC_URL_DEV}${redirectUrl}`,
              redirect_url:
                env == "production"
                  ? `${process.env.NEXT_PUBLIC_URL_PROD}${redirectUrl}?proccess=success&id=${id}&sig=${signature}&`
                  : `${process.env.NEXT_PUBLIC_URL_DEV}${redirectUrl}?proccess=success&id=${id}&sig=${signature}&`,
              notify_url:
                env == "production"
                  ? `${process.env.NEXT_PUBLIC_URL_PROD}api/order-rdp`
                  : `${process.env.NEXT_PUBLIC_URL_DEV}api/order-rdp`,
              signature,
            };

            const red = await postPayment(dataPaymentReal).then((r) => {
              const temp = r.data;
              lcs = r.data;
              dataPayment = dataPaymentReal;
              resRdp = temp;

              return temp.payment_url;
            });

            res.status(200).json({
              data_payment: dataPayment,
              response_payment: resRdp,
              data_order: dataOrder,
              redirect_url: red,
            });
          }
        })

        .catch((error) => {
          res.status(400).json({
            data_payment: dataPayment,
            response_payment: resRdp,
            data_order: dataOrder,
            error: "Bad Request",
            err: error,
          });
        });
    }
  } else {
    res.status(403).json({ error: "Forbidden" });
  }
}
