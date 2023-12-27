import * as React from 'react';
import { Form, Col, Button, Input } from 'antd';
import PropTypes from 'prop-types';
import { Store, Relax } from 'plume2';
import styled from 'styled-components';
import { history, noop } from 'qmkit';
import { IList } from 'typings/globalType';
import GoodsList from './goods-list';
import GoodsModal from './selected-sku-modal/goods-modal';

const FormItem = Form.Item;

const GreyText = styled.span`
  font-size: 12px;
  color: #999999;
  margin-left: 5px;
`;

export default class AddGoods extends React.Component<any, any> {
  _store: Store;
  props;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const store = this._store as any;
    let state = store.state();

    return (
      <div>
        <Form>
          <FormItem style={{ marginBottom: '16px' }}>
            <Button
              type="primary"
              icon="plus"
              onClick={() => {
                store.fieldsValue({
                  field: 'goodsModalVisible',
                  value: true
                });
              }}
            >
              选择商品
            </Button>
            <GreyText>
              每款SPU只需选择其中一款SKU即可，每次最多提审20款商品
            </GreyText>
            &nbsp; &nbsp;
            {getFieldDecorator('chooseSkuIds', {
              rules: [
                {
                  validator: (_rule, value, callback) => {
                    if (!value || value.length == 0) {
                      callback(new Error('请选择商品'));
                      return;
                    }

                    callback();
                  }
                }
              ]
            })(<Input type="hidden" />)}
          </FormItem>
          <FormItem>
            <GoodsList
              form={form}
              goodsRows={state.get('goodsRows').toJS()}
              deleteSelectedSku={(skuId) => store.deleteSelectedSku(skuId)}
              changePrice={store.changePrice}
              goodsRowsPrice={state.get('goodsRowsPrice')}
            />
          </FormItem>
          <GoodsModal
            visible={state.get('goodsModalVisible')}
            showValidGood={true}
            selectedSkuIds={state.get('chooseSkuIds').toJS()}
            selectedRows={state.get('goodsRows').toJS()}
            onOkBackFun={this._onOkBackFun}
            onCancelBackFun={store.onCancelBackFun}
            skuLimit={20}
            allGoodsList={state.get('allGoodsList')}
          />
        </Form>
        <div className="bar-button">
          <Button
            type="primary"
            onClick={() => this._submit()}
            style={{ marginRight: 10 }}
          >
            提交审核
          </Button>
          <Button
            onClick={() => history.push(`/live-room/${1}`)}
            style={{ marginLeft: 10 }}
          >
            取消
          </Button>
        </div>
      </div>
    );
  }

  /**
   * 保存
   */
  _submit = () => {
    const store = this._store as any;
    this.props.form.validateFields(null, (errs, values) => {
      if (!errs) {
        store.submit(values);
      }
    });
  };

  /**
   *商品 点击确定之后的回调
   */
  _onOkBackFun = (skuIds, rows) => {
    const store = this._store as any;
    this.props.form.setFieldsValue({
      chooseSkuIds: skuIds
    });
    // this.props.form.validateFields((_errs) => {});
    store.onOkBackFun(skuIds, rows);
  };
}

const styles = {
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  }
};
