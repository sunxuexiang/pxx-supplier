import React from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';

export default class SelectGroup extends React.PureComponent<any, any> {
  props: SelectProps & { children?: any; label?: string };

  render() {
    const { label, children, ...rest } = this.props;
    return (
      <div className="ant-input-wrapper ant-input-group select-group">
        <span className="ant-input-group-addon">{this.props.label}</span>
        <Select {...rest}>{children}</Select>
      </div>
    );
  }
}
