import React from 'react';
import { IMap, Relax } from 'plume2';
import { Table } from 'antd';
import { fromJS, List, Map } from 'immutable';

const columns = [
  {
    title: '序号',
    render: (_text, _row, index) => index + 1
  },
  {
    title: '商品名称',
    dataIndex: 'skuName',
    key: 'skuName',
    style: { width: 250 }
  },
  {
    title: '仓库',
    dataIndex: 'wareName',
    key: 'wareName',
    render: (text) => (text ? text : '-')
  },
  {
    title: '规格型号',
    dataIndex: 'subTitle',
    key: 'subTitle',
    render: (text) => (text ? text : '-')
  },
  {
    title: '数量',
    dataIndex: 'num',
    key: 'num'
  },
  {
    title: '单位',
    dataIndex: 'unit',
    key: 'unit',
    render: (text) => (text ? text : '-')
  },
  {
    title: '单价',
    dataIndex: 'price',
    key: 'price',
    render: (price) => <span>￥{price.toFixed(2)}</span>
  },
  {
    title: '折扣金额',
    render: (row) => (
      <span>￥{(row.num * row.price - row.splitPrice).toFixed(2)}</span>
    )
  },
  {
    title: '金额小计',
    dataIndex: 'splitPrice',
    key: 'splitPrice',
    render: (splitPrice) => <span>￥{splitPrice.toFixed(2)}</span>
  }
];

/**
 * 订单打印头部
 */
@Relax
export default class OrderPrintBody extends React.Component<any, any> {
  onAudit: any;

  props: {
    relaxProps?: {
      detail: IMap;
    };
  };

  static relaxProps = {
    detail: 'detail'
  };

  render() {
    const { detail } = this.props.relaxProps;
    return (
      <div style={{ display: 'flex', marginTop: 20, flexDirection: 'column' }}>
        {this._renderList(detail)}
      </div>
    );
  }

  _renderList(detail) {
    const totalPrice = detail.get('tradePrice').get('totalPrice');
    let totalNum = 0;
    let wareCode = detail.get('wareHouseCode');
    //当前的订单号
    let tradeItems = detail.get('tradeItems').toJS();
    tradeItems.map((t) => (t.wareName = wareCode));
    //赠品信息
    let gifts = detail.get('gifts') ? detail.get('gifts') : fromJS([]);
    gifts = gifts
      .map((gift) =>
        gift
          .set('skuName', '【赠品】' + gift.get('skuName'))
          .set('levelPrice', 0)
          .set('price', 0)
          .set('splitPrice', 0)
      )
      .toJS();
    //计算总是
    gifts.map((t) => (totalNum = totalNum + t.num));
    tradeItems.forEach((tradeItems) => {
      if (tradeItems.isFlashSaleGoods) {
        tradeItems.levelPrice = tradeItems.price;
      }
      totalNum = totalNum + tradeItems.num;
    });
    return (
      <Table
        columns={columns}
        dataSource={tradeItems.concat(gifts)}
        pagination={false}
        size="small"
        bordered
        footer={() => {
          return (
            <div style={{ width: '100%' }}>
              <span style={{ width: '25%' }}>
                付款方式：{detail.getIn(['payInfo', 'desc']) || '暂无信息'}
              </span>
              <span style={{ width: '25%', marginLeft: 300 }}>
                总数：{totalNum}
              </span>
              <span style={{ width: '25%', marginLeft: 100 }}>
                实付金额：{totalPrice}
              </span>
            </div>
          );
        }}
      />
    );
  }
}

const styles = {
  headBox: {
    padding: 15,
    backgroundColor: '#FAFAFA'
  }
} as any;
