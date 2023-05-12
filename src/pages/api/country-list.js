import woocommerceRestApi from "@woocommerce/woocommerce-rest-api";

const WooCommerce = new woocommerceRestApi({
  url: process.env.WOOCOMMERCE_URL,
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET,
  version: "wc/v3",
});

export default async function handler(req, res) {
  let x = WooCommerce.get("data/countries")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error.response.data);
    });

  res.status(200).json(await x);
}
