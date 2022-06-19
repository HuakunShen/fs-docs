import type { GatsbyConfig } from "gatsby";
import path from "path";
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const dataForAlgoliaIndexQuery = `
query {
  allFile(filter: {ext: {eq: ".md"}}) {
    nodes {
      objectID: id
      childMarkdownRemark {
        rawMarkdownBody
        frontmatter {
          date
          title
        }
      }
      base
      ext
      fields {
        slug
      }
      name
      relativeDirectory
      relativePath
    }
  }
}`;

const queries = [
  {
    query: dataForAlgoliaIndexQuery,
    transformer: ({ data }: any) => data.allFile.nodes, // optional
    indexName: "fs-docs", // overrides main index name, optional
    settings: {
      // optional, any index settings
      // Note: by supplying settings, you will overwrite all existing settings on the index
    },
    matchFields: ["slug", "modified"], // Array<String> overrides main match fields, optional
    mergeSettings: false, // optional, defaults to false. See notes on mergeSettings below
    queryVariables: {}, // optional. Allows you to use graphql query variables in the query
  },
];

const config: GatsbyConfig = {
  siteMetadata: {
    title: `FS Docs`,
    siteUrl: `https://brain.huakunshen.com`,
    notesAbsRoot: path.resolve("./PATH"),
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    {
      resolve: "gatsby-plugin-exclude",
      options: { paths: ["**/.git", "**/.git/*"] },
    },
    "gatsby-plugin-sass",
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "G-TGCKB63KWS",
      },
    },
    "gatsby-plugin-image",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    "gatsby-plugin-mdx",
    {
      resolve: "gatsby-transformer-remark",
      options: {
        footnotes: true,
        // GitHub Flavored Markdown mode (default: true)
        gfm: true,
        plugins: [],
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          "gatsby-remark-mermaid",
          "gatsby-remark-autolink-headers",
          "gatsby-remark-copy-linked-files",
          "gatsby-remark-responsive-iframe",
          {
            resolve: `gatsby-remark-highlight-code`,
            options: {
              lineNumbers: true,
              editable: false
            }
          },
          // {
          //   resolve: `gatsby-remark-vscode`,
          //   options: {
          //     // theme: "Dark+ (default dark)"
          //     theme: "Atom One Dark",
          //     extensions: ["vscode-theme-onedark"],
          //   },
          // },
          {
            resolve: `gatsby-remark-katex`,
            options: {
              // Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
              strict: `ignore`,
            },
          },
          // {
          //   resolve: `gatsby-remark-prismjs`,
          //   options: {
          //     // This is used to allow setting a language for inline code
          //     // (i.e. single backticks) by creating a separator.
          //     // This separator is a string and will do no white-space
          //     // stripping.
          //     // A suggested value for English speakers is the non-ascii
          //     // character '›'.
          //     inlineCodeMarker: null,
          //     // This lets you set up language aliases.  For example,
          //     // setting this to '{ sh: "bash" }' will let you use
          //     // the language "sh" which will highlight using the
          //     // bash highlighter.
          //     aliases: {},
          //     // This toggles the display of line numbers globally alongside the code.
          //     // To use it, add the following line in gatsby-browser.js
          //     // right after importing the prism color scheme:
          //     //  require("prismjs/plugins/line-numbers/prism-line-numbers.css")
          //     // Defaults to false.
          //     // If you wish to only show line numbers on certain code blocks,
          //     // leave false and use the {numberLines: true} syntax below
          //     showLineNumbers: true,
          //     // If setting this to true, the parser won't handle and highlight inline
          //     // code used in markdown i.e. single backtick code like `this`.
          //     noInlineHighlight: false,
          //     // This adds a new language definition to Prism or extend an already
          //     // existing language definition. More details on this option can be
          //     // found under the header "Add new language definition or extend an
          //     // existing language" below.
          //     languageExtensions: [
          //       {
          //         language: "superscript",
          //         extend: "javascript",
          //         definition: {
          //           superscript_types: /(SuperType)/,
          //         },
          //         insertBefore: {
          //           function: {
          //             superscript_keywords: /(superif|superelse)/,
          //           },
          //         },
          //       },
          //     ],
          //     // Customize the prompt used in shell output
          //     // Values below are default
          //     prompt: {
          //       user: "root",
          //       host: "localhost",
          //       global: false,
          //     },
          //     // By default the HTML entities <>&'" are escaped.
          //     // Add additional HTML escapes by providing a mapping
          //     // of HTML entities and their escape value IE: { '}': '&#123;' }
          //     escapeEntities: {},
          //   },
          // },
          {
            resolve: `gatsby-remark-images`,
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 590,
            },
          },
        ],
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "PATH",
        path: "./PATH",
        ignore: [`**/\.*`, `**/\.git`, `**/\.git/*`],
      },
    },
    {
      // This plugin must be placed last in your list of plugins to ensure that it can query all the GraphQL data
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.ALGOLIA_APP_ID,
        // Use Admin API key without GATSBY_ prefix, so that the key isn't exposed in the application
        // Tip: use Search API key with GATSBY_ prefix to access the service from within components
        apiKey: process.env.ALGOLIA_API_KEY,
        indexName: process.env.ALGOLIA_INDEX_NAME, // for all queries
        queries,
        chunkSize: 10000, // default: 1000
        settings: {
          // optional, any index settings
          // Note: by supplying settings, you will overwrite all existing settings on the index
        },
        enablePartialUpdates: true, // default: false
        matchFields: ["slug", "modified"], // Array<String> default: ['modified']
        concurrentQueries: false, // default: true
        skipIndexing: true, // default: false, useful for e.g. preview deploys or local development
        continueOnFailure: false, // default: false, don't fail the build if algolia indexing fails
        algoliasearchOptions: undefined, // default: { timeouts: { connect: 1, read: 30, write: 30 } }, pass any different options to the algoliasearch constructor
      },
    },
  ],
};

export default config;
