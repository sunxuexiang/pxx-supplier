import React from 'react';
import { Cascader } from 'antd';

import provinces1 from './provinces.json';
import cities1 from './cities.json';

/**
 * 地址组件
 */
export default class CitySelect extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    cities1.forEach(city => {
      const matchProvince = provinces1.filter(
        province => province.code === city.parent_code
      )[0];
      if (matchProvince) {
        matchProvince.children = matchProvince.children || [];
        matchProvince.children.push({
          label: city.name,
          value: city.code
        });
      }
    });

    const optionsWithoutArea = provinces1.map(province => ({
      label: province.name,
      value: province.code,
      children: province.children
    }));

    return (
      <div className={this.props.label ? 'areafix' : null}>
        {this.props.label ? (
          <span className="ant-input-group-addon">{this.props.label}</span>
        ) : null}
        <Cascader
          options={optionsWithoutArea}
          placeholder={'选择客户所在地区查看'}
          {...this.props}
        />
      </div>
    );
  }
}
