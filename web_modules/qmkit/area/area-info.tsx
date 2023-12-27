import React from 'react';
import provinces from './provinces.json';
import cities from './cities.json';
import areas from './areas.json';
import { fromJS } from 'immutable';

/**
 * 省市区字符串 返回 `江苏省南京市雨花台区`
 */
export default class AreaInfo extends React.Component<any, any> {
  props: {
    provinceCode?: string;
    cityCode?: string;
    areaCode?: string;
  };

  constructor(props) {
    super(props);
  }

  render() {
    const province =
      this.props.provinceCode &&
      fromJS(provinces).find(
        province => province.get('code') === this.props.provinceCode
      );
    const provinceName = province ? province.get('name') : '';
    const city =
      this.props.cityCode &&
      fromJS(cities).find(city => city.get('code') === this.props.cityCode);
    const cityName = city ? city.get('name') : '';
    const area =
      this.props.areaCode &&
      fromJS(areas).find(area => area.get('code') === this.props.areaCode);
    const areaName = area ? area.get('name') : '';

    return (
      <label {...this.props}>{`${provinceName}${cityName}${areaName}`}</label>
    );
  }
}
