export type Continent = 'AL' | 'AF' | 'AS' | 'EU' | 'NA' | 'SA' | 'OC' | 'AN';

export interface Country {
  id: number;
  name: string;
  Continent: Continent;
}

export interface City {
  id: number;
  name: string;
  country: Country;
}

export interface Tour {
  tour_images: string[];
  price_list: string;
  price: number;
  rating: number;
  id: number;
  title: string;
  country: string[]
  // country: Country[];
  city: City[];
  review_report: Record<string, any>;
  duration: string;
  description: string;
  events: string[];
  duration_days: number;
  highlights: string[];
  map_image?: string;
  map_links: {
    google: string;
    apple: string;
  };
  cover_image?: string;
}

export interface TourApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Tour[];
}

export interface Review {
  date: string;
  id: number;
  user: User;
  tour: Tour;
  star: 1 | 2 | 3 | 4 | 5;
  text: string;
  helpful: number;
  notHelpful: number;
  review_images: string[];
}

export interface TourImage {
  id: number;
  tour: Tour;
  image: string;
}

export interface ReviewImage {
  id: number;
  review: Review;
  image: string;
}

export interface UserProfile {
  id: number;
  location_profile?: string;
  full_name: string;
  cover_photo?: string;
  profile_pic?: string;
  booking_history: Tour[];
  favourites: Tour[];
}

export interface User {
  id: number;
  username: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: number;
  user: User;
  tour: Tour;
  status: BookingStatus;
  created_at: string;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface Payment {
  id: string;
  booking: Booking;
  amount: number;
  currency: string;
  orderId: string;
  paymentStatus: PaymentStatus;
  paymentUrl?: string;
  transactionId?: string;
  createdAt: string;
}

export interface Cart {
  id: number;
  user: UserProfile;
  tour: Tour;
  quantity: number;
  addedAt: string;
}

export interface UserForm {
  name: string;
  email: string;
  phone: string;
  comment?: string;
  status: 'pending' | 'processed';
}
