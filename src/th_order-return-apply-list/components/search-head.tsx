import React, { Component } from 'react';
import { Relax } from 'plume2';
import {} from 'immutable';
import { Form, Input, Select, Button } from 'antd';
import { Headline, noop } from 'qmkit';

const FormItem = Form.Item;
const Option = Select.Option;

/**
 * 订单查询头
 */
@Relax
export default class SearchHead extends Component<any, any> {
  props: {
    relaxProps?: {
      onSearch: Function;
      total: number;
    };
  };

  static relaxProps = {
    onSearch: noop,
    total: 'total'
  };

  constructor(props) {
    super(props);

    this.state = {
      goodsOptions: 'skuName',
      buyerSelect: 'buyerName',
      receiverSelect: 'consigneeName',

      id: '',
      goodsOptionsValue: '',
      buyerSelectValue: '',
      receiverSelectValue: ''
    };
  }

  render() {
    const { onSearch, total } = this.props.relaxProps;

    return (
      <div>
        <Headline title="发起售后申请" number={total.toString()} />

        <div>
          <Form className="filter-content" layout="inline">
            <FormItem>
              <Input
                addonBefore="订单编号"
                onChange={(e) => {
                  this.setState({
                    id: (e.target as any).value
                  });
                }}
              />
            </FormItem>

            {/*商品名称、SKU编码*/}
            <FormItem>
              <Input
                addonBefore={this._renderGoodsOptionSelect()}
                onChange={(e) => {
                  this.setState({
                    goodsOptionsValue: (e.target as any).value
                  });
                }}
              />
            </FormItem>

            {/*客户名称、客户账号*/}
            <FormItem>
              <Input
                addonBefore={this._renderBuyerSelect()}
                onChange={(e) => {
                  this.setState({
                    buyerSelectValue: (e.target as any).value
                  });
                }}
              />
            </FormItem>

            {/*收件人、收件人手机*/}
            <FormItem>
              <Input
                addonBefore={this._renderReceiverSelect()}
                onChange={(e) => {
                  this.setState({
                    receiverSelectValue: (e.target as any).value
                  });
                }}
              />
            </FormItem>
            <FormItem>
              <Button
                htmlType="submit"
                type="primary"
                icon="search"
                onClick={(e) => {
                  e.preventDefault();
                  let {
                    goodsOptions,
                    buyerSelect,
                    receiverSelect,
                    id,
                    goodsOptionsValue,
                    buyerSelectValue,
                    receiverSelectValue
                  } = this.state;

                  let params = {
                    id,
                    [goodsOptions]: goodsOptionsValue,
                    [buyerSelect]: buyerSelectValue,
                    [receiverSelect]: receiverSelectValue
                  };

                  onSearch(params);
                }}
              >
                搜索
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }

  /**
   * 买家相关查询条件
   * @returns {any}
   * @private
   */
  _renderBuyerSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) =>
          this.setState({
            buyerSelect: val
          })
        }
        value={this.state.buyerSelect}
        style={{ width: 100 }}
      >
        <Option value="buyerName">客户名称</Option>
        <Option value="buyerAccount">客户账号</Option>
      </Select>
    );
  };

  /**
   * 收件人相关查询条件
   * @returns {any}
   * @private
   */
  _renderReceiverSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) =>
          this.setState({
            receiverSelect: val
          })
        }
        value={this.state.receiverSelect}
        style={{ width: 100 }}
      >
        <Option value="consigneeName">收件人</Option>
        <Option value="consigneePhone">收件人手机</Option>
      </Select>
    );
  };

  /**
   * 商品相关查询条件
   * @returns {any}
   * @private
   */
  _renderGoodsOptionSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => {
          this.setState({
            goodsOptions: val
          });
        }}
        value={this.state.goodsOptions}
        style={{ width: 100 }}
      >
        <Option value="skuName">商品名称</Option>
        <Option value="skuNo">SKU编码</Option>
      </Select>
    );
  };
}
