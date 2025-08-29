/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      { protocol: "https", hostname: "avatar.vercel.sh", pathname: "/**" },
      { protocol: "https", hostname: "images.pokemontcg.io", pathname: "/**" },
    ],
  },
};

export default nextConfig;
