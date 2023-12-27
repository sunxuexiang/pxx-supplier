import React from 'react';
import { Relax } from 'plume2';
import { Table, InputNumber, Form ,Input,message } from 'antd';
import { IMap } from 'typings/globalType';
import { noop, ValidConst, QMFloat } from 'qmkit';

import './goods-list-style.css';
import Amount from './amount';
const FormItem = Form.Item;

@Relax
export default class GoodsList extends React.Component<any, any> {
  props: {
    flushState?: any;
    form?: any;
    relaxProps?: {
      tradeDetail: IMap;
      editGoodsNum: Function;
      editGoodsPrice:Function;
      editGoodssplit: Function;
    };
  };

  static relaxProps = {
    // 订单详情
    tradeDetail: 'tradeDetail',
    // 修改数量
    editGoodsNum: noop,
    // 修改价格
    editGoodsPrice: noop,
    editGoodssplit:noop
  };

  render() {
    const dataSource = this._getDataSource(); // 订单商品\
    console.log(dataSource,'dataSource')
    const columns = this._getColumns(0);

    const giftDataSource = this._getGiftDataSource(); // 订单赠品
    const giftColumns = this._getColumns(1);

    return (
      <div>
        <h3 style={styles.title}>选择退货商品</h3>
        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          rowKey="skuId"
        />

        {giftDataSource &&
          giftDataSource.length > 0 && (
            <Table
              showHeader={false}
              bordered
              dataSource={giftDataSource}
              columns={giftColumns}
              pagination={false}
              rowKey="skuId"
            />
          )}

        {/*小计*/}
        <Amount form={this.props.form} flushState={this.props.flushState} />
      </div>
    );
  }

  _getDataSource = () => {
    const { tradeDetail } = this.props.relaxProps;
    return tradeDetail.get('tradeItems').toJS();
  };

  /**
   * 获取赠品数据源
   */
  _getGiftDataSource = () => {
    const { tradeDetail } = this.props.relaxProps;
    if (tradeDetail.get('gifts')) {
      return tradeDetail.get('gifts').toJS();
    }
    return null;
  };

  /**
   * 商品与赠品公用(通过itemType区分展示个性内容)
   * itemType=0表示商品 , itemType=1表示赠品
   */
  _getColumns = itemType => {
    const { getFieldDecorator } = this.props.form;

    return [
      {
        title: 'SKU编码',
        dataIndex: 'skuNo',
        key: 'skuNo',
        width: 150
      },
      {
        title: '商品名称',
        dataIndex: 'skuName',
        key: 'skuName',
        width: 150,
        render: text => `${itemType == 1 ? '【赠品】' : ''}${text}`
      },
      {
        title: '规格',
        dataIndex: 'goodsSubtitle',
        key: 'goodsSubtitle',
        width: 150
      },
      {
        title: '退货单价',
        key: 'prices',
        width: 100,
        render: rowInfo => {
          return itemType == 1 ? (
            <div>￥{rowInfo.prices ? rowInfo.prices.toFixed(2) : 0}</div>
          ) : (
            <div>￥{rowInfo.prices}</div>
          );
        }
      },
      {
        title: '退货数量',
        key: 'num',
        width: 100,
        className: 'centerItem',
        render: (_text, rowInfo: any, index) => {
          return itemType == 1 ? (
            <div style={{ display: 'inline-block', width: '90px' }}>
              {rowInfo.num || 0}
            </div>
          ) : (
            <FormItem>
              {getFieldDecorator(rowInfo.skuId + index, {
                initialValue: rowInfo.num,
                rules: [
                  {
                    required: true,
                    message: '请填写退货数量'
                  },
                  {
                    pattern: ValidConst.number,
                    message: '退货数量只能是整数'
                  },
                  {
                    validator: (_rule, value, callback) => {
                      const canReturnNum = rowInfo.canReturnNum;

                      if (value > canReturnNum) {
                        callback('退货数量不可超过可退数量');
                      }

                      callback();
                    }
                  }
                ]
              })(
                <InputNumber
                  min={0}
                  onChange={this._editGoodsNum.bind(this, rowInfo.skuId,rowInfo)}
                />
              )}
              <p>{`可退量${rowInfo.canReturnNum}`}</p>
            </FormItem>
          );
        }
      },
      {
        title: '退货金额小计',
        key: 'total',
        width: 100,
        render: rowInfo => {
          if (itemType == 1) {
            return <div>￥{(rowInfo.price * rowInfo.num).toFixed(2)}</div>;
          } else {
            return this._getRowTotalPrice(rowInfo);
          }
        }
      }
    ];
  };

  /**
   * 修改数量
   */
  _editGoodsNum = (skuId: string,rowInfo, returnNum,) => {
    const { editGoodsNum,editGoodssplit,editGoodsPrice } = this.props.relaxProps;
    if( rowInfo.totalNum <= returnNum) {
      
    console.log('====================================');
      var pricesa = returnNum * rowInfo.price;
    console.log(returnNum , rowInfo.totalNum,'rowInforowInfo');
      editGoodssplit(skuId, pricesa || 0);
    }else {
      editGoodsPrice(skuId, rowInfo.price || 0);
    }
    editGoodsNum(skuId, returnNum || 0);
  };

  /**
   * 修改价格
   */
  _editGoodsPrice = (skuId: string, price,pricxeas,rowInfo) => {
    console.log('====================================');
    console.log(rowInfo.num , rowInfo.totalNum,'rowInforowInfo');
    console.log('====================================');
    var { editGoodsPrice ,editGoodssplit} = this.props.relaxProps;

    if( rowInfo.totalNum <= rowInfo.num) {
      var pricesa = rowInfo.num * price;
      console.log('====================================');
      console.log(pricesa,'1111111111111111111111111');
      console.log('====================================');
    editGoodsPrice(skuId, price || 0,pricxeas);
    editGoodssplit(skuId, pricesa || 0,pricxeas);


    }else {
    editGoodsPrice(skuId, price || 0,pricxeas);


    }
  };
  

  /**
   * 计算每一项的小计金额
   */
  _getRowTotalPrice = rowInfo => {
    const num = rowInfo.num || 0;
      return QMFloat.addZero(QMFloat.accMul(rowInfo.price, num));

    // if (num < rowInfo.canReturnNum) {
    //   //小于可退数量,直接单价乘以数量
    //   return QMFloat.addZero(QMFloat.accMul(rowInfo.price, num));
    // } else {
    //   //大于等于可退数量 , 使用分摊小计金额 - 已退金额(单价*(购买数量-可退数量))
    //   return QMFloat.addZero(
    //     QMFloat.accSubtr(
    //       rowInfo.splitPrice,
    //       QMFloat.accMul(
    //         rowInfo.price,
    //         QMFloat.accSubtr(rowInfo.totalNum, rowInfo.canReturnNum)
    //       )
    //     )
    //   );
    // }
  };
}

const styles = {
  priceContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    border: '1px solid #eeeeee',
    marginTop: -4,
    borderTop: 0
  } as any,

  applyPrice: {
    display: 'flex',
    flexDirection: 'column'
  } as any,
  priceBox: {
    display: 'flex',
    flexDirection: 'column'
  } as any,
  name: {
    width: 120,
    textAlign: 'right',
    display: 'inline-block'
  },
  priceItem: {
    width: 200,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5
  } as any
};
