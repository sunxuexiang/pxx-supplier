import React from 'react';
import { Relax } from 'plume2';
import { Table, InputNumber, Form, Input, message } from 'antd';
import { IMap } from 'typings/globalType';
import { noop, ValidConst, QMFloat, history } from 'qmkit';

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
      editGoodsPrice: Function;
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
    editGoodssplit: noop
  };

  render() {
    const dataSource = this._getDataSource(); // 订单商品
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

        {giftDataSource && giftDataSource.length > 0 && (
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
  _getColumns = (itemType) => {
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
        render: (text) => `${itemType == 1 ? '【赠品】' : ''}${text}`
      },
      {
        title: '规格',
        dataIndex: 'goodsSubtitle',
        key: 'goodsSubtitle',
        width: 150
      },
      {
        title: '实退单价',
        key: 'price',
        width: 100,
        // render: rowInfo => {
        //   return itemType == 1 ? (
        //     <div>￥{rowInfo.price.toFixed(2)}</div>
        //   ) : (
        //     <div>￥{rowInfo.price}</div>
        //   );
        // }
        render: (_text, rowInfo: any, index) => {
          const { tradeDetail } = this.props.relaxProps;
          return itemType == 1 ? (
            <div style={{ display: 'inline-block', width: '90px' }}>
              {rowInfo.price || 0}
            </div>
          ) : tradeDetail.toJS().activityType != 1 ? (
            <div>￥{rowInfo.price}</div>
          ) : (
            <FormItem>
              <Input
                min={0}
                defaultValue={rowInfo.price}
                // onChange={this._editGoodsPrice(this, rowInfo.skuId)}
                onChange={(e) => {
                  const numbezzs = /[\u4E00-\u9FA5]/g;
                  if (numbezzs.test(e.currentTarget.value)) {
                    message.error('请输入整数，合法数字');
                  } else {
                    if (
                      Number(e.currentTarget.value) > Number(rowInfo.prices)
                    ) {
                      message.error('不能大于退货单价');
                    }
                  }

                  this._editGoodsPrice(
                    rowInfo.devanningId ? rowInfo.devanningId : rowInfo.skuId,
                    e.currentTarget.value,
                    rowInfo.prices,
                    rowInfo
                  );
                }}
              />
            </FormItem>
          );
        }
      },
      {
        title: '退货单价',
        key: 'prices',
        width: 100,
        render: (rowInfo) => {
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
          // itemType == 1 ? (
          //   <div style={{ display: 'inline-block', width: '90px' }}>
          //     {rowInfo.num || 0}
          //   </div>
          // ) :
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
                  onChange={(e) => {
                    console.log(e, '123456');
                    if (itemType == 0) {
                      // this._editGoodsNum(rowInfo.skuId, rowInfo,e);
                      this._editGoodsNum(
                        rowInfo.devanningId
                          ? rowInfo.devanningId
                          : rowInfo.skuId,
                        rowInfo,
                        e
                      );
                    } else {
                      // console.log(itemType, 'itemTypeitemType');
                    }
                  }}
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
        render: (rowInfo) => {
          console.log('itemType', itemType);
          if (itemType == 1) {
            return (
              <div>￥{(rowInfo.price * 100 * rowInfo.num).toFixed(2)}</div>
            );
          } else {
            console.log(rowInfo, '数据');

            return this._getRowTotalPrice(rowInfo);
          }
        }
      }
      // {
      //   title: '商品来源(囤货单)',
      //   key: 'newPileOrderNo',
      //   dataIndex: 'newPileOrderNo',
      //   width: 120,
      //   render: (text) => <a href="javascript:void(0);" onClick={() => {
      //     history.push({ pathname: `/th_order-detail/${text}`})
      //   }}>{text}</a>
      // }
    ];
  };

  /**
   * 修改数量
   */
  _editGoodsNum = (devanningId: string, rowInfo, returnNum) => {
    const {
      editGoodsNum,
      editGoodssplit,
      editGoodsPrice
    } = this.props.relaxProps;
    // console.log(rowInfo.totalNum , returnNum,'000000000000');
    if (rowInfo.totalNum <= returnNum) {
      let pricesa = returnNum * rowInfo.price;
      editGoodssplit(devanningId, pricesa || 0);
    } else {
      editGoodsPrice(devanningId, rowInfo.price || 0);
    }
    // editGoodsPrice(skuId, rowInfo.price || 0);
    editGoodsNum(devanningId, returnNum || 0);
  };

  /**
   * 修改价格
   */
  _editGoodsPrice = (devanningId: string, price, pricxeas, rowInfo) => {
    let pricesa = rowInfo.num * price;
    let { editGoodsPrice, editGoodssplit } = this.props.relaxProps;
    // editGoodssplit(skuId, pricesa || 0, pricxeas);
    if (rowInfo.totalNum <= rowInfo.num) {
      let pricesa = rowInfo.num * price;
      editGoodsPrice(devanningId, price || 0, pricxeas);
      editGoodssplit(devanningId, pricesa || 0, pricxeas);
    } else {
      editGoodsPrice(devanningId, price || 0, pricxeas);
    }
  };

  /**
   * 计算每一项的小计金额
   */
  _getRowTotalPrice = (rowInfo) => {
    // const num = rowInfo.num || 0;
    console.log(rowInfo.activityType, '---', rowInfo.price);

    if (!rowInfo.num) {
      return 0.0;
    }
    if (rowInfo.num > rowInfo.canReturnNum) {
      return '退货数量错误';
    }
    if (rowInfo.activityType == 4) {
      let num = 0;
      let list = rowInfo.inventoryDetailSamountTrades
        .slice(0, rowInfo.num)
        .map((item) => item.amortizedExpenses);
      num = list.reduce((total, itemNum) => total + itemNum);
      return num.toFixed(2);
    } else {
      if (rowInfo.inventoryDetailSamountTrades.length >= rowInfo.canReturnNum) {
        // 需要计算的价格
        const priceGroup = [];
        //从inventoryDetailSamountTrades中的moneyType 0 1各取一条进行计算
        const price1 = rowInfo.inventoryDetailSamountTrades.some((item) => {
          if (item.moneyType === 1) {
            priceGroup.push(item.amortizedExpenses);
            return true;
          }
        });
        const price2 = rowInfo.inventoryDetailSamountTrades.some((item) => {
          if (item.moneyType === 0) {
            priceGroup.push(item.amortizedExpenses);
            return true;
          }
        });
        console.warn(priceGroup, price1, price2);
        // 金额累加
        const sumMoney = priceGroup.reduce((prev, current) => {
          return (prev + current).toFixed(2);
        });
        return sumMoney;
      }
      // let num2 = 0;
      // let list = rowInfo.inventoryDetailSamountTrades
      //   .slice(0, rowInfo.num)
      //   .map((item) => item.amortizedExpenses);
      // console.log('list-----1', list);
      // let num = list.reduce((total, itemNum) => total + itemNum);
      // console.warn(
      //   num,
      //   'num',
      //   rowInfo.inventoryDetailSamountTrades.length,
      //   rowInfo.canReturnNum,
      //   rowInfo.inventoryDetailSamountTrades.length > rowInfo.canReturnNum
      // );

      // if (rowInfo.inventoryDetailSamountTrades.length > rowInfo.canReturnNum) {
      //   let bList =
      //     rowInfo.inventoryDetailSamountTrades.slice(
      //       rowInfo.canReturnNum - 1,
      //       rowInfo.canReturnNum + rowInfo.num
      //     ) || [];
      //   console.warn(bList, 'bList');
      //   bList = bList.map((item) => item.amortizedExpenses);
      //   num2 = bList.reduce((total, itemNum) => total + itemNum);
      //   console.warn(num2, 'num2');
      // }
      // return (num + num2).toFixed(2);
    }
    // return QMFloat.addZero(QMFloat.accMul(rowInfo.price, num));

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
