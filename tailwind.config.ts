import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-heebo)']
      },
      colors: {
        primary: {
          main: '#FF6464',
          hover: '#FF7E7E'
        },
        secondary: '#00A8CC',
        dark: '#21243D',
        light: '#8695A4',
      },
      maxWidth: {
        outerFrame: '72rem',
        innerFrame: '53.4375rem'
      }
    },
  },
  plugins: [],
};
export default config;
