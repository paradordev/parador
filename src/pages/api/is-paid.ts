import { createHash } from "crypto";

export default function handler(req: any, res: any) {
  const signature = createHash("sha512")
    .update(
      `${process.env.MID}${req.query.id}S${req.query.total}IDR${process.env.REDDOT_SECRET_KEY}`
    )
    .digest("hex");

  res.status(200).json({ result: signature === req.query.sig });
}
