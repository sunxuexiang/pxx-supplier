import React, { Component } from 'react';

import { Button, Form } from 'antd';
import { IList } from 'typings/globalType';

import { history, noop } from 'qmkit';
import SelectedGoodsGrid from './selected-goods-grid';
import { GoodsModal } from 'biz';

const FormItem = Form.Item;

const formItemLayout = {
  fontSize: 14,
  marginBottom: 10,
  display: 'block'
};

export default class FlashSaleGoodsForm extends Component<any, any> {
  props: {
    form: any;
    location: any;
    relaxProps?: {
      // 开始时间
      startTime: string;
      // 结束时间
      endTime: string;
      // 选中的商品
      chooseSkuIds: IList;
      goodsModalVisible: boolean;
      goodsRows: IList;
      // 按钮禁用
      btnDisabled: boolean;
      // 键值设置方法
      fieldsValue: Function;
      // 修改时间区间方法
      changeDateRange: Function;
      onCancelBackFun: Function;
      onOkBackFun: Function;
      doAdd: Function;
    };
  };

  static relaxProps = {
    chooseSkuIds: 'chooseSkuIds',
    goodsModalVisible: 'goodsModalVisible',
    goodsRows: 'goodsRows',
    btnDisabled: 'btnDisabled',

    fieldsValue: noop,
    changeDateRange: noop,
    onCancelBackFun: noop,
    onOkBackFun: noop,
    doAdd: noop
  };

  render() {
    const {
      onCancelBackFun,
      goodsModalVisible,
      chooseSkuIds,
      goodsRows,
      btnDisabled
    } = this.props.relaxProps;
    return (
      <div style={{ width: '100%' }}>
        <Form style={{ width: '100%' }}>
          <FormItem
            {...formItemLayout}
            label="选择商品"
            style={{ width: '100%' }}
          >
            {this.chooseGoods().dom}
          </FormItem>
        </Form>
        <div className="bar-button">
          <Button
            disabled={btnDisabled}
            type="primary"
            onClick={() => this.onAdd()}
            style={{ marginRight: 10 }}
          >
            保存
          </Button>
          <Button onClick={() => history.goBack()} style={{ marginLeft: 10 }}>
            取消
          </Button>
        </div>
        <GoodsModal
          limitNOSpecialPriceGoods={true}
          showValidGood={true}
          visible={goodsModalVisible}
          selectedSkuIds={chooseSkuIds.toJS()}
          selectedRows={goodsRows.toJS()}
          onOkBackFun={this._onOkBackFun}
          onCancelBackFun={onCancelBackFun}
          companyType={3}
          searchParams={{ saleType: 1, goodsSource: 1 }} // goodsSource:商品来源 0供应商，1商家
          application={'saleType'}
        />
      </div>
    );
  }

  /**
   * 已选商品结构
   */
  chooseGoods = () => {
    const { chooseSkuIds } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    return {
      dom: getFieldDecorator('chooseSkuIds', {
        initialValue: chooseSkuIds.toJS(),
        rules: [{ required: true, message: '请选择商品' }]
      })(<SelectedGoodsGrid form={this.props.form} />)
    };
  };

  /**
   *商品 点击确定之后的回调
   */
  _onOkBackFun = (skuIds, rows) => {
    this.props.form.setFieldsValue({
      chooseSkuIds: skuIds
    });
    this.props.relaxProps.onOkBackFun(skuIds, rows);
  };

  onAdd() {
    const { doAdd } = this.props.relaxProps;
    this.props.form.validateFields((err) => {
      if (!err) {
        doAdd();
      } else {
        this.setState({
          flushStatus: Math.random()
        });
      }
    });
  }
}
