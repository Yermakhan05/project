export type Continent = 'AF' | 'AS' | 'EU' | 'NA' | 'SA' | 'OC' | 'AN';

export interface Country {
  id: number;
  name: string;
  continent: Continent;
}

export interface City {
  id: number;
  name: string;
  country: Country;
}

export interface Tour {
  id: number;
  title: string;
  country: Country[];
  city: City[];
  reviewReport: Record<string, any>;
  duration: string;
  description: string;
  events: string[];
  durationDays: number;
  highlights: string[];
  mapImage?: string;
  mapLinks: {
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
  id: number;
  user: UserProfile;
  tour: Tour;
  star: 1 | 2 | 3 | 4 | 5;
  text: string;
  helpful: number;
  notHelpful: number;
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
  userId: number;
  locationProfile?: string;
  fullName: string;
  coverPhoto?: string;
  profilePic?: string;
  bookingHistory: Tour[];
  favourites: Tour[];
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: number;
  user: UserProfile;
  tour: Tour;
  status: BookingStatus;
  createdAt: string;
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
  id: number;
  name: string;
  email: string;
  phone: string;
  comment?: string;
  status: 'pending' | 'processed';
}
