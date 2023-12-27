import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Button } from 'antd';
const FormItem = Form.Item;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      onFormChange: Function;
      onSearch: Function;
      searchForm: Map<string, any>;
    };
  };

  static relaxProps = {
    onFormChange: Function,
    onSearch: Function,
    searchForm: 'searchForm'
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
            addonBefore="单位名称"
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'companyName',
                value
              });
            }}
            value={searchForm.get('companyName')}
          />
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
    );
  }
}
