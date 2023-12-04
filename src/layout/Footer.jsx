import {
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  Image,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoLogoFacebook, IoLogoInstagram } from "react-icons/io5";
import { safeMarginX } from "../utils/mediaQuery";

export default function Footer({ loc, address, email, phone }) {
  const { push, locale } = useRouter();

  const [year, setYear] = useState(2022);

  useEffect(() => {
    const d = new Date();
    const year = d.getFullYear();
    setYear(year);
  }, []);

  return (
    <Flex direction="column" as="footer" bg="black" py={10} gap={10}>
      <Flex
        flexDir={{ base: `column`, lg: `row` }}
        justify={{ base: `initial`, lg: `space-between` }}
        mb={2}
        w="100%"
        gap={12}
        px={safeMarginX}
      >
        <Flex
          flex={9}
          align="center"
          gap={2}
          justify={{ base: `space-between`, lg: `initial` }}
        >
          <Box mr={6} maxW={[24, 120]}>
            <Image
              objectFit="contain"
              src="https://backend.parador-hotels.com/wp-content/uploads/2023/05/PHR-Logo-Parador-White.webp"
              alt="Parador_White"
              cursor="pointer"
              onClick={() => push(`/`)}
            />
          </Box>
          <Box maxW={14}>
            <Image
              objectFit="contain"
              src="https://backend.parador-hotels.com/wp-content/uploads/2022/04/Atria-Logo.png"
              alt="Atria-Logo"
            />
          </Box>
          <Box maxW={14}>
            <Image
              objectFit="contain"
              src="https://backend.parador-hotels.com/wp-content/uploads/2022/04/Vega-Logo.png"
              alt="Vega-Logo"
            />
          </Box>
          <Box maxW={14}>
            <Image
              objectFit="contain"
              src="https://backend.parador-hotels.com/wp-content/uploads/2022/04/Fame-Logo.png"
              alt="Fame-Logo"
            />
          </Box>
          <Box maxW={14}>
            <Image
              objectFit="contain"
              src="https://backend.parador-hotels.com/wp-content/uploads/2022/04/Starlet-Logo.png"
              alt="Starlet-Logo"
            />
          </Box>
          {/* <Box maxW={14}>
            <Image
              objectFit="contain"
              src="https://prdr.bigkuma.com/wp-content/uploads/2022/04/Ha-Ka-Hotel-Logo.png"
              alt=""
            />
          </Box> */}
        </Flex>
        {/* <Center
          flex={3}
          w={{ base: `20%`, lg: `unset` }}
          cursor="pointer"
          onClick={() => {
            window.open("https://www.oneindonesiaprivilege.com/", "_blank");
          }}
        >
          <Image
            objectFit="contain"
            src="https://prdr.bigkuma.com/wp-content/uploads/2022/04/Privilege-Guest-Logo-2.png"
            alt=""
          />
        </Center> */}
        <Flex
          flex={9}
          justify={{ lg: `flex-end`, base: `center` }}
          align="center"
        >
          <Heading
            fontSize={["md", "xl", "2xl"]}
            color="white"
            fontWeight={400}
            letterSpacing="4px"
          >
            WITH A CONSCIOUS HEART
          </Heading>
        </Flex>
      </Flex>
      <Box
        w={{ lg: "100%", base: `100vw` }}
        h={{ base: 100, lg: `unset` }}
        display={{ base: `none`, lg: `initial` }}
      >
        <Image
          src="https://backend.parador-hotels.com/wp-content/uploads/2022/04/Parador-Pattern-1.png"
          alt="Parador-Pattern"
        />
      </Box>
      <Flex
        mx={safeMarginX}
        // flexDir={!isLarge && `column`}\
        justify={{ lg: `space-between`, base: `flex-start` }}
        gap={{ base: 8, lg: 0 }}
        flexWrap="wrap"
      >
        <FooterList
          title={locale == "id" ? "lokasi kami" : "our location"}
          list={[
            <Link
              _focus={{}}
              key={0}
              mb={8}
              href={loc ?? `https://goo.gl/maps/ts41ZxoKT3hBSiZy5`}
              isExternal
            >
              {address}
            </Link>,
            <Link _focus={{}} key={1} href={`mailto:${email}`} isExternal>
              {email}
            </Link>,
            <Link _focus={{}} key={2} href={`tel:${phone}`} isExternal>
              {phone}
            </Link>,
          ]}
        />
        <FooterList
          title={locale == "id" ? "grup kami" : "our group"}
          list={locale == "id" ? listOurGrup.id : listOurGrup.en}
        />
        <FooterList
          title={locale == "id" ? "halaman" : "page"}
          list={locale == "id" ? listPage.id : listPage.en}
        />
        <FooterList
          title="sitemap"
          list={locale == "id" ? listSitemap.id : listSitemap.en}
        />
        <FooterList
          isRow
          title={locale == "id" ? "Tetap Terhubung" : "stay connected"}
          list={listSocial}
        />
      </Flex>
      <Flex mx={safeMarginX}>
        <Divider
          mt={3}
          borderWidth={0.5}
          py={0.1}
          opacity={0.2}
          borderColor="white"
          bg="white"
          orientation="horizontal"
        />
      </Flex>
      <Flex
        mx={safeMarginX}
        justify={{ lg: `space-between`, base: `flex-start` }}
        gap={{ base: 8, lg: 0 }}
        flexWrap="wrap"
      >
        <FooterList
          isHotel
          title="Atria Hotel"
          list={["Gading Serpong", "Magelang", "Malang"]}
          target={[
            "atria-hotel-gading-serpong",
            "atria-hotel-magelang",
            "atria-hotel-malang",
          ]}
        />
        <FooterList
          isHotel
          title="Atria residences"
          list={["Gading Serpong"]}
          target={["atria-residences-gading-serpong"]}
        />
        <FooterList
          isHotel
          title="Vega Hotel"
          list={["Gading Serpong"]}
          target={["vega-hotel-gading-serpong"]}
        />
        <FooterList
          isHotel
          title="Fame Hotel"
          list={["Gading Serpong", "Sunset Road"]}
          target={["fame-hotel-gading-serpong", "fame-hotel-sunset-road"]}
        />
        {/* <FooterList
          isHotel
          title="HA-KA Hotel"
          list={["Semarang"]}
          target={["haka-hotel-semarang"]}
        /> */}
        <FooterList
          isHotel
          title="Starlet Hotel"
          list={["Jakarta Airport", "BSD City", "Serpong"]}
          target={[
            "starlet-hotel-jakarta-airport",
            "starlet-hotel-bsd-city",
            "starlet-hotel-serpong",
          ]}
        />
      </Flex>
      <Center my={6}>
        <Text color="whiteAlpha.800" fontSize="sm">
          {locale == "id" ? "Hak Cipta Dilindungi" : "Copyright"} © {year}
        </Text>
      </Center>
    </Flex>
  );
}

function FooterList({ title, list, isRow, target, isHotel = false }) {
  return (
    <Flex
      direction="column"
      maxW={{ lg: `15%`, base: `100%` }}
      mb={{ base: 6, lg: 0 }}
    >
      <Heading color="whiteAlpha.600" fontSize="md" mb={4} fontWeight={500} as="h4">
        {title}
      </Heading>
      <UnorderedList
        color="whiteAlpha.800"
        listStyleType="none"
        m={0}
        style={isRow && { display: "flex", gap: 20 }}
      >
        {list.map((item, i) => (
          <ListItem fontSize="sm" key={i} mb={2}>
            {isHotel ? (
              <NextLink href={`/${target[i]}`} passHref>
                <Link _focus={{}}>{item}</Link>
              </NextLink>
            ) : (
              item
            )}
          </ListItem>
        ))}
      </UnorderedList>
    </Flex>
  );
}

const listSocial = [
  <Link
    _focus={{}}
    key={0}
    href={`https://www.instagram.com/paradorhotels`}
    _hover={{
      color: "red.300",
    }}
  >
    <IoLogoInstagram size={32} />
  </Link>,
  <Link
    _focus={{}}
    key={1}
    href={`https://www.facebook.com/ParadorHotelsGroup/`}
    _hover={{
      color: "facebook.400",
    }}
  >
    <IoLogoFacebook size={32} />
  </Link>,
];

const listOurGrup = {
  en: [
    <NextLink href="/" passHref key={0}>
      <Link _focus={{}}>Homepage</Link>
    </NextLink>,
    <NextLink key={1} href={`/about`} passHref>
      <Link _focus={{}}>About Us</Link>
    </NextLink>,
    <NextLink key={2} href={`/`} passHref>
      <Link _focus={{}}>Our Brands</Link>
    </NextLink>,
    <NextLink key={3} href={`/`} passHref>
      <Link _focus={{}}>Our Collections</Link>
    </NextLink>,
    <NextLink key={4} href={`/`} passHref>
      <Link _focus={{}}>Development</Link>
    </NextLink>,
    <NextLink key={5} href={`/gallery`} passHref>
      <Link _focus={{}}>Media</Link>
    </NextLink>,
  ],
  id: [
    <NextLink href="/" passHref key={0}>
      <Link _focus={{}}>Halaman Depan</Link>
    </NextLink>,
    <NextLink key={1} href={`/`} passHref>
      <Link _focus={{}}>Tentang Kami</Link>
    </NextLink>,
    <NextLink key={2} href={`/`} passHref>
      <Link _focus={{}}>Merek Kami</Link>
    </NextLink>,
    <NextLink key={3} href={`/gallery`} passHref>
      <Link _focus={{}}>Koleksi Kami</Link>
    </NextLink>,
    <NextLink key={4} href={`/`} passHref>
      <Link _focus={{}}>Pengembangan</Link>
    </NextLink>,
    <NextLink key={5} href={`/gallery`} passHref>
      <Link _focus={{}}>Media</Link>
    </NextLink>,
  ],
};

const listLocation = [
  <Link
    _focus={{}}
    key={0}
    mb={8}
    href={`https://goo.gl/maps/ts41ZxoKT3hBSiZy5`}
    isExternal
  >
    Soho Office Park Kav. 9, 3rd Floor, Jl. Boulevard Raya Gading, Serpong,
    Tangerang, Banten 15810
  </Link>,
  <Link _focus={{}} key={1} href={`mailto:hello@parador-hotel.com`} isExternal>
    hello@parador-hotel.com
  </Link>,
  <Link _focus={{}} key={2} href={`tel:+6229171111`} isExternal>
    (+62) 2917 - 1111
  </Link>,
];

const listPage = {
  en: [
    <NextLink key={0} passHref href={`/special-offers`}>
      <Link _focus={{}}>Special Offers</Link>
    </NextLink>,
    <NextLink key={1} passHref href={`/wedding`}>
      <Link _focus={{}}>Wedding</Link>
    </NextLink>,
    <NextLink key={2} passHref href={`/meeting-events`}>
      <Link _focus={{}}>Meeting & Events</Link>
    </NextLink>,
    <NextLink key={4} passHref href={`https://www.shop.parador-hotels.com/`}>
      <Link _focus={{}}>Store</Link>
    </NextLink>,
    <NextLink key={5} passHref href={`/blog`}>
      <Link _focus={{}}>Blog</Link>
    </NextLink>,
    <NextLink key={6} passHref href={`/contact`}>
      <Link _focus={{}}>Contact Us</Link>
    </NextLink>,
  ],
  id: [
    <NextLink key={0} passHref href={`/special-offers`}>
      <Link _focus={{}}>Promo Spesial</Link>
    </NextLink>,
    <NextLink key={1} passHref href={`/wedding`}>
      <Link _focus={{}}>Pernikahan</Link>
    </NextLink>,
    <NextLink key={2} passHref href={`/meeting-events`}>
      <Link _focus={{}}>Rapat & Acara</Link>
    </NextLink>,
    <NextLink key={4} passHref href={`https://www.shop.parador-hotels.com/id/`}>
      <Link _focus={{}}>Toko</Link>
    </NextLink>,
    <NextLink key={5} passHref href={`/blog`}>
      <Link _focus={{}}>Blog</Link>
    </NextLink>,
    <NextLink key={6} passHref href={`/contact`}>
      <Link _focus={{}}>Kontak</Link>
    </NextLink>,
  ],
};

const listSitemap = {
  en: [
    <NextLink key={0} passHref href={`/help-center`}>
      <Link _focus={{}}>Offers Help Center</Link>
    </NextLink>,
    <NextLink
      key={1}
      passHref
      href={`https://digicom.parador-hotels.com/why-book-direct`}
      isExternal
    >
      <Link _focus={{}}>Why Book Direct</Link>
    </NextLink>,
    <NextLink key={2} passHref href={`/privacy-policy`}>
      <Link _focus={{}}>Privacy & Policy</Link>
    </NextLink>,
    <NextLink key={3} passHref href={`/career`}>
      <Link _focus={{}}>Career</Link>
    </NextLink>,
  ],
  id: [
    <NextLink key={0} passHref href={`/help-center`}>
      <Link _focus={{}}>Pusat Bantuan</Link>
    </NextLink>,
    <NextLink
      key={1}
      passHref
      href={`https://digicom.parador-hotels.com/why-book-direct`}
      isExternal
    >
      <Link _focus={{}}>Kenapa Pesan Langsung</Link>
    </NextLink>,
    <NextLink key={2} passHref href={`/privacy-policy`}>
      <Link _focus={{}}>Privasi & Kebijakan</Link>
    </NextLink>,
    <NextLink key={3} passHref href={`/career`}>
      <Link _focus={{}}>Karir</Link>
    </NextLink>,
  ],
};
