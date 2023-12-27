import { Tree } from 'antd';
import React from 'react';

export function IMSettingMenuList(props) {
  const listItems = [
    {
      title: '快捷回复设置',
      key: 0
    },
    {
      title: '离线消息设置',
      key: 1
    },
    {
      title: '会话上限设置',
      key: 2
    },
    {
      title: '客服账号管理',
      key: 3
    }
  ];

  const renderTreeNodes = (data: Array<any>) => {
    return data.map((item) => {
      return (
        <Tree.TreeNode key={item.key} {...item} dataRef={item}></Tree.TreeNode>
      );
    });
  };

  return (
    <Tree
      selectedKeys={props.selectKeys}
      defaultSelectedKeys={props.selectKeys}
      onSelect={props.onSelect}
    >
      {renderTreeNodes(listItems)}
    </Tree>
  );
}
