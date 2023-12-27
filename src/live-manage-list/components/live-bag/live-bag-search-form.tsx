import React from 'react';
import { Button, Form, Input, Select } from 'antd';
import { Relax } from 'plume2';
import { noop, SelectGroup } from 'qmkit';

const FormItem = Form.Item;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      LiveBagSearchData: any;
      onLiveBagSearch: Function;
      // onFormFieldChange: Function;
    };
  };

  static relaxProps = {
    onLiveBagSearch: noop,

    // onFormFieldChange: noop,
    LiveBagSearchData: 'LiveBagSearchData'
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
    const { onLiveBagSearch, LiveBagSearchData } = this.props.relaxProps;

    // const { startValue, endValue } = this.state;

    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            addonBefore={'奖品名称'}
            value={LiveBagSearchData.get('bagName')}
            onChange={(e) => {
              onLiveBagSearch('bagName', e.target.value);
            }}
          />
        </FormItem>
        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="状态"
            value={LiveBagSearchData.get('bagStatus')}
            onChange={(value) => {
              onLiveBagSearch('bagStatus', value);
            }}
          >
            <Select.Option key="" value="">
              全部
            </Select.Option>
            <Select.Option key="1" value="1">
              已发放
            </Select.Option>
            <Select.Option key="0" value="0">
              未发放
            </Select.Option>
          </SelectGroup>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            icon="search"
            onClick={() => {
              onLiveBagSearch();
            }}
          >
            搜索
          </Button>
        </FormItem>
      </Form>
    );
  }
}
