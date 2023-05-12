var nodemailer = require("nodemailer");
import { getFormattedDate } from "../../utils/functions";

export default function handler(req, res) {
  if (req.method === "POST") {
    // Process a POST request
    const params = req.body;
    if (
      req.query.user != "guest" ||
      params.mailkey != process.env.MAIL_API_KEY
    ) {
      res.status(401).json({ error: "Not Authorized" });
    } else {
      //logic goes here
      {
        const transporter = nodemailer.createTransport({
          // service: "SendPulse",
          host: process.env.MAIL_HOST,
          secure: true,
          port: 465,
          auth: {
            user: process.env.MAIL_SENDER_ACCOUNT,
            pass: process.env.MAIL_SENDER_PASSWORD,
          },
        });

        const mailOptions = {
          from: "Parador Hotels & Resorts <noreply@parador-hotels.com>",
          to: params.emails,
          subject: params.subject,
          html: `
          <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%">
            <tbody>
              <tr>
                <td align="center" valign="top">
                  <div id="m_774276272434306181template_header_image">
                    <p style="margin-top: 0">
                      <img
                        src="${process.env.MAIL_PARADOR_LOGO_URL}"
                        alt="Parador - Hotel"
                        style="
                          border: none;
                          display: inline-block;
                          font-size: 14px;
                          font-weight: bold;
                          height: auto;
                          outline: none;
                          text-decoration: none;
                          text-transform: capitalize;
                          vertical-align: middle;
                          max-width: 100%;
                          margin-left: 0;
                          margin-right: 0;
                          object-fit: contain;
                          height: 40px;
                          margin-bottom: 6px;
                        "
                        border="0"
                        class="CToWUd"
                        jslog="138226; u014N:xr6bB; 53:W2ZhbHNlLDBd"
                      />
                    </p>
                  </div>
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    width="600"
                    id="m_774276272434306181template_container"
                    style="
                      background-color: #fff;
                      border: 1px solid #dedede;
                      border-radius: 3px;
                    "
                    bgcolor="#fff"
                  >
                    <tbody>
                      <tr>
                        <td align="center" valign="top">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            width="100%"
                            id="m_774276272434306181template_header"
                            style="
                              background-color: #262226;
                              color: #fff;
                              border-bottom: 0;
                              font-weight: bold;
                              line-height: 100%;
                              vertical-align: middle;
                              font-family: 'Helvetica Neue', Helvetica, Roboto, Arial,
                                sans-serif;
                              border-radius: 3px 3px 0 0;
                            "
                            bgcolor="#262226"
                          >
                            <tbody>
                              <tr>
                                <td
                                  id="m_774276272434306181header_wrapper"
                                  style="padding: 36px 48px; display: block"
                                >
                                  <h1
                                    style="
                                      font-family: 'Helvetica Neue', Helvetica, Roboto,
                                        Arial, sans-serif;
                                      font-size: 24px;
                                      font-weight: 300;
                                      line-height: 150%;
                                      margin: 0;
                                      text-align: left;
                                      color: #fff;
                                      background-color: inherit;
                                    "
                                    bgcolor="inherit"
                                  >
                                    ${
                                      params.title ??
                                      `Your Booking Confirmation`
                                    }
                                  </h1>
                                  <h1
                                    style="
                                      font-family: 'Helvetica Neue', Helvetica, Roboto,
                                        Arial, sans-serif;
                                      font-size: 24px;
                                      font-weight: 300;
                                      line-height: 150%;
                                      margin: 0;
                                      text-align: left;
                                      color: #fff;
                                      background-color: inherit;
                                    "
                                    bgcolor="inherit"
                                  >
                                    Parador ${`- ` + params.hotel}
                                  </h1>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" valign="top">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            width="600"
                            id="m_774276272434306181template_body"
                          >
                            <tbody>
                              <tr>
                                <td
                                  valign="top"
                                  id="m_774276272434306181body_content"
                                  style="background-color: #fff"
                                  bgcolor="#fff"
                                >
                                  <table
                                    border="0"
                                    cellpadding="20"
                                    cellspacing="0"
                                    width="100%"
                                  >
                                    <tbody>
                                      <tr>
                                        <td valign="top" style="padding: 48px 48px 32px">
                                          <div
                                            id="m_774276272434306181body_content_inner"
                                            style="
                                              color: #636363;
                                              font-family: 'Helvetica Neue', Helvetica,
                                                Roboto, Arial, sans-serif;
                                              font-size: 14px;
                                              line-height: 150%;
                                              text-align: left;
                                            "
                                            align="left"
                                          >
                                            <p style="margin: 0 0 16px">Hi ${
                                              params.name
                                            },</p>
                                            <p style="margin: 0 0 16px; white-space: pre-line;">
                                              ${params.body}
                                            </p>

                                            <h2
                                              style="
                                                color: #262226;
                                                display: block;
                                                font-family: 'Helvetica Neue', Helvetica,
                                                  Roboto, Arial, sans-serif;
                                                font-size: 18px;
                                                font-weight: bold;
                                                line-height: 130%;
                                                margin: 0 0 18px;
                                                text-align: left;
                                              "
                                            >
                                              ${
                                                params.type
                                              } (${getFormattedDate()})
                                            </h2>

                                            <p style="margin: 0 0 16px">
                                              Thanks for using
                                              <a
                                                href="https://parador-hotels.com"
                                                target="_blank"
                                                >Parador Hotels & Resorts</a
                                              >!
                                            </p>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center" valign="top">
                  <table
                    border="0"
                    cellpadding="10"
                    cellspacing="0"
                    width="600"
                    id="m_774276272434306181template_footer"
                  >
                    <tbody>
                      <tr>
                        <td valign="top" style="padding: 0; border-radius: 6px">
                          <table border="0" cellpadding="10" cellspacing="0" width="100%">
                            <tbody>
                              <tr>
                                <td
                                  colspan="2"
                                  valign="middle"
                                  id="m_774276272434306181credit"
                                  style="
                                    border-radius: 6px;
                                    border: 0;
                                    color: #8a8a8a;
                                    font-family: 'Helvetica Neue', Helvetica, Roboto,
                                      Arial, sans-serif;
                                    font-size: 12px;
                                    line-height: 150%;
                                    text-align: center;
                                    padding: 24px 0;
                                  "
                                  align="center"
                                >
                                  <p style="margin: 0 0 16px">Parador Hotels & Resorts</p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          `,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            res.status(500).json({ result: error });
          } else {
            console.log("Email sent: " + info.response);
            res.status(200).json({ result: info.response });
          }
        });
      }
    }
  } else {
    res.status(403).json({ error: "Forbidden" });
  }
}
