// Add all data models here
export interface Settings {
  app_version: number;
  freebie_amount: number;
}

export interface User {
  user_id: string;
  coins?: number;
  data?: any;
  email?: string;
  first_name?: string;
  last_name?: string;
  zip_code?: string;
  bs_id?: number;
  token_email?: string;
  created_time?: number;
  freebie_used?: boolean;
  rated_app?: boolean;
  settings?: Settings;
  special_message?: {
    title: string;
    message: string;
  };
  logging_in?: boolean;
  push_id?: string;
  secured?: boolean;
  has_data?: boolean;
  account_verified?: boolean;
}

export interface App {
  id: number; // app id
  name: string; // app name
  title: string; // long name
  text: string; // full app text
  slug?: string;
  category: number;
  icon: string;
  featured_image?: string;
  app_version: string;
  created_time: number;
  owner: string;
  review_average?: number;
  review_count?: number;
  screenshot_1?: string;
  screenshot_2?: string;
  screenshot_3?: string;
  screenshot_4?: string;
  app_video?: string;
  has_inapps?: boolean;
  has_offerwall?: boolean;
}

//
export interface AppGroup {
  id: number;
  title: string;
  created_time: number;
  apps: Array<App>;
}

export interface Review {
  id: number;
  title: string;
  text: string;
  rating: number;
  last_modified?: number;
}

export interface Inapp {
  storeappId: number;
  purchaseId: string;
  title: string;
  description: string;
  isConsumable: boolean;
  isOwned?: boolean;
  price: number;
  coins: number;
  paypal_checkout?: string;
  bluesnap_checkout?: string;
}

export interface WasAlertTable {
  title: string;
  text: string;
  btn?: {
    title: string;
    action: string;
  };
}
