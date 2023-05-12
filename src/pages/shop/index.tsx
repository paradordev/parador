import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Select,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoCartOutline, IoGridOutline, IoListOutline } from "react-icons/io5";
import HeroV2 from "../../components/HeroV2";
import ItemGridStore from "../../components/ItemGridStore";
import ItemListStore from "../../components/ItemListStore";
import Helmet from "../../containers/Helmet";
import Footer from "../../layout/Footer";
import HeaderV3 from "../../layout/HeaderV3";
import Section from "../../layout/Section";
import { getHotelBrands, getHotelDetail } from "../../utils/api";
import { useSWRGraphQL } from "../../utils/hooks";
import { useLargeQuery } from "../../utils/mediaQuery";
import { IHeader, IHero } from "../../utils/types";

export default function Home({
  header,
  hotelBrands,
  hero,
}: {
  header: IHeader;
  hotelBrands: any;
  hero: IHero;
}) {
  const { reload, query, isReady, replace, push, locale } = useRouter();

  useEffect(() => {
    query.process == "done" && replace(`/shop`, undefined, { shallow: false });
  }, []);

  const [count, setCount] = useState(8);

  const [headerHeight, setHeaderHeight] = useState<number>(1);

  const [keywordCat, setKeywordCat] = useState("");
  const [selectedCat, setSelectedCat] = useState("");

  const [cats, setCats] = useState<any>();
  const [products, setProducts] = useState<any>(null);

  const [totalProducts, setTotalProducts] = useState<number>(0);

  const [orderBy, setOrderBy] = useState<any>(`{ field: DATE, order: DESC }`);

  const [catData, isCatLoading, isCatError] = useSWRGraphQL(`query p_cats {
    productCategories {
      nodes {
        id
        name
        slug
        image {
          id
          sourceUrl
          srcSet
        }
      }
    }
  }`);

  const [prodData, isProdLoading, isProdError, prodMutate] =
    useSWRGraphQL(`query p_all {
    products(first: ${count}, where: {category: "${keywordCat}", orderby: ${orderBy}, stockStatus: IN_STOCK, tagIn: "shop"}) {
      nodes {
        id
        databaseId
        slug
        image {
          id
          altText
          sourceUrl
        }
        name
        ... on SimpleProduct {
          price(format: RAW)
          regularPrice(format: RAW)
          id
          databaseId
        }
        description(format: RAW)
        shortDescription(format: RAW)
      }
    }
  }`);

  const [isSelectedProdLoading, setSelectedProdLoading] = useState(false);

  useEffect(() => {
    setSelectedProdLoading(true);

    if (!isCatLoading && catData) {
      const tempCats = catData.productCategories.nodes;

      const finalCats = tempCats.map((tempCat: any) => {
        const finalCatName = selectLangSimple(tempCat.name, "/");

        return { ...tempCat, name: finalCatName };
      });

      setCats(finalCats);
    }
    !isProdLoading && prodData && setProducts(prodData.products.nodes);

    prodData && setTotalProducts(prodData.products.nodes.length);

    setSelectedProdLoading(false);
  }, [catData, prodData, count, orderBy, selectedCat, locale]);

  const { isLarge } = useLargeQuery();

  const [viewAs, setViewAs] = useState("grid");

  useEffect(() => {
    if (!products) return;
    setViewAs(products.length > 2 || !isLarge ? "grid" : "list");
  }, [products, isLarge]);

  function selectLangDesc(str: any) {
    let final = {
      title_id: "",
      desc_id: "",
      desc_en: "",
    };

    str.split("///").map((x: any) => {
      if (x.includes("title_id : ")) {
        final.title_id = x
          .replace("title_id : ", "")
          .replace(/\r|\n|amp;/g, "");
      }
      if (x.includes("desc_id : ")) {
        final.desc_id = x.replace("desc_id : ", "").replace(/\r|\n|amp;/g, "");
      }
      if (x.includes("desc_en : ")) {
        final.desc_en = x.replace("desc_en : ", "").replace(/\r|\n|amp;/g, "");
      }
    });

    return final;
  }

  function selectLangSimple(desc: any, split: any = "///") {
    const temp = desc ?? "";
    let finalDesc = temp;

    if (temp.includes(split)) {
      const x = temp.split(split);
      finalDesc = x[locale == "id" ? 1 : 0];
    }

    return finalDesc;
  }

  return (
    <>
      <Helmet
        title="Store | Parador Hotels & Resorts"
        description={
          locale == "id"
            ? "Selamat datang di toko online Parador Hotels! Kami menawarkan berbagai merchandise, voucher, dan souvenir hotel berkualitas tinggi untuk memenuhi kebutuhan Anda. Nikmati pengalaman belanja yang menyenangkan di toko online kami, dengan berbagai pilihan unik dan eksklusif, seperti pakaian, tas, mug, serta voucher hotel yang dapat diakses secara mudah dan cepat. Semua produk di toko online Parador Hotels dirancang untuk memberikan kenangan yang tak terlupakan bagi tamu hotel dan pelanggan kami."
            : "Welcome to the Parador Hotels online shop! We offer a variety of high-quality merchandise, vouchers, and hotel souvenirs to meet your needs. Enjoy a pleasant shopping experience on our online store, with unique and exclusive options such as clothing, bags, mugs, and easy and quick access to hotel vouchers. All products in the Parador Hotels online shop are designed to provide unforgettable memories for our hotel guests and customers."
        }
        image="https://backend.parador-hotels.com/wp-content/uploads/2022/06/ALL-MERCH-BANNER-scaled.webp"
      />
      <HeaderV3
        headerItem={header}
        isHomepage={true}
        getHeight={(headerHeight: number) => setHeaderHeight(headerHeight)}
        hotelBrands={hotelBrands}
      />
      <HeroV2
        hasFormNow={true}
        heroItem={hero}
        height={`calc(100vh - ${headerHeight}px)`}
      />

      <Section bg="white">
        <Flex justify="space-between" align="center">
          <Heading
            mb={2}
            mr={20}
            as="h1"
            fontWeight={400}
            letterSpacing="wider"
            color={header.color_primary}
          >
            {locale == "id" ? "BELANJA" : "SHOP"}
          </Heading>
          <Flex align="center" color="blackAlpha.600" gap={4}>
            <Box
              cursor="pointer"
              onClick={() => {
                push(`/shop/cart`);
              }}
            >
              <IoCartOutline size={28} color="inherit" />
            </Box>
            {isLarge && (
              <>
                <Center h="20px">
                  <Divider
                    borderColor="blackAlpha.500"
                    opacity={1}
                    orientation="vertical"
                  />
                </Center>
                <Box onClick={() => setViewAs("list")} cursor="pointer">
                  <IoListOutline
                    color={viewAs === "list" ? header.color_primary : `inherit`}
                    size={28}
                  />
                </Box>
                <Box onClick={() => setViewAs("grid")} cursor="pointer">
                  <IoGridOutline
                    color={viewAs === "grid" ? header.color_primary : `inherit`}
                    size={22}
                  />
                </Box>
              </>
            )}
            <>
              <Center h="20px">
                <Divider
                  borderColor="blackAlpha.500"
                  opacity={1}
                  orientation="vertical"
                />
              </Center>
              <Select
                fontSize="sm"
                border="none"
                _focus={{}}
                p={0}
                m={0}
                onChange={(e) => setOrderBy(e.target.value)}
              >
                <option value={`{field: DATE, order: DESC}`}>
                  {" "}
                  {locale == "id" ? "TERBARU" : "LATEST"}
                </option>
                <option value={`{field: PRICE, order: ASC}`}>
                  {locale == "id" ? "HARGA TERENDAH" : "PRICE LOW TO HIGH"}
                </option>
                <option value={`{field: PRICE, order: DESC}`}>
                  {locale == "id" ? "HARGA TERTINGGI" : "PRICE HIGH TO LOW"}
                </option>
              </Select>
            </>
          </Flex>
        </Flex>

        <Flex gap={8} flexDir={["column-reverse", null, null, "row"]}>
          {isCatLoading && !cats && !products ? (
            <Center h="50vh" flex={1}>
              <Spinner size="xl" />
            </Center>
          ) : (
            <Flex
              flex={1}
              flexDir="column"
              fontWeight={500}
              letterSpacing="wide"
              fontSize="lg"
              textTransform="uppercase"
              w="full"
              position={["unset", null, null, "sticky"]}
              top={20}
              alignSelf="flex-start"
            >
              <Text py={3} px={4} bg="gray.400" color="white">
                {locale == "id" ? "Kategori" : "Category"}
              </Text>
              <Text
                py={3}
                px={4}
                bg="gray.100"
                _hover={{ bg: "gray.200" }}
                onClick={() => {
                  setSelectedCat("");
                  setKeywordCat("");
                }}
                color={selectedCat === "" ? `gray.600` : `gray.400`}
                cursor="pointer"
              >
                {locale == "id" ? "Semua" : "All"}
              </Text>
              {cats &&
                cats.map(({ name, id, slug }: any) => (
                  <Text
                    py={3}
                    px={4}
                    key={id}
                    bg="gray.100"
                    _hover={{ bg: "gray.200" }}
                    color={selectedCat == name ? `gray.600` : `gray.400`}
                    onClick={() => {
                      setKeywordCat(slug);
                      setSelectedCat(name);
                    }}
                    cursor="pointer"
                  >
                    {name}
                  </Text>
                ))}
            </Flex>
          )}

          {isProdLoading && !products && isSelectedProdLoading ? (
            <Center h="50vh" flex={3}>
              <Spinner size="xl" />
            </Center>
          ) : (
            <Flex flex={4}>
              {viewAs === "grid" && (
                <SimpleGrid
                  columns={[2, 3, 4]}
                  spacing={[4, 6, 8]}
                  w="100%"
                  rowGap={16}
                >
                  {products &&
                    products.map((item: any) => {
                      const name = selectLangDesc(item.description);

                      return (
                        <ItemGridStore
                          key={item.id}
                          thumb={item.image ? item.image.sourceUrl : undefined}
                          title={
                            locale == "id" && !!name.title_id
                              ? name.title_id
                              : item.name
                          }
                          desc={selectLangSimple(item.shortDescription)}
                          id={item.databaseId}
                          price={item.price}
                          slug={item.slug}
                        />
                      );
                    })}
                </SimpleGrid>
              )}

              {viewAs === "list" && (
                <Flex direction="column" gap={[6, 12]} w="100%">
                  {products &&
                    products.map((item: any) => {
                      const name = selectLangDesc(item.description);

                      return (
                        <ItemListStore
                          key={item.id}
                          thumb={item.image.sourceUrl}
                          title={!!name.title_id ? name.title_id : item.name}
                          desc={selectLangSimple(item.shortDescription)}
                          id={item.databaseId}
                          price={item.price}
                          slug={item.slug}
                        />
                      );
                    })}
                </Flex>
              )}
            </Flex>
          )}
        </Flex>

        {!(totalProducts < count) && (
          <Center mt={10}>
            <Button
              variant="dark"
              size="md"
              onClick={() => {
                setCount(count + 8);
              }}
            >
              {locale == "id" ? "Lebih Banyak" : "Load More"}
            </Button>
          </Center>
        )}
      </Section>

      <Footer
        loc={header.location_url}
        address={header.location_long}
        email={header.email}
        phone={header.phone}
      />
    </>
  );
}

export async function getStaticProps({ locale }: any) {
  let temp;

  const data: any = await getHotelDetail({
    is_parador: "true",
    cct_status: "publish",
  }).then((r) => r.data[0]);

  temp = await data;

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
    store_headline,
    store_slider,
    location_short_en,
    has_dining,
    has_wedding,
    has_meeting_events,
    has_social_events,
    wedding_thumbnail,
    events_thumbnail,
    meeting_thumbnail,
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
    has_social_events,
    wedding_thumbnail,
    events_thumbnail,
    meeting_thumbnail,
  };

  const hero: IHero = {
    id: _ID,
    banner: store_headline,
    color_primary,
    name,
    slider: store_slider,
    hotel_code,
    is_parador: false,
  };

  const hotelBrands = await getHotelBrands();

  return {
    props: {
      header,
      hotelBrands,
      hero,
    },
    revalidate: parseInt(process.env.NEXT_PUBLIC_REVALIDATE_TIME ?? "200", 10), // In seconds
  };
}
