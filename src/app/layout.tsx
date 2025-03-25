"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LeftPanel from "@/components/leftPanel/LeftPanel";
// import MiddlePanel from "@/components/middlePanel/MiddlePanel";
import Stack from '@mui/material/Stack';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider, CssBaseline } from "@mui/material";
import nowtedTheme from "@/theme/theme";



const queryClient = new QueryClient();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Nowted</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider theme={nowtedTheme}>
          <CssBaseline />
          <QueryClientProvider client={queryClient}>

              <Stack direction="row" width="100vw" height="100vh" bgcolor="custom.main">
                <LeftPanel />
                {children}
              </Stack>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export default RootLayout;
