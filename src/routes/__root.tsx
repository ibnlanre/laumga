import type { PropsWithChildren } from "react";
import type { MantineColorsTuple } from "@mantine/core";

import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { createTheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import styles from "../styles.css?url";
import { NotFound } from "@/components/not-found";
import { AuthProvider } from "@/contexts/auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/routing/query-client";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "LAUMGA - Uniting Alumni, Empowering the Ummah",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: styles,
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/icon?family=Material+Icons",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined",
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
});

//  --deep-forest: #002313;
//         --institutional-green: #006838;
//         --vibrant-lime: #8dc63f;
//         --sage-green: #cbe5a7;
//         --mist-green: #f4f9ec;

const deepForest: MantineColorsTuple = [
  "#ebfff6",
  "#d5feeb",
  "#a6fdd4",
  "#74fdbc",
  "#52fda8",
  "#41fd9b",
  "#39fe94",
  "#2de280",
  "#20c970",
  "#002313",
];
const sageMint: MantineColorsTuple = [
  "#f3fce8",
  "#e9f5d8",
  "#cbe5a7", // primary
  "#b9dc89",
  "#a4d166",
  "#97ca4f",
  "#8fc743",
  "#7baf34",
  "#6c9c2b",
  "#5b871e",
];
const mistGreen: MantineColorsTuple = [
  "#f4f9ec", // primary
  "#ebf3e0",
  "#d5e6ba",
  "#bed992",
  "#aacd70",
  "#9dc65a",
  "#96c34e",
  "#82ac3f",
  "#739936",
  "#61842a",
];

const vibrantLime: MantineColorsTuple = [
  "#f3fce7",
  "#e8f5d7",
  "#d1e8b1",
  "#b8dc88",
  "#a3d165",
  "#96ca4e",
  "#8dc63f", // primary
  "#7aaf32",
  "#6b9c29",
  "#5a871c",
];

const institutionalGreen: MantineColorsTuple = [
  "#ebfff6",
  "#d5feeb",
  "#a5fdd4",
  "#74fdbb",
  "#52fda7",
  "#41fd9a",
  "#38fe93",
  "#2de27f",
  "#20c96f",
  "#006838",
];

const theme = createTheme({
  primaryColor: "vibrant-lime",
  colors: {
    "vibrant-lime": vibrantLime,
    "institutional-green": institutionalGreen,
    "deep-forest": deepForest,
    "sage-green": sageMint,
    "mist-green": mistGreen,
  },
});

function RootDocument({ children }: PropsWithChildren) {
  return (
    <html lang="en" {...mantineHtmlProps} className="overscroll-none">
      <head>
        <HeadContent />
        <ColorSchemeScript />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <MantineProvider theme={theme}>
              <Notifications />
              <ModalsProvider>{children}</ModalsProvider>
            </MantineProvider>
          </AuthProvider>
        </QueryClientProvider>

        {/* 
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        /> */}
        <Scripts />
      </body>
    </html>
  );
}
