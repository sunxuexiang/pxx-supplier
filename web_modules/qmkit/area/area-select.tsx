import React from 'react';
import options from './cascader-address-option';
import { Cascader } from 'antd';

/**
 * 地址组件
 */
export default class AreaSelect extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    const { hasNoArea, placeholder, ...rest } = this.props;
    if (hasNoArea) {
      for (let i = 0; i < options.length; i++) {
        if (options[i]['children']) {
          for (let j = 0; j < options[i]['children'].length; j++) {
            let temp = options[i]['children'][j];
            if (temp.hasOwnProperty('children')) {
              delete temp.children;
            }
          }
        }
      }
    }
    return (
      <div
        className={
          this.props.label
            ? 'ant-input-wrapper ant-input-group select-group areafix'
            : null
        }
      >
        {this.props.label ? (
          <span className="ant-input-group-addon">{this.props.label}</span>
        ) : null}
        <Cascader
          options={options}
          placeholder={placeholder ? placeholder : '请选择地址'}
          style={{ top: 0, marginTop: 4 }}
          {...rest}
        />
      </div>
    );
  }
}
