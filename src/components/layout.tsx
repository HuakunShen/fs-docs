interface Props {
  pageTitle: string;
  children: React.ReactNode;
}

import React, { useState } from 'react';
import '../styles/App.css';
import { Layout, Menu, Switch, Divider, Breadcrumb } from 'antd';
import {
  MailOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  SettingOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import Fstree from './fs-tree';
import DirectoryTree from './directory-tree';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

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

const FSLayout = ({ pageTitle, children }: Props) => {
  const [siderWidth, setSiderWidth] = useState(300); // TODO: set this value based on the file tree height
  const [collapsed, setCollapsed] = useState(false);
  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  return (
    <Layout hasSider>
      <title>{pageTitle}</title>
      <Sider
        width={siderWidth}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
      >
        <Menu mode="inline" theme="dark">
          <Menu.Item key="1" icon={<MailOutlined />}>
            Navigation One
          </Menu.Item>
          <Menu.Item key="2" icon={<CalendarOutlined />}>
            Navigation Two
          </Menu.Item>
          <SubMenu key="sub1" icon={<AppstoreOutlined />} title="Navigation Two">
            <Menu.Item key="3">Option 3</Menu.Item>
            <Menu.Item key="4">Option 4</Menu.Item>
            <SubMenu key="sub1-2" title="Submenu">
              <Menu.Item key="5">Option 5</Menu.Item>
              <Menu.Item key="6">Option 6</Menu.Item>
            </SubMenu>
          </SubMenu>
          <SubMenu key="sub2" icon={<SettingOutlined />} title="Navigation Three">
            <Menu.Item key="7">Option 7</Menu.Item>
            <Menu.Item key="8">Option 8</Menu.Item>
            <Menu.Item key="9">Option 9</Menu.Item>
            <Menu.Item key="10">Option 10</Menu.Item>
          </SubMenu>
          <Menu.Item key="link" icon={<LinkOutlined />}>
            <a href="https://huakunshen.com" target="_blank" rel="noopener noreferrer">
              My Website
            </a>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: siderWidth }}>
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-background" style={{ padding: 24 }}>
            <main>{children}</main>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>FS Docs ©2022 Created by Huakun Shen</Footer>
      </Layout>
    </Layout>
  );
};
export default FSLayout;
