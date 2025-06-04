import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_AUTH_KEY: process.env.SUPABASE_AUTH_KEY,
    BASE_URL: process.env.BASE_URL,
  },
};

export default nextConfig;
