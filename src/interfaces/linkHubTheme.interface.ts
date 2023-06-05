import type { Thumbnail } from "./thumbnail.interface";

interface CardAndUrlOptions {
  shadowRadius?: string;
  shadowColor?: string;
  shadowPositionX?: string;
  shadowPositionY?: string;
  rounded?: string;
  borderWidth?: string;
  borderColor?: string;
  backgroundColor?: string;
  blur?: string;
}

interface ColorScheme {
  fullname?: string;
  bio?: string;
}

export interface DataTheme {
  colorScheme: ColorScheme;
  layoutMode: 'horizontal' | 'vertical';
  background: Thumbnail;
  cardOptions: CardAndUrlOptions;
  urlOptions: CardAndUrlOptions;
}
