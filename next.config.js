/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;

// module.exports = {
//   async headers() {
//     return [
//       {
//         source: '/:path*',
//         headers: [
//           {
//             key: 'Content-Security-Policy',
//             value: 'upgrade-insecure-requests',
//           },
//         ],
//       },
//     ];
//   },
// };
