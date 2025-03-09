/**
 * @type {import('next').NextConfig}
 */
const basePath = "";
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  trailingSlash: true,
  distDir: "dist",
  output: "export",
  basePath: (basePath && isProd) ? `/${basePath}` : ""
}

module.exports = nextConfig