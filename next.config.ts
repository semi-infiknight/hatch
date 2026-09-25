import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev HMR and client chunks are blocked when the page is opened on 127.0.0.1.
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    rules: {
      "*.{glsl,vert,frag,vs,fs}": {
        loaders: ["./src/shims/glsl-loader.js"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
