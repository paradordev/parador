// import { isDev } from "./functions";

const api = {
  url: {
    development: process.env.NEXT_PUBLIC_URL_API_WP_DEV,
    production: process.env.NEXT_PUBLIC_URL_API_WP_PROD,
  },
  urlGraphQl: {
    development: process.env.NEXT_PUBLIC_URL_GRAPHQL_WP_DEV,
    production: process.env.NEXT_PUBLIC_URL_GRAPHQL_WP_PROD,
  },
  urlNext: {
    development: process.env.NEXT_PUBLIC_URL_API_NEXT_DEV,
    production: process.env.NEXT_PUBLIC_URL_API_NEXT_PROD,
  },
  auth: "Basic " + btoa("developer" + ":" + process.env.NEXT_PUBLIC_KEY_API_WP),
};

const ENV = {
  dev: {
    apiUrl: api.url.development,
    nextUrl: api.urlNext.development,
    gqlUrl: api.urlGraphQl.development,
    apiAuth: api.auth,
  },
  prod: {
    apiUrl: api.url.production,
    nextUrl: api.urlNext.production,
    gqlUrl: api.urlGraphQl.production,
    apiAuth: api.auth,
  },
};

const isDev = () => {
  const environmentMode = process.env.NODE_ENV;
  if (environmentMode === "development") return true;
  return false;
};

export default ENV[isDev() ? "dev" : "prod"];
