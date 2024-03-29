/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // compiler: {
  //   removeConsole:
  //     process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  // },
  // distDir: "build",
  // transpilePackages: [],
};

export default nextConfig;
