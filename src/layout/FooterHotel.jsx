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
import {
  IoChevronBack,
  IoLogoFacebook,
  IoLogoInstagram,
} from "react-icons/io5";
import { safeMarginX } from "../utils/mediaQuery";

export default function FooterHotel({
  bg = "black",
  color = "white",
  logo = "",
  location,
  locationLink,
  email,
  phone,
  instagram,
  facebook,
}) {
  const { query, push, locale } = useRouter();

  const [year, setYear] = useState(2022);

  useEffect(() => {
    const d = new Date();
    const year = d.getFullYear();
    setYear(year);
  }, []);

  return (
    <Flex direction="column" as="footer" bg={bg} py={10} gap={10}>
      <Flex
        justify={{ lg: `flex-start`, base: `unset` }}
        pt={8}
        mb={2}
        w="100%"
        gap={12}
        px={safeMarginX}
      >
        <Box
          w={["140px", "160px"]}
          ml={[0, "-6px"]}
          cursor="pointer"
          onClick={() => push(`/`)}
        >
          <Image
            objectFit="contain"
            src="https://backend.parador-hotels.com/wp-content/uploads/2022/05/Parador_White.png"
            alt="Parador_White"
          />
        </Box>
      </Flex>
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
              key={0}
              mb={8}
              href={locationLink ?? `https://goo.gl/maps/ts41ZxoKT3hBSiZy5`}
              isExternal
              _focus={{}}
            >
              {location ??
                "Soho Office Park Kav. 9, 3rd Floor, Jl. Boulevard Raya Gading, Serpong, Tangerang, Banten 15810"}
            </Link>,
            <Link
              key={1}
              href={`mailto:${email ?? "hello@parador-hotel.com"}`}
              style={{ wordWrap: "normal" }}
              isExternal
              _focus={{}}
            >
              {email ?? "hello@parador-hotel.com"}
            </Link>,
            <Link
              key={2}
              href={`tel:${phone ?? "(+62) 2917 - 1111"}`}
              style={{ wordWrap: "normal" }}
              isExternal
              _focus={{}}
            >
              {phone ?? "(+62) 2917 - 1111"}
            </Link>,
          ]}
          hasBackButton
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
          list={[
            <Link
              _focus={{}}
              key={0}
              href={`https://www.instagram.com/${instagram ?? `paradorhotels`}`}
              isExternal
              _hover={{
                color: "white",
              }}
            >
              <IoLogoInstagram size={32} color="inherit" />
            </Link>,
            <Link
              _focus={{}}
              key={1}
              href={`https://www.facebook.com/${
                facebook ?? `ParadorHotelsGroup`
              }`}
              isExternal
              _hover={{
                color: "white",
              }}
            >
              <IoLogoFacebook size={32} />
            </Link>,
          ]}
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

function FooterList({
  title,
  list,
  isRow,
  target,
  isHotel = false,
  hasBackButton = false,
}) {
  const { locale } = useRouter();

  return (
    <Flex
      direction="column"
      maxW={{ lg: `15%`, base: `100%` }}
      mb={{ base: 6, lg: 0 }}
    >
      <Heading
        color="whiteAlpha.600"
        fontSize="md"
        mb={4}
        fontWeight={500}
        as="h4"
      >
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

        {hasBackButton && (
          <Box>
            <NextLink href={`/`} passHref>
              <Link
                _focus={{}}
                display="flex"
                alignItems="center"
                gap={2}
                fontSize="sm"
                mt={8}
              >
                <IoChevronBack />{" "}
                {locale == "id" ? "Kembali ke Parador" : "Back to Parador"}
              </Link>
            </NextLink>
          </Box>
        )}
      </UnorderedList>
    </Flex>
  );
}

const listSocial = [
  <Link
    _focus={{}}
    key={0}
    href={`https://www.instagram.com/paradorhotels`}
    isExternal
    _hover={{
      color: "red.300",
    }}
  >
    <IoLogoInstagram size={32} color="inherit" />
  </Link>,
  <Link
    _focus={{}}
    key={1}
    href={`https://www.facebook.com/ParadorHotelsGroup/`}
    isExternal
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
