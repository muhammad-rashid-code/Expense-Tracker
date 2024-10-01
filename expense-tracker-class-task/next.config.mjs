/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [
        "example.com", // Your existing domain
        "firebasestorage.googleapis.com", // Add Firebase Storage domain
      ],
    },
  };
  
  export default nextConfig;
  