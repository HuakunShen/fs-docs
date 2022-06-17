interface Props {
  pageTitle: string;
  children: React.ReactNode;
}
import React, { useEffect, useState, createContext } from "react";
import "../styles/App.css";
import "../styles/Main.css";
import { Layout, Menu, Breadcrumb } from "antd";
import { construct, FileNode, GqlNode as Node } from "../util/file-tree";
import { useStaticQuery, graphql, Link } from "gatsby";
import type { MenuProps } from "antd/es/menu";
import { useSettingStore } from "../stores/setting";

const { Header, Content, Footer, Sider } = Layout;

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
    if (tree) setSiderWidth(tree.height * 70);
  }, [tree]);

  return (
    <Layout hasSider>
      <title>{pageTitle}</title>
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
      >
        <Menu
          items={tree?.children.map((node) => transformTree(node))}
          mode="inline"
          theme="dark"
          openKeys={openKeys}
          onOpenChange={onOpenChange}
        />
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: siderWidth }}>
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
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
