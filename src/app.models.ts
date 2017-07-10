// Add all data models here

export interface ErrorTable {
  title: string;
  message: string;
  header_bg?: string;
  header_color?: string;
  button_type?: string;
  randcookie?: string;
  video?: string;
  helpmessage?: Array<Array<string>>; // Only can have up to 3 //
}
