import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    bg: "#0B0E14",
                    panel: "#11171E",
                    sidebar: "#10151C",
                    accent: "#17C7A1",
                    border: "#1B222C",
                    text: {
                        primary: "#FFFFFF",
                        secondary: "#9499A1",
                        muted: "#4A525C"
                    },
                    green: {
                        glow: "rgba(23, 199, 161, 0.15)",
                        solid: "#17C7A1"
                    }
                }
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
