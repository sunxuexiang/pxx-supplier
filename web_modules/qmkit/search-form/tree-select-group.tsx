import React from 'react';
import { TreeSelect } from 'antd';
import { TreeSelectProps } from 'antd/lib/tree-select';
import './css/style.less';
export default class TreeSelectGroup extends React.PureComponent<any, any> {
  props: TreeSelectProps<any> & { children?: any; label?: string };

  render() {
    const { label, children, ...rest } = this.props;
    return (
      <div className="ant-input-wrapper ant-input-group select-group select-group-height">
        <span className="ant-input-group-addon">{label}</span>
        <TreeSelect dropdownMatchSelectWidth={false} {...rest}>
          {children}
        </TreeSelect>
      </div>
    );
  }
}
