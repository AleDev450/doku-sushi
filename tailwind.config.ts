import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0E0E0E",
          2: "#141414",
          3: "#1B1B1B",
        },
        paper: {
          DEFAULT: "#FFFFFF",
          soft: "#F5F4F1",
          2: "#ECEAE4",
        },
        seal: {
          DEFAULT: "#E30613",
          deep: "#B00410",
        },
        mist: {
          DEFAULT: "rgba(255,255,255,0.56)",
          2: "rgba(255,255,255,0.34)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        kicker: "0.42em",
        tate: "0.34em",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      maxWidth: {
        wrap: "1240px",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        trickle: {
          "0%": { top: "-45%" },
          "60%,100%": { top: "110%" },
        },
        pulse: {
          "0%,100%": { opacity: "1", boxShadow: "0 0 0 0 rgba(227,6,19,0.5)" },
          "50%": { opacity: "0.5", boxShadow: "0 0 0 6px rgba(227,6,19,0)" },
        },
      },
      animation: {
        marquee: "marquee 34s linear infinite",
        trickle: "trickle 2.4s cubic-bezier(0.16,1,0.3,1) infinite",
        pulse: "pulse 2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
