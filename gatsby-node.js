const { createFilePath } = require(`gatsby-source-filesystem`);
const path = require("path");

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.relativePath) {
    const slug = createFilePath({ node, getNode, basePath: `notes` });
    createNodeField({
      node,
      name: `slug`,
      value: node.relativePath,
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
  console.log(data.allFile.edges);
  data.allFile.edges.forEach(edge => {
    console.log(`/notes${edge.node.fields.slug}`)
    actions.createPage({
      path: "/notes/" + edge.node.fields.slug,
      component: path.resolve("./src/templates/doc.js"),
      context: { slug: edge.node.fields.slug },
    });
  });
};
