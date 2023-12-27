import React from 'react';
import { AutoComplete } from 'antd';
import { AutoCompleteProps } from 'antd/lib/auto-complete';

export default class AutoCompleteGroup extends React.PureComponent<any, any> {
  props: AutoCompleteProps & { label?: string };

  render() {
    const { label, ...rest } = this.props;
    return (
      <div className="ant-input-group ant-input-group-compact">
        <span
          className="ant-input-group-addon"
          style={{ lineHeight: '30px', width: 'auto' }}
        >
          {label}
        </span>
        <AutoComplete {...rest} />
      </div>
    );
  }
}
