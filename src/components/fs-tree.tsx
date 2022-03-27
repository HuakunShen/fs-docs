import * as React from 'react';
import { Tree, Input, Menu } from 'antd';

const { Search } = Input;

type Tns = {
  title: string;
  key: string;
  children?: Tns[];
};

const x = 3;
const y = 2;
const z = 1;
const gData: Tns[] = [];

const generateData = (
  _level: number,
  _preKey: string | undefined = undefined,
  _tns: Tns[] | undefined = undefined
) => {
  const preKey = _preKey || '0';
  const tns: Tns[] = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key, children: [] });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

const dataList: Tns[] = [];
const generateList = (data: Tns[]) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key } = node;
    dataList.push({ key, title: key });
    if (node.children) {
      generateList(node.children);
    }
  }
};
generateList(gData);

const getParentKey = (key: string, tree: Tns[]): string => {
  let parentKey: string = '';
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};
type Key = string | number;
class SearchTree extends React.Component {
  state = {
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
  };

  onExpand = (expandedKeys: any) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    interface T {
      value: string;
    }
    const { value }: T = (e.target || { value: '' }) as T;
    const expandedKeys = dataList
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, gData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };
  onSelect = (selectedKeys: Key[], info: any) => {
		console.log(selectedKeys)
	};
  render() {
    const { searchValue, expandedKeys, autoExpandParent } = this.state;
    const loop = (data: any) =>
      data.map((item: any) => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substring(0, index);
        const afterStr = item.title.slice(index + searchValue.length);

        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key,
        };
      });
    console.log(loop(gData));
    return (
      <div>
        <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
        <Tree
          blockNode
          selectable
          onExpand={this.onExpand}
          onSelect={this.onSelect}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          treeData={loop(gData)}
        />
      </div>
    );
  }
}

export default SearchTree;
