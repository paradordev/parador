import { Box, Heading } from "@chakra-ui/react";
import { Markup } from "interweave";
import { isEmpty } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import Helmet from "../../containers/Helmet";
import Footer from "../../layout/Footer";
import HeaderV3 from "../../layout/HeaderV3";
import Section from "../../layout/Section";
import {
  getBlogDetail,
  getHotelBrands,
  getHotelDetail,
  getSitemap,
} from "../../utils/api";
import { IHeader } from "../../utils/types";

export default function SearchPage({
  header,
  hotelBrands,
  sitemapData,
  blog,
}: {
  header: IHeader;
  hotelBrands: any;
  sitemapData: any;
  blog: any;
}) {
  const { locale, query, isReady, push } = useRouter();

  // const [itemTemp, isLoading, isError] = useFetchSWRv2(`blog`, {
  //   cct_status: "publish",
  //   _ID: query.id,
  // });

  // useEffect(() => {
  //   if (!isReady) return;

  //   if (!query.id || (!isLoading && !itemTemp)) push("/blog");
  // }, [isLoading, isReady, itemTemp, push, query]);

  return (
    <>
      <Helmet
        title={
          !isEmpty(blog.meta_title_id) && locale == "id"
            ? blog.meta_title_id
            : !isEmpty(blog.meta_title_en)
            ? blog.meta_title_en
            : `${blog.title} - Blog | Parador Hotels & Resorts`
        }
        description={
          locale == "id"
            ? !isEmpty(blog.meta_desc_id)
              ? blog.meta_desc_id
              : ""
            : !isEmpty(blog.meta_desc_en)
            ? blog.meta_desc_en
            : ""
        }
        image={!isEmpty(blog.meta_thumb) ? blog.meta_thumb : blog.thumbnail}
      />
      <HeaderV3
        headerItem={header}
        isHomepage={false}
        hotelBrands={hotelBrands}
      />

      <Section>
        <Heading
          mb={2}
          as="h1"
          fontWeight={400}
          letterSpacing="wider"
          color={header.color_primary}
          textAlign="center"
        >
          {blog.title}
        </Heading>
        <Box w="100%" h="70vh" position="relative">
          <Image
            src={blog.thumbnail}
            alt={blog.title}
            layout="fill"
            objectFit="cover"
          />
        </Box>
        <Markup
          className="white-space-enter"
          content={
            locale == "id"
              ? blog.content_id.replace(/\\n/g, `<br>`) ?? ""
              : blog.content_en.replace(/\\n/g, `<br>`) ?? ""
          }
        />
      </Section>

      <Box h={10} />
      <Footer
        loc={header.location_url}
        address={header.location_long}
        email={header.email}
        phone={header.phone}
      />
    </>
  );
}

export async function getStaticProps({ locale, params }: any) {
  let temp;

  const blog: any = await getBlogDetail({
    cct_status: "publish",
    slug: params.bid,
  }).then((r) => r.data[0]);

  const data: any = await getHotelDetail({
    is_parador: "true",
    cct_status: "publish",
  }).then((r) => r.data[0]);

  temp = await data;

  const sitemapData: any = await getSitemap({
    type: "Privacy Policy",
  }).then((res) => res.data[0]);

  if (locale == "id") {
    let x = JSON.stringify(data);
    let y = x.replace(/_id/g, "");
    temp = JSON.parse(y);
  } else {
    let x = JSON.stringify(data);
    let y = x.replace(/_en/g, "");
    temp = JSON.parse(y);
  }

  const {
    _ID,
    name,
    location_short,
    location_url,
    hotel_location,
    phone,
    logo_dark,
    logo_light,
    color_primary,
    color_secondary,
    is_parador,
    slug,
    hotel_code,
    home_headline,
    hotel_sliders,
    hotel_gallery,
    location_short_en,
    has_dining,
    has_wedding,
    has_meeting_events,
    location_long,
    location_long_en,
    email,
  } = temp;

  const header: IHeader = {
    email: email,
    instagram: temp.instagram,
    facebook: temp.facebook,
    location_long: location_long ? location_long : location_long_en,
    id: _ID,
    name,
    color_primary,
    color_secondary,
    location: location_short ? location_short : location_short_en,
    location_url,
    hotel_location,
    phone,
    logo_dark,
    logo_light,
    is_parador: is_parador === "true",
    hotel_code: hotel_code == 0 ? null : hotel_code,
    slug,
    has_dining,
    has_wedding,
    has_meeting_events,
  };

  const hotelBrands = await getHotelBrands();

  return {
    props: {
      header,
      hotelBrands,
      sitemapData,
      blog,
    },
    revalidate: parseInt(process.env.NEXT_PUBLIC_REVALIDATE_TIME ?? "200", 10), // In seconds
  };
}

export async function getStaticPaths() {
  const res = await getBlogDetail();
  const blogs = await res.data;

  const paths = await blogs
    .filter(function (blog: any) {
      if (blog.cct_status != "publish" || isEmpty(blog.slug)) {
        return false; // skip
      }
      return true;
    })
    .map(function (blog: any) {
      return { params: { bid: blog.slug } };
    });

  return { paths, fallback: "blocking" };
}
