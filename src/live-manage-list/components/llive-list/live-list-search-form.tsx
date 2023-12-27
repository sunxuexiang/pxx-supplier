import React from 'react';
import { Button, Form, Input, DatePicker, Select } from 'antd';
import { Relax } from 'plume2';
import { noop, SelectGroup, Const } from 'qmkit';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      searchData: any;
      queryPage: Function;
      onFormFieldChange: Function;
    };
  };

  static relaxProps = {
    queryPage: noop,

    onFormFieldChange: noop,
    searchData: 'searchData'
  };

  constructor(props) {
    super(props);
    this.state = {
      startValue: null,
      endValue: null,
      time: []
    };
  }

  render() {
    const { queryPage, onFormFieldChange, searchData } = this.props.relaxProps;

    // const { startValue, endValue } = this.state;

    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            addonBefore={'直播标题'}
            value={searchData.get('roomName')}
            onChange={(e) => {
              onFormFieldChange('roomName', e.target.value);
            }}
          />
        </FormItem>
        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="状态"
            value={searchData.get('liveStatus')}
            onChange={(value) => {
              onFormFieldChange('liveStatus', value);
            }}
          >
            <Select.Option key="" value="">
              全部
            </Select.Option>
            <Select.Option key="0" value="0">
              未开始
            </Select.Option>
            <Select.Option key="1" value="1">
              直播中
            </Select.Option>
            <Select.Option key="2" value="2">
              已结束
            </Select.Option>
          </SelectGroup>
        </FormItem>
        <FormItem style={{ marginTop: 2 }}>
          <RangePicker
            getCalendarContainer={() => document.getElementById('page-content')}
            value={searchData.get('startTime') ? this.state.time : []}
            onChange={(e) => {
              let beginTime = null;
              let endTime = null;
              if (e.length > 0) {
                this.setState({ time: e });
                beginTime = e[0].format(Const.DAY_FORMAT);
                endTime = e[1].format(Const.DAY_FORMAT);
              } else {
                this.setState({ time: [] });
              }
              onFormFieldChange('startTime', beginTime);
              onFormFieldChange('endTime', endTime);
            }}
          />
        </FormItem>
        {/* <FormItem>
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
        </FormItem> */}
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
