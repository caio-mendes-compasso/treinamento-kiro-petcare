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
      keyframes: {
        "toast-in": {
          "0%": { opacity: "0", transform: "translateY(1rem)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "toast-in": "toast-in 0.3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
