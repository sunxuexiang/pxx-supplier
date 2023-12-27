import * as React from 'react';
import { Relax } from 'plume2';
import { List } from 'immutable';
import { Tree } from 'antd';
import { noop } from 'qmkit';

declare type IList = List<any>;
const TreeNode = Tree.TreeNode;
const styles = {
  title: {
    backgroundColor: '#f7f7f7',
    color: '#333',
    height: '30px',
    lineHeight: '30px',
    textAlign: 'center'
  }
} as any;

@Relax
export default class CateList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      cateList: IList; //分类列表
      expandedKeys: any; //树形结构展开节点
      defaultCheckedKeys: any; //默认选中节点

      selectImageCate: Function; //选中图片分类
      queryImagePage: Function; //查询图片分页列表
      onExpandCate: Function; //展开收起分类方法
    };
  };

  static relaxProps = {
    cateList: 'cateList',
    expandedKeys: 'expandedKeys',
    defaultCheckedKeys: 'defaultCheckedKeys',

    selectImageCate: noop,
    queryImagePage: noop,
    onExpandCate: noop
  };

  render() {
    const {
      cateList,
      expandedKeys,
      defaultCheckedKeys
    } = this.props.relaxProps;
    //分类列表生成树形结构
    const loop = cateList =>
      cateList.map(item => {
        if (item.get('children') && item.get('children').count()) {
          return (
            <TreeNode
              key={item.get('cateId')}
              value={item.get('cateId').toString()}
              title={item.get('cateName')}
            >
              {loop(item.get('children'))}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item.get('cateId')}
            value={item.get('cateId').toString()}
            title={item.get('cateName')}
          />
        );
      });

    return (
      <div>
        <div style={styles.title}>图片目录</div>
        <Tree
          className="draggable-tree"
          autoExpandParent={false}
          expandedKeys={expandedKeys.toJS()}
          defaultSelectedKeys={defaultCheckedKeys.toJS()}
          selectedKeys={defaultCheckedKeys.toJS()}
          onSelect={this._select}
          onExpand={this._expand}
        >
          {loop(cateList)}
        </Tree>
      </div>
    );
  }

  /**
   * 选择分类
   * @param value 选中的id
   * @private
   */
  _select = value => {
    const { selectImageCate, queryImagePage } = this.props.relaxProps;
    //记录选中的分类，以便后续的分页查询
    const cateId = value[0];
    // 至少得有一个目录选中。判断是否有选中的目录编号
    if (cateId || cateId == 0) {
      selectImageCate(cateId);
      queryImagePage();
    }
  };

  /**
   * 展开/收起分类
   * @param expandedKeys
   * @private
   */
  _expand = expandedKeys => {
    const { onExpandCate } = this.props.relaxProps;
    onExpandCate(expandedKeys);
  };
}
