import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#f8ecdf",
        blush: "#f5dfd8",
        rosewarm: "#cf7680",
        roseink: "#8d4c58",
        terracotta: "#c88d6d",
        indigoink: "#6670a2",
        sage: "#97ab86",
        line: "#4e34271c",
        cocoa: "#4e3427",
        mocha: "#6f5144"
      },
      boxShadow: {
        soft: "0 22px 70px rgba(109, 72, 56, 0.11)",
        float: "0 10px 30px rgba(109, 72, 56, 0.08)"
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "Nunito", "ui-sans-serif", "system-ui"],
        display: ["var(--font-fraunces)", "Fraunces", "ui-serif", "Georgia"]
      }
    }
  },
  plugins: []
};

export default config;
