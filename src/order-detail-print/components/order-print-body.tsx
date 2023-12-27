import React from 'react';
import { IMap, Relax } from 'plume2';
import { Table } from 'antd';
import { fromJS, List, Map } from 'immutable';
import { cache } from 'qmkit';
import NP from 'number-precision';

const normalFontSize = 14;
const middleFontSize = 18;

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
    const barcodeCol = [];
    const logInfo = sessionStorage.getItem(cache.LOGIN_DATA)
      ? JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA))
      : '';
    // if (logInfo && logInfo.selfManage !== 1) {
    //   // 非自营标签商家 才显示条形码
    //   barcodeCol.push({
    //     title: '条形码',
    //     dataIndex: 'goodsInfoBarcode',
    //     key: 'goodsInfoBarcode',
    //     width: 85,
    //     render: (text) => (text ? text : '-')
    //   });
    // }
    const columns = [
      {
        title: <span style={{ fontSize: normalFontSize }}>序号</span>,
        width: 50,
        render: (_text, _row, index) => {
          return (
            <span style={{ fontSize: normalFontSize, lineHeight: '28px' }}>
              {index + 1}
            </span>
          );
        }
      },
      {
        title: (
          <div
            style={{
              fontSize: normalFontSize,
              width: '100%',
              textAlign: 'center'
            }}
          >
            商品名称
          </div>
        ),
        dataIndex: 'skuName',
        key: 'skuName',
        render: (text) => {
          return (
            <div
              style={{
                fontSize: normalFontSize,
                width: '100%',
                textAlign: 'left'
              }}
            >
              {text}
            </div>
          );
        }
      },
      // {
      //   title: '仓库',
      //   dataIndex: 'wareName',
      //   key: 'wareName',
      //   render: (text) => (text ? text : '-')
      // },
      ...barcodeCol,
      {
        title: <span style={{ fontSize: normalFontSize }}>规格</span>,
        dataIndex: 'subTitle',
        key: 'subTitle',
        width: 160,
        render: (text) => {
          return (
            <span style={{ fontSize: normalFontSize }}>
              {text ? text : '-'}
            </span>
          );
        }
      },
      {
        title: <div style={{ fontSize: middleFontSize }}>数量</div>,
        dataIndex: 'num',
        key: 'num',
        width: 80,
        render: (text) => {
          return <span style={{ fontSize: normalFontSize }}>{text}</span>;
        }
      },
      {
        title: <div style={{ fontSize: middleFontSize }}>单位</div>,
        dataIndex: 'unit',
        key: 'unit',
        width: 60,
        render: (text) => {
          return (
            <span style={{ fontSize: normalFontSize }}>
              {text ? text : '-'}
            </span>
          );
        }
      },
      // {
      //   title: '单价',
      //   dataIndex: 'price',
      //   key: 'price',
      //   width: 70,
      //   render: (price) => <span>￥{price.toFixed(2)}</span>
      // },
      {
        title: <span style={{ fontSize: normalFontSize }}>折扣</span>,
        dataIndex: 'zkPrice',
        key: 'zkPrice',
        width: 90,
        render: (zkPrice) => {
          return (
            <span style={{ fontSize: normalFontSize }}>
              ￥{(zkPrice || 0).toFixed(2)}
            </span>
          );
        }
      },
      {
        title: <div style={{ fontSize: middleFontSize }}>金额</div>,
        width: 120,
        render: (row) => {
          if (row.isGift) {
            return <span style={{ fontSize: normalFontSize }}>￥0.00</span>;
          }
          if (row.priceChanged === 1) {
            return (
              <span style={{ fontSize: normalFontSize }}>
                ￥{(row.num * row.changedPrice - (row.zkPrice || 0)).toFixed(2)}
              </span>
            );
          } else {
            return (
              <span style={{ fontSize: normalFontSize }}>
                ￥{(row.num * row.levelPrice - (row.zkPrice || 0)).toFixed(2)}
              </span>
            );
          }
        }
      }
      // {
      //   title: '退货',
      //   width: 30,
      //   dataIndex: 'returnedQuantity',
      //   key: 'returnedQuantity'
      // }
    ];
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
          .set('isGift', true)
      )
      .toJS();
    //计算总是
    gifts.map((t) => (totalNum = totalNum + t.num));
    tradeItems.forEach((item) => {
      if (item.isFlashSaleGoods) {
        item.levelPrice = item.price;
      }
      let zkPrice = NP.minus(NP.times(item.num, item.price), item.splitPrice);
      item.zkPrice = item.walletSettlements.length
        ? NP.minus(zkPrice, item.walletSettlements[0].reduceWalletPrice)
        : zkPrice;
      totalNum = totalNum + item.num;
    });
    return (
      <div>
        <Table
          columns={columns}
          dataSource={tradeItems.concat(gifts)}
          pagination={false}
          size="small"
          bordered
          // showHeader={false}
          className="container-print-table-body"
          footer={() => {
            return (
              <div style={{ width: '100%', fontSize: normalFontSize }}>
                {/* <span style={{ width: '25%' }}>
                  付款方式：{detail.getIn(['payInfo', 'desc']) || '暂无信息'}
                </span> */}
                <span style={{ width: '25%' }}>总数：{totalNum}</span>
                <span style={{ width: '25%', marginLeft: 100 }}>
                  实付金额：{totalPrice}
                </span>
              </div>
            );
          }}
        />
      </div>
    );
  }
}

const styles = {
  headBox: {
    padding: 15,
    backgroundColor: '#FAFAFA'
  }
} as any;
