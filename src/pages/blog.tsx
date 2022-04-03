import * as React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
import { MDXRenderer } from 'gatsby-plugin-mdx';
interface MdxNode {
  frontmatter: {
    date: string;
    title: string;
  };
  id: string;
  body: string;
}

const BlogPage = ({ data }: any) => {
  return (
    <Layout pageTitle="My Blog Posts">
      {data.allMdx.nodes.map((node: MdxNode) => (
        <article key={node.id}>
          <h2>{node.frontmatter.title}</h2>
          <p>Posted: {node.frontmatter.date}</p>
          <MDXRenderer>{node.body}</MDXRenderer>
        </article>
      ))}
    </Layout>
  );
};

export const query = graphql`
  query {
    allMdx(sort: { fields: frontmatter___date, order: DESC }) {
      nodes {
        frontmatter {
          date(formatString: "MMMM D, YYYY")
          title
        }
        id
        body
      }
    }
  }
`;
export default BlogPage;
