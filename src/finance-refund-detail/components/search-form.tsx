import React from 'react';
import { Relax } from 'plume2';
import { Button, Form, Input, Select, DatePicker } from 'antd';
import { Map, List } from 'immutable';

import { SelectGroup, Const } from 'qmkit';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      onFormChange: Function;
      onSearch: Function;
      searchForm: Map<string, any>;
      offlineAccounts: List<any>;
      channelItems: List<any>;
    };
  };

  static relaxProps = {
    onFormChange: Function,
    onSearch: Function,
    searchForm: 'searchForm',
    offlineAccounts: 'offlineAccounts',
    channelItems: 'channelItems'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { onFormChange, onSearch, searchForm } = this.props.relaxProps;

    return (
      <div>
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
              addonBefore="退单号"
              onChange={(e) => {
                const value = (e.target as any).value;
                onFormChange({
                  field: 'returnOrderCode',
                  value
                });
              }}
              value={searchForm.get('returnOrderCode')}
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore="退款流水号"
              onChange={(e) => {
                const value = (e.target as any).value;
                onFormChange({
                  field: 'refundBillCode',
                  value
                });
              }}
              value={searchForm.get('refundBillCode')}
            />
          </FormItem>
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
          <br />
          <FormItem>
            <SelectGroup
              dropdownMatchSelectWidth={false}
              getPopupContainer={() => document.getElementById('page-content')}
              label="退款方式"
              style={{ width: 80 }}
              onChange={(e) => {
                onFormChange({
                  field: 'payType',
                  value: e
                });
              }}
              defaultValue={null}
            >
              <Option value={null}>全部</Option>
              <Option value="0">线上</Option>
              <Option value="1">线下</Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <SelectGroup
              dropdownMatchSelectWidth={false}
              getPopupContainer={() => document.getElementById('page-content')}
              label="退款支付渠道"
              style={{ width: 80 }}
              onChange={(e) => {
                onFormChange({
                  field: 'payChannelId',
                  value: e
                });
              }}
              defaultValue={null}
            >
              <Option value={null}>全部</Option>
              {this._renderChannel()}
            </SelectGroup>
          </FormItem>
          <FormItem>
            <SelectGroup
              dropdownMatchSelectWidth={false}
              getPopupContainer={() => document.getElementById('page-content')}
              label="退款账号"
              style={{ width: 80 }}
              onChange={(e) => {
                onFormChange({
                  field: 'accountId',
                  value: e
                });
              }}
              defaultValue={''}
            >
              <Option value="">全部</Option>
              {this._renderBank()}
            </SelectGroup>
          </FormItem>
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
        </Form>
      </div>
    );
  }

  _renderChannel() {
    const { channelItems } = this.props.relaxProps;
    return channelItems.map((channel) => {
      return (
        <Option value={channel.get('id')} key={channel.get('id')}>
          {channel.get('name')}
        </Option>
      );
    });
  }

  _renderBank() {
    const { offlineAccounts } = this.props.relaxProps;
    return offlineAccounts.map((offlineAccount) => {
      return (
        <Option
          value={offlineAccount.get('accountId')}
          key={offlineAccount.get('accountId')}
        >
          {this._renderBankName(offlineAccount)}
        </Option>
      );
    });
  }

  /**
   * 渲染银行名称
   * @param offlineAccount
   * @returns {string}
   * @private
   */
  _renderBankName(offlineAccount) {
    return `${offlineAccount.get('bankName')} ${offlineAccount.get('bankNo')}`;
  }
}
