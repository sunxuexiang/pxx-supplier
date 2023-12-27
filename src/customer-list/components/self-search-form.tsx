import React from 'react';
import { Relax, IMap } from 'plume2';
import { Form, Select, Input, Button } from 'antd';
import { SelectGroup, AreaSelect, noop } from 'qmkit';
import { List } from 'immutable';

type TList = List<IMap>;

const FormItem = Form.Item;
const Option = Select.Option;

@Relax
export default class SelfSearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      employee: TList;
      customerLevels: TList;
      onSelfFormChange: Function;
      onSelfSearch: Function;
    };
  };

  static relaxProps = {
    employee: ['employee'],
    customerLevels: ['customerLevels'],
    onSelfFormChange: noop,
    onSelfSearch: noop
  };

  render() {
    const { onSelfFormChange, onSelfSearch, employee, customerLevels } =
      this.props.relaxProps;

    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            addonBefore="客户名称"
            onChange={(e) => {
              const value = (e.target as any).value;
              onSelfFormChange({
                field: 'customerName',
                value
              });
            }}
          />
        </FormItem>

        {/*省市区*/}
        <FormItem>
          <AreaSelect
            label="所在地区"
            getPopupContainer={() => document.getElementById('page-content')}
            onChange={(value) => {
              onSelfFormChange({
                field: 'area',
                value
              });
            }}
          />
        </FormItem>

        {/*<FormItem>*/}
        {/*<SelectGroup*/}
        {/*getPopupContainer={() => document.getElementById('page-content')}*/}
        {/*label="平台等级"*/}
        {/*style={{ width: 80 }}*/}
        {/*onChange={(value) => {*/}
        {/*value = value === '' ? null : value;*/}
        {/*onSelfFormChange({*/}
        {/*field: 'customerLevelId',*/}
        {/*value*/}
        {/*});*/}
        {/*}}*/}
        {/*>*/}
        {/*<Option value="">全部</Option>*/}
        {/*{customerLevels.map((v) => (*/}
        {/*<Option*/}
        {/*key={v.get('customerLevelId').toString()}*/}
        {/*value={v.get('customerLevelId').toString()}*/}
        {/*>*/}
        {/*{v.get('customerLevelName')}*/}
        {/*</Option>*/}
        {/*))}*/}
        {/*</SelectGroup>*/}
        {/*</FormItem>*/}

        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="账号状态"
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              onSelfFormChange({
                field: 'customerStatus',
                value
              });
            }}
          >
            <Option value="">全部</Option>
            <Option value="0">启用</Option>
            <Option value="1">禁用</Option>
          </SelectGroup>
        </FormItem>

        <FormItem>
          <Input
            addonBefore="账号"
            onChange={(e) => {
              const value = (e.target as any).value;
              onSelfFormChange({
                field: 'customerAccount',
                value
              });
            }}
          />
        </FormItem>

        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="业务员"
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              onSelfFormChange({
                field: 'employeeId',
                value
              });
            }}
          >
            <Option value="">全部</Option>
            {employee.map((v) => (
              <Option
                key={v.get('employeeId').toString()}
                value={v.get('employeeId').toString()}
              >
                {v.get('employeeName')}
              </Option>
            ))}
          </SelectGroup>
        </FormItem>

        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="客户标记"
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              onSelfFormChange({
                field: 'beaconStar',
                value
              });
            }}
          >
            <Option value="">全部</Option>
            <Option value="1">已标记</Option>
            <Option value="0">未标记</Option>
          </SelectGroup>
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            icon="search"
            onClick={(e) => {
              e.preventDefault();
              onSelfSearch();
            }}
          >
            搜索
          </Button>
        </FormItem>
      </Form>
    );
  }
}
