import React from 'react';
import { DatePicker } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';

const RangerPicker = DatePicker.RangePicker;

export default class DatePickerLaber extends React.PureComponent<any, any> {
  props: RangePickerProps & { children?: any; label?: string };

  render() {
    const { label, children, ...rest } = this.props;
    return (
      <div
        className="ant-input-wrapper ant-input-group select-group"
        style={{ lineHeight: '0.5',display: 'table' }}
      >
        <span className="ant-input-group-addon">{this.props.label}</span>
        <RangerPicker {...rest}>{children}</RangerPicker>
      </div>
    );
  }
}
