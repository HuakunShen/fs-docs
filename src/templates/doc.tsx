import React, { useEffect } from "react";
import Layout from "../components/layout";
import { graphql, useStaticQuery } from "gatsby";

const doc = ({ data }: any) => {
  const markdown = data.file.childMarkdownRemark;
  const { html, wordCount } = markdown;

  return (
    <Layout pageTitle="Index Page">
      <div className="doc">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </Layout>
  );
};

export default doc;

export const query = graphql`
  query FetchMarkdownBySlug($slug: String) {
    file(fields: { slug: { eq: $slug } }) {
      relativePath
      ext
      fields {
        slug
      }
      childMarkdownRemark {
        fileAbsolutePath
        html
        htmlAst
        rawMarkdownBody
        internal {
          content
          description
          ignoreType
          mediaType
        }
        wordCount {
          words
        }
      }
      absolutePath
      childrenMarkdownRemark {
        fileAbsolutePath
      }
    }
  }
`;
