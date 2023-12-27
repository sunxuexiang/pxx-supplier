import React from 'react';
import { Button, Form, Input } from 'antd';
import { Relax } from 'plume2';
import { noop } from 'qmkit';

const FormItem = Form.Item;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onSearch: Function;
    };
  };

  static relaxProps = {
    onSearch: noop
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { onSearch } = this.props.relaxProps;

    return (
      <div style={{ marginTop: 10 }}>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore={'商品名称'}
              onChange={(e) => {
                this.setState({
                  goodsName: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore={'SKU编码'}
              onChange={(e) => {
                this.setState({
                  goodsInfoNo: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              icon="search"
              htmlType="submit"
              onClick={(e) => {
                e.preventDefault();
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
}
