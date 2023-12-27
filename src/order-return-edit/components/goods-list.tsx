import React from 'react';
import { Relax } from 'plume2';
import { Table } from 'antd';
import { IMap } from 'typings/globalType';
import { noop } from 'qmkit';

import './goods-list-style.css';
import Amount from './amount';

@Relax
export default class GoodsList extends React.Component<any, any> {
  props: {
    flushState?: any;
    form?: any;
    relaxProps?: {
      returnDetail: IMap;
      editGoodsNum: Function;
    };
  };

  static relaxProps = {
    // 订单详情
    returnDetail: 'returnDetail',
    // 修改数量
    editGoodsNum: noop
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
    const { returnDetail } = this.props.relaxProps;
    return returnDetail.get('returnItems').toJS();
  };

  /**
   * 获取赠品数据源
   */
  _getGiftDataSource = () => {
    const { returnDetail } = this.props.relaxProps;
    if (returnDetail.get('returnGifts')) {
      return returnDetail.get('returnGifts').toJS();
    }
    return null;
  };

  /**
   * 商品与赠品公用(通过itemType区分展示个性内容)
   * itemType=0表示商品 , itemType=1表示赠品
   */
  _getColumns = (itemType) => {
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
        dataIndex: 'specDetails',
        key: 'specDetails',
        width: 150
      },
      {
        title: '退货单价',
        key: 'price',
        width: 100,
        render: (rowInfo) => <div>￥{rowInfo.price.toFixed(2)}</div>
      },
      {
        title: '退货数量',
        key: 'num',
        width: 100,
        className: 'centerItem',
        render: (_text, rowInfo: any) => {
          return (
            <div style={{ display: 'inline-block', width: '90px' }}>
              {rowInfo.num || 0}
            </div>
          );
          {
            /*
            2018-04-09 暂时取消退货数量的修改,与江哥以及产品经理沟通后,原因如下:
            1.因为目前只支持修改本次的退货商品数量,不支持修改还未退货的商品数量
            2.营销满赠,赠品的种类也有可能变多或变少
            <FormItem>
              {
                getFieldDecorator(rowInfo.skuId + index , {
                  initialValue: rowInfo.num,
                  rules: [{
                    required: true, message: '请填写退货数量'
                  }, {
                    pattern: ValidConst.number, message: '退货数量只能是整数'
                  },{
                    validator: (rule, value, callback) => {
                      const canReturnNum = rowInfo.canReturnNum

                      if (value > canReturnNum) {
                        callback('退货数量不可超过可退数量')
                      }

                      callback();
                    }
                  }],
                })(
                    <InputNumber min={0} onChange={this._editGoodsNum.bind(this, rowInfo.skuId)} />
                )
              }
              <p>{`可退量${rowInfo.canReturnNum}`}</p>
            </FormItem>*/
          }
        }
      },
      {
        title: '退货金额小计',
        key: 'total',
        width: 100,
        render: (rowInfo) => <div>￥{rowInfo.splitPrice ? rowInfo.splitPrice.toFixed(2) : '0.00'}</div>
      }
    ];
  };

  /**
   * 修改数量
   */
  _editGoodsNum = (skuId: string, returnNum) => {
    const { editGoodsNum } = this.props.relaxProps;

    editGoodsNum(skuId, returnNum || 0);
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
