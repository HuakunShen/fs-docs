interface Props {
  pageTitle: string;
  children: React.ReactNode;
}
import React, { useEffect, useState } from "react";
import "../styles/App.css";
import "../styles/Main.css";
import { Layout, Menu, Switch, Divider, Breadcrumb } from "antd";
import { construct, FileNode, GqlNode as Node } from "../util/file-tree";
import {
  MailOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  SettingOutlined,
  CaretRightFilled,
  CaretDownFilled,
  LinkOutlined,
  FileOutlined,
} from "@ant-design/icons";
import Fstree from "./fs-tree";
import DirectoryTree from "./directory-tree";
import { useStaticQuery, graphql, Link } from "gatsby";
import type { MenuProps, MenuTheme } from "antd/es/menu";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

type GqlNode = {
  node: Node;
};

/**
 * What does a menu tree need?
 * Each node requires
 * - a unique key
 * - potentially an icon
 * - title (name)
 *
 * Sample Structure
 * Menu
 * 	Menu.Item
 * 	SubMenu
 * 		Menu.Item
 * 		SubMenu
 * 			Menu.Item
 */

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
      <Link to={tree.slug}>tree.filename</Link>
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

  const onOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
    // const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    // if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
    //   setOpenKeys(keys);
    // } else {
    //   setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    // }
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
    setTree(construct(data.allFile.edges.map((node: GqlNode) => node.node)));
  }, []);

  // update sider width when tree is updated
  useEffect(() => {
    console.log(tree);
    if (tree) console.log(transformTree(tree));
    if (tree) setSiderWidth(tree.height * 70);
  }, [tree]);

  // watch openKeys (menu items open)
  useEffect(() => {
    console.log(openKeys);
  }, [openKeys]);

  const constructMenuTree = (_tree: FileNode | null) => {
    if (!_tree) return null;
    if (_tree.height === 0) {
      // is leaf file or dir
      return (
        <Menu.Item key={_tree.slug} icon={<FileOutlined />}>
          <Link to={_tree.slug}>{_tree.filename}</Link>
        </Menu.Item>
      );
    } else if (_tree.depth === 0) {
      // is top level root node
      return (
        <Menu
          mode="inline"
          theme="dark"
          openKeys={openKeys}
          onOpenChange={onOpenChange}
        >
          {_tree.children.map((child: FileNode) => constructMenuTree(child))}
        </Menu>
      );
    } else {
      // internal node
      const isOpen = () => {
        return !!tree ? openKeys.includes(_tree.slug) : false;
      };
      return (
        <SubMenu
          key={_tree.slug}
          icon={isOpen() ? <CaretDownFilled /> : <CaretRightFilled />}
          title={_tree.filename}
        >
          {_tree.children.map((child: FileNode) => constructMenuTree(child))}
        </SubMenu>
      );
    }
  };
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
        {/* {constructMenuTree(tree)} */}
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
