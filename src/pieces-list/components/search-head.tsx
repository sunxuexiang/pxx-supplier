import React from 'react';

import { Relax } from 'plume2';
import { DatePicker, Form, Input, Select, Button } from 'antd';
import { Const, noop, SelectGroup } from 'qmkit';
import { IMap } from 'typings/globalType';

const FormItem = Form.Item;
@Relax
export default class SearchHead extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form: IMap;
      onFormFieldChange: Function;
      search: Function;
    };
  };

  static relaxProps = {
    form: 'form',
    onFormFieldChange: noop,
    search: noop
  };

  state = {
    startValue: null,
    endValue: null,
    endOpen: false
  };

  render() {
    const { form, onFormFieldChange, search } = this.props.relaxProps;
    const { startValue, endValue } = this.state;
    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            addonBefore="省"
            placeholder="请输入省地址"
            value={form.get('provinceName')}
            onChange={(e: any) => {
              onFormFieldChange('provinceName', e.target.value);
            }}
          />
        </FormItem>
        <FormItem>
          <Input
            addonBefore="市"
            placeholder="请输入市地址"
            value={form.get('cityName')}
            onChange={(e: any) => {
              onFormFieldChange('cityName', e.target.value);
            }}
          />
        </FormItem>
        <FormItem>
          <Input
            addonBefore="区/县"
            placeholder="请输入区地址"
            value={form.get('areaName')}
            onChange={(e: any) => {
              onFormFieldChange('areaName', e.target.value);
            }}
          />
        </FormItem>
        <FormItem>
          <Input
            addonBefore="街道/乡/镇"
            placeholder="请输入街道地址"
            value={form.get('villageName')}
            onChange={(e: any) => {
              onFormFieldChange('villageName', e.target.value);
            }}
          />
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            icon="search"
            onClick={() => {
              search();
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
      time = time.format(Const.DAY_FORMAT) + ' 00:00:00';
    }
    const { onFormFieldChange } = this.props.relaxProps;
    onFormFieldChange('startTime', time);
    this.onChange('startValue', value);
  };

  onEndChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format(Const.DAY_FORMAT) + ' 23:59:59';
    }
    const { onFormFieldChange } = this.props.relaxProps;
    onFormFieldChange('endTime', time);
    this.onChange('endValue', value);
  };
}
