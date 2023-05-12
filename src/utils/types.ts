export interface IHeader {
  id: string;
  name: string;
  color_primary: string;
  color_secondary: string;
  phone: string;
  logo_light: string;
  logo_dark: string;
  location: string;
  location_long?: string;
  location_url?: string;
  slug?: string;
  is_parador: boolean;
  hotel_location: string;
  hotel_code?: number | string | null;
  has_dining: boolean | string | undefined;
  has_wedding: boolean | string | undefined;
  has_meeting_events: boolean | string | undefined;
  has_social_events?: boolean | string | undefined;
  wedding_thumbnail?: string | null;
  events_thumbnail?: string | null;
  meeting_thumbnail?: string | null;
  email?: string | undefined;
  instagram?: string | undefined;
  facebook?: string | undefined;
  hotel_facilities?: any;
  email_participants?: any;
}

export interface IFooter {
  location: string;
}

export interface IHero {
  id: string;
  name: string;
  banner: string;
  sub_banner?: string;
  color_primary: string;
  hotel_code?: string | number | null | undefined;
  slider: Array<any>; // { id: string; url: string }
  is_parador: boolean;
  has_banner?: undefined | boolean;
}

export interface IHotelHome {
  id: string;
  name: string;
  color_primary: string;
  color_secondary: string;
  hotel_location: string;
  home_subheadline: string;
  facilities: Array<string>;
  slug: string;
  logo_light: string;
  brand: string;
  meeting_thumbnail?: string;
  events_thumbnail?: string;
  wedding_thumbnail?: string;
}

export interface IRoomsHome {
  id: string;
  name: string;
  color_primary: string;
  color_secondary: string;
  hotel_location: string;
  slug: string;
  logo_light: string;
  brand: string;
  room_subheadline: string;
}
