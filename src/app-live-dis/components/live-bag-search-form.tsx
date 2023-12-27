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
      searchBagData: any;
      onBagListPageBut: Function;
      onFormFieldChange: Function;
    };
  };

  static relaxProps = {
    onBagListPageBut: noop,

    onFormFieldChange: noop,
    searchBagData: 'searchBagData'
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
    const {
      onBagListPageBut,
      onFormFieldChange,
      searchBagData
    } = this.props.relaxProps;

    // const { startValue, endValue } = this.state;

    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            addonBefore={'奖品名称'}
            value={searchBagData.get('bagName')}
            onChange={(e) => {
              onFormFieldChange('bagName', e.target.value);
            }}
          />
        </FormItem>
        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="状态"
            value={searchBagData.get('bagStatus')}
            onChange={(value) => {
              onFormFieldChange('bagStatus', value);
            }}
          >
            <Select.Option key="" value="">
              全部
            </Select.Option>
            <Select.Option key="0" value="0">
              未发放
            </Select.Option>
            <Select.Option key="1" value="1">
              已发放
            </Select.Option>
          </SelectGroup>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            icon="search"
            onClick={() => {
              onBagListPageBut();
            }}
          >
            搜索
          </Button>
        </FormItem>
      </Form>
    );
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };
}
