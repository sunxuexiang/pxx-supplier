import * as React from 'react';
import { Relax } from 'plume2';
import { List } from 'immutable';
import { Icon } from 'antd';
import { noop } from 'qmkit';

import '../index.less';

declare type IList = List<any>;

@Relax
export default class CateList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      cateList: IList; //分类列表
      expandedKeys: any; //树形结构展开节点
      defaultCheckedKey: any; //默认选中节点

      selectVideoCate: Function; //选中视频分类
      onExpandCate: Function; //展开收起分类方法
    };
  };

  static relaxProps = {
    cateList: 'cateList',
    expandedKeys: 'expandedKeys',
    defaultCheckedKey: 'defaultCheckedKey',

    selectVideoCate: noop,
    onExpandCate: noop
  };

  render() {
    const { cateList, expandedKeys, defaultCheckedKey } = this.props.relaxProps;
    return (
      <div>
        <div className="vt-title">教程分类</div>
        <div className="vt-menu">
          {this.renderList(cateList ? cateList.toJS() : [])}
        </div>
      </div>
    );
  }

  renderList = (list) => {
    const { expandedKeys, defaultCheckedKey } = this.props.relaxProps;
    return list.map((item) => {
      let isExpand = false;
      if (
        expandedKeys &&
        expandedKeys.toJS() &&
        expandedKeys.toJS().length > 0
      ) {
        isExpand = expandedKeys.toJS().includes(item.cateId);
      }

      const level = item.cateGrade;

      if (item.children) {
        return (
          <div>
            <div
              onClick={() => this._select(item.cateId)}
              className={`vt-menu-item ${
                defaultCheckedKey === item.cateId ? 'vt-menu-item-selected' : ''
              } ${isExpand ? 'vt-menu-item-expanded' : ''}`}
              style={{ paddingLeft: `${(level - 1) * 24}px` }}
            >
              <span>{item.cateName}</span>
              {item.children && item.children.length > 0 && (
                <Icon type="right" />
              )}
            </div>
            <div
              style={isExpand ? {} : { display: 'none' }}
              className="vt-menu-child"
            >
              {this.renderList(item.children)}
            </div>
          </div>
        );
      } else {
        return (
          <div
            onClick={() => this._select(item.cateId)}
            className={`vt-menu-item ${
              defaultCheckedKey === item.cateId ? 'vt-menu-item-selected' : ''
            }`}
            style={{ paddingLeft: `${(level - 1) * 24}px` }}
          >
            <span>{item.cateName}</span>
          </div>
        );
      }
    });
  };

  /**
   * 选择分类
   * @param value 选中的id
   * @private
   */
  _select = (cateId) => {
    const { selectVideoCate } = this.props.relaxProps;
    this._expand(cateId);
    selectVideoCate(cateId);
  };

  /**
   * 展开/收起分类
   * @param expandedKeys
   * @private
   */
  _expand = (expandedKey) => {
    const { onExpandCate, expandedKeys } = this.props.relaxProps;
    let keys = expandedKeys.toJS();
    if (keys.includes(expandedKey)) {
      keys = keys.filter((item) => item !== expandedKey);
    } else {
      keys.push(expandedKey);
    }
    console.log(keys, 'keys');
    onExpandCate(keys);
  };
}
