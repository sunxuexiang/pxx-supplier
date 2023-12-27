import React from 'react';

import { Relax } from 'plume2';
import { Button, DatePicker, Form, Input, Select } from 'antd';
import { Const, noop, SelectGroup, util } from 'qmkit';
import { IList, IMap } from 'typings/globalType';
import styled from 'styled-components';

const SelectBox = styled.div`
  .ant-select-dropdown-menu-item,
  .ant-select-selection-selected-value {
    max-width: 142px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const Option = Select.Option;

const FormItem = Form.Item;
@Relax
export default class SearchHead extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form: IMap;
      levelList: IList;

      onFormFieldChange: Function;
      search: Function;
    };
  };

  static relaxProps = {
    form: 'form',
    levelList: 'levelList',

    onFormFieldChange: noop,
    search: noop
  };

  state = {
    startValue: null,
    endValue: null,
    endOpen: false
  };

  render() {
    const { form, onFormFieldChange, search, levelList } =
      this.props.relaxProps;
    const { startValue, endValue } = this.state;
    const wareHouseVOPage =
      JSON.parse(localStorage.getItem('wareHouseVOPage')) || [];
    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            addonBefore="活动名称"
            value={form.get('activityName')}
            onChange={(e: any) => {
              onFormFieldChange('activityName', e.target.value);
            }}
          />
        </FormItem>

        {/* <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="活动类型"
            defaultValue="不限"
            onChange={(value) => {
              onFormFieldChange('couponActivityType', value);
            }}
          >
            <Select.Option key="-1" value="-1">
              不限
            </Select.Option>
            <Select.Option key="0" value="0">
              全款囤货
            </Select.Option>
          </SelectGroup>
        </FormItem> */}

        {/* <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="目标客户"
            defaultValue="不限"
            onChange={(value) => {
              onFormFieldChange('joinLevel', value);
            }}
          >
            <Select.Option key="-3" value="-3">
              不限
            </Select.Option>
            <Select.Option key="-1" value="-1">
              {util.isThirdStore() ? '全部客户' : '全平台客户'}
            </Select.Option>
            {util.isThirdStore() && (
              <Select.Option key="0" value="0">
                全部等级
              </Select.Option>
            )}
            {levelList &&
              levelList.map((item) => {
                return (
                  <Select.Option key={item.get('key')} value={item.get('key')}>
                    {item.get('value')}
                  </Select.Option>
                );
              })}
            <Select.Option key="-2" value="-2">
              指定客户
            </Select.Option>
          </SelectGroup>
        </FormItem> */}

        <FormItem>
          <DatePicker
            allowClear={true}
            disabledDate={this.disabledStartDate}
            showTime={{ format: 'HH:mm' }}
            format={Const.DATE_FORMAT}
            value={startValue}
            placeholder="开始时间"
            onChange={this.onStartChange}
            showToday={false}
          />
        </FormItem>
        <FormItem>
          <DatePicker
            allowClear={true}
            disabledDate={this.disabledEndDate}
            showTime={{ format: 'HH:mm' }}
            format={Const.DATE_FORMAT}
            value={endValue}
            placeholder="结束时间"
            onChange={this.onEndChange}
            showToday={false}
          />
        </FormItem>
        {/* <FormItem>
          <SelectBox>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="所属仓库"
              defaultValue="0"
              showSearch
              onChange={(value) => {
                onFormFieldChange('wareId', value != '0' ? value : null);
              }}
            >
              {wareHouseVOPage.map((ware) => {
                return <Option value={ware.wareId}>{ware.wareName}</Option>;
              })}
            </SelectGroup>
          </SelectBox>
        </FormItem> */}

        <FormItem>
          <Button
            htmlType="submit"
            type="primary"
            icon="search"
            onClick={(e) => {
              e.preventDefault();
              search();
            }}
          >
            搜索
          </Button>
        </FormItem>
      </Form>
    );
  }

  /**
   * 不可选择的开始日期
   */
  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  /**
   * 不可选择的结束日期
   */
  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  /**
   *改变表单字段
   */
  onChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  /**
   * 改变开始日期
   */
  onStartChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format(Const.DATE_FORMAT) + ':00';
    }
    const { onFormFieldChange } = this.props.relaxProps;
    onFormFieldChange('startTime', time);
    this.onChange('startValue', value);
  };

  /**
   * 改变结束日期
   */
  onEndChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format(Const.DATE_FORMAT) + ':00';
    }
    const { onFormFieldChange } = this.props.relaxProps;
    onFormFieldChange('endTime', time);
    this.onChange('endValue', value);
  };
}
