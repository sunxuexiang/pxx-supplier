import React from 'react';
import { Button, Form, Input, DatePicker } from 'antd';
import { Relax } from 'plume2';
import { noop, Const } from 'qmkit';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

@Relax
export default class GoodsSearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onSearchLiveGoods: Function;
    };
  };

  static relaxProps = {
    onSearchLiveGoods: noop
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { onSearchLiveGoods } = this.props.relaxProps;

    return (
      <div style={{ marginTop: 0 }}>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore={'商品名称'}
              onChange={(e) => {
                this.setState({
                  name: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              icon="search"
              onClick={() => {
                const params = this.state;
                onSearchLiveGoods(params);
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
