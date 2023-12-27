import React from 'react';
import { IMap, Relax } from 'plume2';
import { Form, Select, Input, Button, DatePicker } from 'antd';
import { SelectGroup, noop, Const } from 'qmkit';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onFormChange: Function;
      onSearch: Function;
      onSelectOptionChange: Function;
      form: IMap;
    };
  };

  static relaxProps = {
    onFormChange: noop,
    onSearch: noop,
    onSelectOptionChange: noop,
    form: 'form'
  };

  constructor(props) {
    super(props);
    this.state = {
      customerOptions: 'customerName'
    };
  }

  render() {
    const { onFormChange, onSearch, form } = this.props.relaxProps;

    return (
      <Form className="filter-content" layout="inline">
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
          />
        </FormItem>
        {/*会员名称、会员账号*/}
        <FormItem>
          <Input
            addonBefore={this._renderCustomerOptionSelect()}
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: this.state.customerOptions,
                value
              });
            }}
          />
        </FormItem>

        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="是否展示"
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              onFormChange({
                field: 'isShow',
                value
              });
            }}
            value={form.get('isShow')}
          >
            <Option value="-1">全部</Option>
            <Option value="1">是</Option>
            <Option value="0">否</Option>
          </SelectGroup>
        </FormItem>
        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="是否晒单"
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              onFormChange({
                field: 'isUpload',
                value
              });
            }}
            value={form.get('isUpload')}
          >
            <Option value="-1">全部</Option>
            <Option value="1">是</Option>
            <Option value="0">否</Option>
          </SelectGroup>
        </FormItem>
        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="评分"
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              onFormChange({
                field: 'evaluateScore',
                value
              });
            }}
            value={form.get('evaluateScore')}
          >
            <Option value="-1">全部</Option>
            <Option value="5">5星</Option>
            <Option value="4">4星</Option>
            <Option value="3">3星</Option>
            <Option value="2">2星</Option>
            <Option value="1">1星</Option>
          </SelectGroup>
        </FormItem>
        {/*本迭代未做,暂时注释,留到下个迭代*/}
        {/*<FormItem>
                    <SelectGroup
                        getPopupContainer={() => document.getElementById('page-content')}
                        label="是否修改"
                        style={{width: 80}}
                        onChange={value => {
                            value = value === '' ? null : value;
                            onFormChange({
                                field: 'isEdit',
                                value
                            });
                        }}
                        value={form.get('isEdit')}
                    >
                        <Option value="-1">全部</Option>
                        <Option value="1">是</Option>
                        <Option value="0">否</Option>
                    </SelectGroup>
                </FormItem>*/}
        <FormItem style={{ marginTop: 2 }}>
          <RangePicker
            getCalendarContainer={() => document.getElementById('page-content')}
            onChange={(e) => {
              let beginTime = null;
              let endTime = null;
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

  _renderCustomerOptionSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => {
          this.props.relaxProps.onSelectOptionChange(
            this.state.customerOptions,
            val
          );
          this.setState({
            customerOptions: val
          });
        }}
        value={this.state.customerOptions}
        style={{ width: 100 }}
      >
        <Option value="customerName">会员名称</Option>
        <Option value="customerAccount">会员账号</Option>
      </Select>
    );
  };
}
