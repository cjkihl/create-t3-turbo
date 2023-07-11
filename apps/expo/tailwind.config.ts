import { type Config } from "tailwindcss";

import baseConfig from "@acme/tailwind-config";

export default {
  presets: [baseConfig],
  content: ["./app/**/*.{ts,tsx}", "./utils/**/*.{ts,tsx}"],
} satisfies Config;
