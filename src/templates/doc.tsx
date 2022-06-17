import React, { useEffect } from "react";
import Layout from "../components/layout";
import { graphql, useStaticQuery } from "gatsby";

const doc = ({ data }: any) => {
  const markdown = data.file.childMarkdownRemark;
  const {ext} = data.file
  let htmlContent = ""
  if (ext === ".md") {
    htmlContent = markdown.html
  } else {
    htmlContent = "<h1>File Type Not Handled</h1>"
  }
  
  return (
    <Layout pageTitle="Index Page">
      <div className="doc">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
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
