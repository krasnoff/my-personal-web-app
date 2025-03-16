import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.scss";
import Link from "next/link";
import Image from 'next/image';

import faceBookIcon from "../svg/facebook.svg";
import instagramIcon from "../svg/instagram.svg";
import linkedinIcon from "../svg/linkedin.svg";
import twitterIcon from "../svg/x.svg";
import HeaderNavigation from "@/components/headerNavigation";
import { GoogleAnalytics } from "@next/third-parties/google";


const heebo = localFont({
  src: [
    {
      path: '../public/fonts/heebo/Heebo-Thin.ttf',
      weight: '100'
    },
    {
      path: '../public/fonts/heebo/Heebo-ExtraLight.ttf',
      weight: '200'
    },
    {
      path: '../public/fonts/heebo/Heebo-Light.ttf',
      weight: '300'
    },
    {
      path: '../public/fonts/heebo/Heebo-Regular.ttf',
      weight: '400'
    },
    {
      path: '../public/fonts/heebo/Heebo-Medium.ttf',
      weight: '500'
    },
    {
      path: '../public/fonts/heebo/Heebo-SemiBold.ttf',
      weight: '600'
    },
    {
      path: '../public/fonts/heebo/Heebo-Bold.ttf',
      weight: '700'
    },
    {
      path: '../public/fonts/heebo/Heebo-ExtraBold.ttf',
      weight: '800'
    },
    {
      path: '../public/fonts/heebo/Heebo-Black.ttf',
      weight: '900'
    }
  ],
  variable: '--font-heebo'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://my-personal-web-app.vercel.app/'),
  title: "Kobi Krasnoff - Profile",
  description: "Hello and welcome to my new website. My name is Kobi and I have been coding for over 20 years. On this page, you can find several applications I have made using the React framework. In addition, I have written several articles that you may find useful.",
  keywords: "HTML, CSS, JavaScript, React, Frontend, Kobi Krasnoff, hooks, nodejs, SOLID, NFT, grpc, d3, israel, portfolio, articles, developer",
  authors: {name: "Kobi Krasnoff"},
  openGraph: {
    type: "website",
    title: "Kobi Krasnoff - Fullstack / Frontend programmer",
    description: "Hello and welcome to my new website. My name is Kobi and I have been coding for over 20 years. On this page, you can find several applications I have made using the React framework. In addition, I have written several articles that you may find useful.",
    images: "https://krasnoff.github.io/assets/img/IMG_5150.JPG",
    url: "https://krasnoff.github.io"
  },
  twitter: {
    card: "summary_large_image",
    site: "https://krasnoff.github.io",
    creator: "@krasnoffkobi",
    title: "Kobi Krasnoff - Fullstack / Frontend programmer",
    description: "Hello and welcome to my new website. My name is Kobi and I have been coding for over 20 years. On this page, you can find several applications I have made using the React framework. In addition, I have written several articles that you may find useful.",
    images: "https://krasnoff.github.io/assets/img/IMG_5150.JPG"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${heebo.variable} font-sans`}>
      
      <body className="text-dark">
        <header>
          <HeaderNavigation></HeaderNavigation>
        </header>
        <main>{children}</main>
        <footer className="h-[11.375rem] mt-[4rem] flex flex-col items-center">
            <div className="flex w-[14.375rem] justify-between">
              <Link href="https://www.facebook.com/kobi.krasnoff" target="_blank">
                <Image
                  priority
                  src={faceBookIcon}
                  alt="Follow me on facebook"
                />
              </Link>
              <Link href="https://www.instagram.com/kobikrasnoff/" target="_blank">
                <Image
                  priority
                  src={instagramIcon}
                  alt="Follow me on Instagram"
                />
              </Link>
              <Link href="https://www.linkedin.com/in/kobi-krasnoff-7510689/" target="_blank">
                <Image
                  priority
                  src={linkedinIcon}
                  alt="Follow me on Linkedin"
                />
              </Link>
              <Link href="https://twitter.com/krasnoffkobi" target="_blank">
                <Image
                  priority
                  src={twitterIcon}
                  alt="Follow me on twitter"
                  className="w-[27px] h-[27px]"
                />
              </Link>
            </div>
            <div className="flex content-center mt-[1.875rem] text-[0.875rem]">
              Copyright ©2024 All rights reserved 
            </div>
        </footer>
      </body>
      <GoogleAnalytics gaId="G-VK29F31T2K" />
    </html>
  );
}
