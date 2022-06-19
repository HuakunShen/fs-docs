import React from "react";
import { graphql } from "gatsby";

const doc = ({ data }: any) => {
  const markdown = data.file.childMarkdownRemark;
  const { ext } = data.file;
  let htmlContent = "";
  if (ext === ".md") {
    htmlContent = markdown.html;
  } else {
    htmlContent = "<h1>File Type Not Handled</h1>";
  }

  return (
    <div className="doc grid md:grid-cols-12 sm:grid-cols-1">
      <div className="col-span-9 md:order-first sm:order-last">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
      {markdown && markdown.tableOfContents && (
        <div className="col-span-3">
          <div className="toc sticky top-5" dangerouslySetInnerHTML={{ __html: markdown.tableOfContents }} />
        </div>
      )}
    </div>
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
        frontmatter {
          date
          title
        }
        tableOfContents
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
