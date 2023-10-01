/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.md': [
          {
            loader: '@mdx-js/loader',
            options: {
              format: 'md',
            },
          },
        ],
        '*.mdx': ['./my-mdx-loader'], // If you also want to use the my-mdx-loader for .mdx files
      },
    },
  },
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil"
    });

    return config;
  },
  images:{
    domains: [
      "lh3.googleusercontent.com",
      "uploadthing.com",
      "utfs.io"
    ]
  }
}

module.exports = nextConfig;
