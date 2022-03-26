import * as React from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';

interface PropsType {
  pageTitle: string;
  children: JSX.Element;
}

interface Filenode {
  name: string;
  relativePath: string;
}

interface MdxNode {
	id: string;
	frontmatter: {
		title: string;
		date: string;
	}
}

const Layout = ({ pageTitle, children }: PropsType) => {
  const data = useStaticQuery(graphql`
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
  `);
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
      <main>
        <h1>{pageTitle}</h1>
        {children}
        <ul>
          {data.allMdx.nodes.map((node: MdxNode) => (
            <article key={node.id}>
              <h2>{node.frontmatter.title}</h2>
              <p>Posted: {node.frontmatter.date}</p>
            </article>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default Layout;
