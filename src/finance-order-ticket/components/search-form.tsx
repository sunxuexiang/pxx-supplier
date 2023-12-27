import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Button, Select, DatePicker } from 'antd';
import { SelectGroup, noop, Const } from 'qmkit';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      searchForm: any;
      onFormChange: Function;
      onSearch: Function;
    };
  };

  static relaxProps = {
    searchForm: 'searchForm',
    onFormChange: noop,
    onSearch: noop
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { onFormChange, searchForm, onSearch } = this.props.relaxProps;

    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            addonBefore="客户名称"
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'customerName',
                value
              });
            }}
            value={searchForm.get('customerName')}
          />
        </FormItem>
        <FormItem>
          <Input
            addonBefore="订单号"
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'orderNo',
                value
              });
            }}
            value={searchForm.get('orderNo')}
          />
        </FormItem>
        {/* <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="付款状态"
            style={{ width: 80 }}
            onChange={(e) => {
              onFormChange({
                field: 'payOrderStatus',
                value: e
              });
            }}
            defaultValue={''}
          >
            <Option value={null}>全部</Option>
            <Option value="0">已付款</Option>
            <Option value="2">待确认</Option>
            <Option value="1">未付款</Option>
          </SelectGroup>
        </FormItem> */}
        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="开票状态"
            style={{ width: 80 }}
            onChange={(e) => {
              onFormChange({
                field: 'invoiceState',
                value: e
              });
            }}
            defaultValue={''}
          >
            <Option value={null}>全部</Option>
            <Option value="1">已开票</Option>
            <Option value="0">待开票</Option>
          </SelectGroup>
        </FormItem>
        {/* <br /> */}
        <FormItem>
          <RangePicker
            onChange={(e) => {
              let beginTime = '';
              let endTime = '';
              if (e.length > 0) {
                beginTime = e[0].format(Const.DAY_FORMAT);
                endTime = e[1].format(Const.DAY_FORMAT);
              }
              onFormChange({
                field: 'beginTime',
                value: beginTime
              });
              onFormChange({
                field: 'endTime',
                value: endTime
              });
            }}
          />
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            icon="search"
            onClick={(e) => {
              e.preventDefault();
              onSearch();
            }}
          >
            搜索
          </Button>
        </FormItem>
      </Form>
    );
  }
}
