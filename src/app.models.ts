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
}

export interface ErrorTable {
  title: string;
  message: string;
  header_bg?: string;
  header_color?: string;
  button_type?: string;
  randcookie?: string;
  video?: string;
  button_action?: string;
  helpmessage?: Array<Array<string>>; // Only can have up to 3 //
}

export interface App {
  name: string; // app name
  title: string; // long name
  text: string; // full app text
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
  app_video?: string;
  has_inapps?: boolean;

}

//
export interface AppGroup {
  id: number;
  title: string;
  created_time: number;
  apps: Array<App>;
}
