import type { DefaultMantineColor, MantineColorsTuple } from "@mantine/core";

type CustomColor =
  | "vibrant-lime"
  | "institutional-green"
  | "deep-forest"
  | "sage-green"
  | "mist-green";

type CustomMantineColor = CustomColor | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride extends DefaultMantineColor {
    colors: Record<CustomMantineColor, MantineColorsTuple>;
  }
}
