import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        glow: "0 0px 50px -5px rgba(0, 0, 0, 0.3)",
      },
      keyframes: {
        round: {
          "0%, 100%": { boxShadow: "0 0px 50px -5px rgba(0, 0, 0, 0.3)" },
          "50%": { boxShadow: "0 30px 50px -5px rgba(0, 0, 0, 0.3)" },
        },
        round2: {
          "0%, 100%": { transform: "rotateY(20deg)" },
          "50%": { transform: "rotateY(10deg)" },
        },
      },
      animation: {
        round: "round 1s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
