// Add all data models here
/**@ignore*/
export interface Settings {
  app_version: number;
  freebie_amount: number;
  signup_bonus?: number;
  review_bonus?: number;
  contact?: string;
}
/**The User data structure */
export interface User {
  /**The Globally Unique UserID (GUID) of this user */
  user_id: string;
  /**How many coins this user has */
  coins?: number;
  /**@ignore */
  username?: string;
  /**@ignore */
  data?: any;
  /**@ignore */
  email?: string;
  /**@ignore */
  first_name?: string;
  /**@ignore */
  last_name?: string;
  /**@ignore */
  zip_code?: string;
  /**@ignore */
  bs_id?: number;
  /**@ignore */
  token_email?: string;
  /**@ignore */
  created_time?: number;
  /**@ignore */
  freebie_used?: boolean;
  /**Has this user has rated this app */
  rated_app?: boolean;
  /**@ignore */
  settings?: Settings;
  /**@ignore */
  special_message?: {
    title: string;
    message: string;
  };
  /**@ignore */
  logging_in?: boolean;
  /**@ignore */
  push_id?: string;
  /**@ignore */
  secured?: boolean;
  /**@ignore */
  has_data?: boolean;
  /**@ignore */
  account_verified?: boolean;
}
/**@ignore*/
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

/**@ignore*/
export interface AppGroup {
  id: number;
  title: string;
  created_time: number;
  apps: Array<App>;
}
/**@ignore*/
export interface Review {
  id: number;
  title: string;
  text: string;
  rating: number;
  last_modified?: number;
}
/**@ignore*/
export interface NewsFeedObj {
  id: string | number;
  title: string;
  body: string;
  app: string;
  appTitle: string;
  from?: string;
  created: number;
  isGlobal: boolean;
  isNew: boolean;
  icon?: string;
  url?: string;
}
/**
 * In-app Purchase data structure
 */
export interface Inapp {
  /**The globally unique app id*/
  storeappId: number;
  /**The globally unique purchase id*/
  purchaseId: number;
  /**The in-app purchase title*/
  title: string;
  /**The in-app purchase description*/
  description: string;
  /**Consumable in-apps are coins. Non Consumable are things like level unlocks or premium content.*/
  isConsumable: boolean;
  /**
   * IF this is Non-Consumable this indicates if it is already Owned.
   * Already Owned items cannot be purchased again, but must be unlocked automatically by your purchase listener.
   */
  isOwned?: boolean;
  /**The in-app purchase price*/
  price: number;
  /**The in-app purchase coins. Non Consumables will always be 0*/
  coins: number;
}
