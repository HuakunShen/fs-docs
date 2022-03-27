const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.relativePath) {
    const slug = createFilePath({ node, getNode, basePath: `notes` });
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });
  }
};
