import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#E6F4F4",
          100: "#CCE9E9",
          200: "#99D3D4",
          300: "#66BDBF",
          400: "#33A7A9",
          500: "#0D7377",
          600: "#0B5F62",
          700: "#095B5E",
          800: "#064345",
          900: "#042E30",
        },
      },
    },
  },
  plugins: [],
};

export default config;
