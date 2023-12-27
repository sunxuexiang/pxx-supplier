import React from 'react';
import { Button, Form, Input, DatePicker } from 'antd';
import { Relax } from 'plume2';
import { noop, Const } from 'qmkit';
import styled from 'styled-components';
import { IMap } from 'plume2/es5/typings';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

const DueTo = styled.div`
  display: inline-block;
  .ant-form-item-label label:after {
    content: none;
  }
  .ant-form-item-label {
    height: 40px;
  }
  .ant-form-item-label label {
    display: table-cell;
    padding: 0 11px;
    font-size: 14px;
    font-weight: normal;
    line-height: 1;
    color: #000000a6;
    text-align: center;
    background-color: #fafafa;
    border: 1px solid #d9d9d9;
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
    position: relative;
    transition: all 0.3s;
    border-right: 0;
    height: 32px;
    vertical-align: middle;
    top: 4px;
  }
  .ant-form-item-control-wrapper {
    width: 211px;
  }
  .ant-form-item-control-wrapper .ant-input {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    width: 211px;
  }
  .ant-form-item-control-wrapper .ant-form-item-children {
    width: 211px;
  }
`;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      queryPage: Function;
      onFormFieldChange: Function;
    };
  };

  static relaxProps = {
    queryPage: noop,
    onFormFieldChange: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      startValue: null,
      endValue: null
    };
  }

  render() {
    const { queryPage, onFormFieldChange } = this.props.relaxProps;
    const { startValue, endValue } = this.state;

    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            addonBefore={'直播名称'}
            onChange={(e) => {
              onFormFieldChange('name', e.target.value);
            }}
          />
        </FormItem>
        <FormItem>
          <Input
            addonBefore={'主播昵称'}
            onChange={(e) => {
              onFormFieldChange('anchorName', e.target.value);
            }}
          />
        </FormItem>
        <FormItem>
          <DatePicker
            allowClear={true}
            disabledDate={this.disabledStartDate}
            format="YYYY-MM-DD HH:mm"
            value={startValue}
            placeholder="开始时间"
            onChange={this.onStartChange}
            showToday={false}
            showTime
          />
        </FormItem>
        <FormItem>
          <DatePicker
            allowClear={true}
            disabledDate={this.disabledEndDate}
            format="YYYY-MM-DD HH:mm"
            value={endValue}
            placeholder="结束时间"
            onChange={this.onEndChange}
            showToday={false}
            showTime
          />
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            icon="search"
            onClick={() => {
              queryPage();
            }}
          >
            搜索
          </Button>
        </FormItem>
      </Form>
    );
  }

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  onStartChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format('YYYY-MM-DD HH:mm:ss');
    }
    const { onFormFieldChange } = this.props.relaxProps;
    onFormFieldChange('startTime', time);
    this.onChange('startValue', value);
  };

  onEndChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format('YYYY-MM-DD HH:mm:ss');
    }
    const { onFormFieldChange } = this.props.relaxProps;
    onFormFieldChange('endTime', time);
    this.onChange('endValue', value);
  };
}
