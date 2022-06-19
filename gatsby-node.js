const { createFilePath } = require(`gatsby-source-filesystem`);
const path = require("path");

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.relativePath) {
    const slug = createFilePath({ node, getNode, basePath: `notes` });
    // console.log(path.basename(node.relativePath))
    createNodeField({
      node,
      name: `slug`,
      value: `/PATH/${node.relativePath}`,
    });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { data } = await graphql(`
    {
      allFile {
        edges {
          node {
            ext
            fields {
              slug
            }
            name
            relativePath
          }
        }
      }
    }
  `);
  // console.log(data.allFile.edges);
  data.allFile.edges.forEach((edge) => {
    // console.log(`/PATH${edge.node.fields.slug}`);
    actions.createPage({
      path: edge.node.fields.slug,
      component: path.resolve("./src/templates/doc.tsx"),
      context: { slug: edge.node.fields.slug },
    });
  });
};
