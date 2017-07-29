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
  created_time?: string;
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
