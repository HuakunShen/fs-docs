interface Props {
  pageTitle: string;
  children: React.ReactNode;
}
import React, { useEffect, useState, createContext } from "react";
import "../styles/Main.css";
import { Button, Layout, Menu, Breadcrumb, Spin } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { construct, FileNode, GqlNode as Node } from "../util/file-tree";
import { useStaticQuery, graphql, Link } from "gatsby";
import type { MenuProps } from "antd/es/menu";
import { useSettingStore } from "../stores/setting";
import { DocSearch } from "@docsearch/react";
import "@docsearch/css";
import { Helmet } from "react-helmet";
import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader";
import "../styles/App.css";

const { Header, Content, Footer, Sider } = Layout;
deckDeckGoHighlightElement();
type GqlNode = {
  node: Node;
};

/**
 * Starting from version 4.20, Antd's menu no longer uses children, but items props.
 * I have to turn my constructed tree into the version antd accepts
 */
type MenuItem = Required<MenuProps>["items"][number];
const transformTree = (tree: FileNode): MenuItem => {
  if (!tree) return tree;
  const children = tree.children.map((node) => transformTree(node));
  return {
    label: children.length ? (
      tree.filename
    ) : (
      <Link to={`${tree.slug}`}>{tree.filename}</Link>
    ),
    key: tree.slug,
    children: children.length ? children : undefined,
  };
};

const FSLayout = ({ pageTitle, children }: Props) => {
  const [siderWidth, setSiderWidth] = useState<number>(300); // TODO: set this value based on the file tree height
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [tree, setTree] = useState<FileNode | null>(null);
  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };
  const settingStore = useSettingStore();

  const onOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
    settingStore.setOpenKeys(keys);
  };

  const data = useStaticQuery(graphql`
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

  // initialize the file tree
  useEffect(() => {
    const constructedTree = construct(
      data.allFile.edges.map((node: GqlNode) => node.node)
    );
    setTree(constructedTree);
    setOpenKeys(settingStore.openKeys);
  }, []);

  // update sider width when tree is updated
  useEffect(() => {
    if (collapsed || !tree) {
      setSiderWidth(80);
    } else {
      setSiderWidth(tree.height * 50);
    }
  }, [tree, collapsed]);

  return (
    <Layout hasSider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{pageTitle}</title>
        <link
          rel="preconnect"
          href={`https://${process.env.ALGOLIA_APP_ID}-dsn.algolia.net`}
          crossOrigin="anonymous"
        />
      </Helmet>
      <Sider
        width={siderWidth}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        // collapsedWidth={0}
      >
        <span className="sticky top-2">
          <DocSearch
            appId={process.env.ALGOLIA_APP_ID || ""}
            indexName={process.env.ALGOLIA_INDEX_NAME || ""}
            apiKey={process.env.ALGOLIA_SEARCH_ONLY_KEY || ""}
          />
        </span>
        <Menu
          items={tree?.children[0].children.map((node) => transformTree(node))}
          mode="inline"
          theme="dark"
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          // style={{width: `${siderWidth}px`}}
        />
      </Sider>
      <Layout
        className="site-layout transform duration-300"
        style={{ marginLeft: siderWidth }}
      >
        {/* <Header className="site-layout-background" style={{ padding: 0 }} /> */}
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          {/* <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="site-layout-background" style={{ padding: 24 }}>
            <main>{children}</main>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          FS Docs ©2022 Created by Huakun Shen
        </Footer>
      </Layout>
    </Layout>
  );
};
export default FSLayout;
