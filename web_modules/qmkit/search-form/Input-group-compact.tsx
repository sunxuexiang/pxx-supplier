import React from 'react';
import { Input, InputNumber } from 'antd';
import './css/style.less';

const InputGroup = Input.Group;

export default class InputGroupCompact extends React.PureComponent<any, any> {
  props: {
    title?: string;
    startMin?: number;
    startMax?: number;
    start: number;
    onStartChange?: Function;
    endMin?: number;
    endMax?: number;
    end: number;
    onEndChange?: Function;
    //数值精度
    precision?: number;
  };

  render() {
    const {
      title,
      startMin,
      startMax,
      start,
      onStartChange,
      endMin,
      end,
      endMax,
      onEndChange,
      precision
    } = this.props;
    return (
      <InputGroup compact>
        <span className="inputGroupTitle">{title}</span>
        <InputNumber
          className="inputGroupMin"
          value={start}
          min={startMin}
          max={startMax}
          precision={precision ? precision : 0}
          onChange={(value: number | string) => onStartChange(value)}
        />
        <Input className="inputGroupLabel" placeholder="~" disabled />
        <InputNumber
          className="inputGroupMax"
          precision={precision ? precision : 0}
          value={end}
          min={endMin}
          max={endMax}
          onChange={(value: number | string) => onEndChange(value)}
        />
      </InputGroup>
    );
  }
}
