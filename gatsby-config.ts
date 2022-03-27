import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
  siteMetadata: {
    title: `FS Docs`,
    siteUrl: `https://fs-docs.huakun.tech`,
  },
  plugins: [
    // 'gatsby-plugin-theme-ui',
    // {
    //   resolve: 'gatsby-plugin-antd',
    //   options: {
    //     style: true,
    //   },
    // },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'G-TGCKB63KWS',
      },
    },
    'gatsby-plugin-image',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/images/icon.png',
      },
    },
    {
			resolve: 'gatsby-plugin-mdx',
			options: {
				extensions: ['.md', '.mdx']
			}
		},
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'notes',
        path: './notes/',
      },
      __key: 'notes',
    },
		// 'gatsby-source-filesystem-slug'
  ],
};

export default config;
