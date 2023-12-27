import React from 'react';
import { Relax } from 'plume2';
import { Button, Form, Input, Select } from 'antd';
import { Map, List } from 'immutable';

import { SelectGroup } from 'qmkit';

const FormItem = Form.Item;
const Option = Select.Option;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      onFormChange: Function;
      onSearch: Function;
      searchForm: Map<string, any>;
      offlineAccounts: List<any>;
    };
  };

  static relaxProps = {
    onFormChange: Function,
    onSearch: Function,
    searchForm: 'searchForm',
    offlineAccounts: 'offlineAccounts'
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
              <Option value={''}>全部</Option>
              {this._renderBank()}
            </SelectGroup>
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="状态"
              style={{ width: 80 }}
              onChange={(e) => {
                onFormChange({
                  field: 'refundStatus',
                  value: e
                });
              }}
              defaultValue={null}
            >
              <Option value={null}>全部</Option>
              <Option value={'0'}>待退款</Option>
              <Option value={'1'}>拒绝退款</Option>
              <Option value={'2'}>已退款</Option>
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

  _renderBank() {
    const { offlineAccounts } = this.props.relaxProps;
    return offlineAccounts.map((offlineAccount) => {
      return (
        <Option
          value={offlineAccount.get('accountId').toString()}
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
