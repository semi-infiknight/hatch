import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev HMR and client chunks are blocked when the page is opened on 127.0.0.1.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
