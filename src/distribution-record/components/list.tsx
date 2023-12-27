import React from 'react';
import { Relax } from 'plume2';
import { List, fromJS } from 'immutable';
import { noop, Const, DataGrid } from 'qmkit';
import Moment from 'moment';
const defaultImg = require('../../goods-list/img/none.png');
import { QMFloat } from 'qmkit';
declare type IList = List<any>;
const { Column } = DataGrid;

@Relax
export default class ListView extends React.Component<any, any> {
  props: {
    histroy?: Object;
    relaxProps?: {
      loading: boolean;
      total: number;
      pageSize: number;
      currentPage: number;
      dataList: IList;
      selected: IList;
      onSelect: Function;
      init: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    //当前的数据总数
    total: 'total',
    //当前的分页条数
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    //当前的分销记录列表
    dataList: 'dataList',
    selected: 'selected',
    onSelect: noop,
    init: noop
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      dataList,
      init,
      currentPage,
      selected,
      onSelect
    } = this.props.relaxProps;
    return (
      <DataGrid
        loading={loading}
        rowKey="recordId"
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selected.toJS(),
          onChange: (selectedRowKeys) => {
            onSelect(selectedRowKeys);
          }
        }}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={dataList.toJS()}
        // scroll={{ x: 200 }}
      >
        <Column
          title="商品"
          width={300}
          render={(rowData) => {
            const goodsInfo = fromJS(rowData.goodsInfo);
            const specList = fromJS(rowData.goodsInfoSpecDetailRelVOS);
            return (
              <div style={{ width: '265px' }}>
                {goodsInfo && goodsInfo.get('goodsInfoImg') ? (
                  <img
                    src={goodsInfo.get('goodsInfoImg')}
                    style={styles.imgItem}
                  />
                ) : (
                  <img src={defaultImg} style={styles.imgItem} />
                )}
                <div style={{ marginLeft: '65px', textAlign: 'left' }}>
                  <div style={styles.nameText}>
                    {goodsInfo && goodsInfo.get('goodsInfoName')
                      ? goodsInfo.get('goodsInfoName')
                      : '-'}
                  </div>
                  <div>
                    {specList
                      ? specList.map((v) => {
                          return (
                            <span style={styles.greyText}>
                              {v.get('detailName')}
                            </span>
                          );
                        })
                      : ''}
                  </div>
                  <div>
                    <span style={styles.greyText}>
                      {goodsInfo && goodsInfo.get('goodsInfoNo')
                        ? goodsInfo.get('goodsInfoNo')
                        : ''}
                    </span>
                  </div>
                </div>
              </div>
            );
          }}
        />
        <Column
          width="145"
          title="订单编号"
          key="tradeId"
          dataIndex="tradeId"
          render={(tradeId) => (tradeId ? tradeId : '-')}
        />
        <Column
          title={
            <p>
              客户名称<br />账号
            </p>
          }
          render={(rowData) => {
            const customerInfo = fromJS(rowData.customerDetailVO);
            return (
              <div style={{ wordBreak: 'break-word' }}>
                <div>
                  {customerInfo && customerInfo.get('customerName')
                    ? customerInfo.get('customerName')
                    : '-'}
                </div>
                <div>
                  {customerInfo &&
                  customerInfo.get('customerVO') &&
                  customerInfo.get('customerVO').get('customerAccount')
                    ? customerInfo
                        .get('customerVO')
                        .get('customerAccount')
                        .substr(0, 3) +
                      '****' +
                      customerInfo
                        .get('customerVO')
                        .get('customerAccount')
                        .substr(7)
                    : '-'}
                </div>
              </div>
            );
          }}
        />
        <Column
          title={
            <p>
              分销员名称<br />账号
            </p>
          }
          render={(rowData) => {
            const distributor = fromJS(rowData.distributionCustomerVO);
            return (
              <div style={{ wordBreak: 'break-word' }}>
                <div>
                  {distributor && distributor.get('customerName')
                    ? distributor.get('customerName')
                    : '-'}
                </div>
                <div>
                  {distributor && distributor.get('customerAccount')
                    ? distributor.get('customerAccount')
                    : '-'}
                </div>
              </div>
            );
          }}
        />
        <Column
          title="付款时间"
          key="payTime"
          dataIndex="payTime"
          width="110"
          render={(payTime) => {
            const day = Moment(payTime)
              .format(Const.DAY_FORMAT)
              .toString();
            const time = Moment(payTime)
              .format(Const.DATE_FORMAT_SECOND)
              .toString();
            return (
              <div style={{ wordBreak: 'break-word' }}>
                <div>{payTime ? day : '-'}</div>
                <div>{payTime ? time : ''}</div>
              </div>
            );
          }}
        />
        <Column
          title="订单完成时间"
          key="finishTime"
          dataIndex="finishTime"
          render={(finishTime) => {
            const day = Moment(finishTime)
              .format(Const.DAY_FORMAT)
              .toString();
            const time = Moment(finishTime)
              .format(Const.DATE_FORMAT_SECOND)
              .toString();
            return (
              <div style={{ wordBreak: 'break-word' }}>
                <div>{finishTime ? day : '-'}</div>
                <div>{finishTime ? time : ''}</div>
              </div>
            );
          }}
        />
        <Column
          title="佣金入账时间"
          key="missionReceivedTime"
          dataIndex="missionReceivedTime"
          render={(missionReceivedTime) => {
            const day = Moment(missionReceivedTime)
              .format(Const.DAY_FORMAT)
              .toString();
            const time = Moment(missionReceivedTime)
              .format(Const.DATE_FORMAT_SECOND)
              .toString();
            return (
              <div style={{ wordBreak: 'break-word' }}>
                <div>{missionReceivedTime ? day : '-'}</div>
                <div>{missionReceivedTime ? time : ''}</div>
              </div>
            );
          }}
        />
        <Column
          title={
            <p>
              金额<br />数量
            </p>
          }
          render={(rowData) => {
            const orderGoodsPrice = fromJS(rowData).get('orderGoodsPrice');
            const orderGoodsNum = fromJS(rowData).get('orderGoodsCount');
            return (
              <div>
                <div>
                  {orderGoodsPrice ? '￥' + orderGoodsPrice.toFixed(2) : '-'}
                </div>
                <div style={{ color: '#999' }}>
                  {orderGoodsNum ? orderGoodsNum + '件' : '-'}
                </div>
              </div>
            );
          }}
        />
        <Column
          title={
            <p>
              佣金<br />比例
            </p>
          }
          render={(rowData) => {
            const commissionGoods = rowData.commissionGoods;
            const commissionRate =
              QMFloat.accMul(
                rowData.commissionRate ? rowData.commissionRate : 0.0,
                100
              ) + '%';

            return (
              <div>
                <div>
                  {commissionGoods ? '￥' + commissionGoods.toFixed(2) : '-'}
                </div>
                <div style={{ color: '#999' }}>{commissionRate}</div>
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }
}

const styles = {
  loading: {
    textAlign: 'center',
    height: 300
  },
  imgItem: {
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    float: 'left',
    marginRight: 10,
    background: '#fff'
  } as any,
  platform: {
    fontSize: 12,
    color: '#fff',
    padding: '1px 3px',
    background: '#1890ff',
    display: 'inline-block',
    marginLeft: 5
  },
  nameText: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  } as any,
  greyText: {
    paddingRight: '5px',
    fontSize: 12,
    color: '#666'
  }
};
