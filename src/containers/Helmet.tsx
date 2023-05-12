import Head from "next/head";
import { useRouter } from "next/router";
import paradorLogo from "../../public/parador.png";
import { capEachWord, isDev } from "../utils/functions";

export default function Helmet({
  title,
  description = "",
  children,
  image = paradorLogo.src,
}: {
  title: string;
  description?: string;
  children?: any;
  image?: string;
}) {
  const { asPath } = useRouter();

  return (
    <Head>
      <title>{capEachWord(title)}</title>
      {description && <meta name="description" content={description} />}
      <meta name="keywords" content="" />
      <meta name="author" content="Parador|Rubic3|Bigkuma|arridhow" />
      {/* { important } */}
      <meta name="google-site-verification" content="" />
      <meta name="og:title" property="og:title" content={title} />
      <meta
        name="og:description"
        property="og:description"
        content={description ?? ""}
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Parador Website" />
      <meta
        property="og:url"
        content={process.env.NEXT_PUBLIC_URL_PROD + asPath.substring(1)}
      />
      <meta property="og:image" itemProp="image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={capEachWord(title)} />
      <meta name="twitter:site" content="paradorhotels" />
      <meta name="twitter:description" content={description ?? ""} />
      <meta name="twitter:image" content={image} />

      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/favicon.ico" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico?v=3" />

      <meta property="og:image" content="" />
      {!isDev && (
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
      )}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      />
      {children}
    </Head>
  );
}
