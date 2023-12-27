import React from 'react';
import { Button, Form, Input, DatePicker, Select } from 'antd';
import { Relax } from 'plume2';
import { noop, Const, SelectGroup } from 'qmkit';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onSearch: Function;
      searchData: any;
      onFormFieldChange: Function;
    };
  };

  static relaxProps = {
    onSearch: noop,
    onFormFieldChange: noop,
    searchData: 'searchData'
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { onSearch, searchData, onFormFieldChange } = this.props.relaxProps;

    return (
      <div style={{ marginTop: 10 }}>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore={'厂商名称'}
              value={searchData.get('companyName')}
              onChange={(e) => {
                onFormFieldChange('companyName', e.target.value);
              }}
            />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              icon="search"
              onClick={() => {
                const params = this.state;
                onSearch(params);
              }}
            >
              搜索
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };
}
