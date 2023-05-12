import axios from "axios";

const fetcher = axios.create({
  baseURL: "https://www.google.com/recaptcha/api/siteverify",
  timeout: 15000,
});

export default function handler(req: any, res: any) {
  if (req.method === "POST") {
    fetcher
      .post(
        "",
        new URLSearchParams({
          secret: process.env.CAPTCHA_SECRET_KEY ?? "",
          response: req.body.response,
        })
      )
      .then((r) => {
        return res.status(200).json(r.data);
      });
  } else {
    res.status(403).json({ error: "Forbidden" });
  }
}
