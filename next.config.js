/** @type {import('next').NextConfig} */
const nextConfig = {};

// module.exports = nextConfig;

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

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`;

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ];
  },
};
