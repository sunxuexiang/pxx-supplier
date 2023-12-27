// 退款对账明细
import React from 'react';
import { Relax } from 'plume2';
import { DataGrid, noop } from 'qmkit';
import moment from 'moment';
const { Column } = DataGrid;

@Relax
export default class RefundList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      payWaysObj: any;
      refundDetail: any;
      total: number;
      pageNum: number;
      onPagination: Function;
      pageSize: number;
    };
  };

  static relaxProps = {
    payWaysObj: 'payWaysObj',
    refundDetail: 'refundDetail',
    total: 'total',
    pageNum: 'pageNum',
    onPagination: noop,
    pageSize: 'pageSize'
  };

  render() {
    const {
      refundDetail,
      total,
      pageNum,
      pageSize,
      payWaysObj
    } = this.props.relaxProps;

    return (
      <div>
        <DataGrid
          dataSource={refundDetail.toJS().length > 0 ? refundDetail.toJS() : []}
          rowKey={record => record.index}
          pagination={{
            pageSize,
            total,
            current: pageNum + 1
          }}
          onChange={(pagination, filters, sorter) =>
            this._getData(pagination, filters, sorter)
          }
        >
          <Column
            title="序号"
            dataIndex="index"
            key="index"
            width="50"
            render={(_text, _rowData: any, index) => {
              return pageNum * pageSize + index + 1;
            }}
          />
          <Column
            title="退单时间"
            dataIndex="orderTime"
            key="orderTime"
            render={(text, _rowData: any) => {
              return <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
            }}
          />
          />
          <Column
            title="退单编号"
            dataIndex="returnOrderCode"
            key="returnOrderCode"
          />
          <Column title="订单编号" dataIndex="orderCode" key="orderCode" />
          <Column title="交易流水号" dataIndex="tradeNo" key="tradeNo" />
          <Column
            title="客户昵称"
            dataIndex="customerName"
            key="customerName"
          />
          <Column
            title="退款时间"
            dataIndex="tradeTime"
            key="tradeTime"
            render={(text, _rowData: any) => {
              return <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
            }}
          />
          />
          <Column
            title="退款渠道"
            dataIndex="payWay"
            key="payWay"
            render={(_text, rowData: any) => {
              return <span>{payWaysObj.toJS()[rowData.payWay]}</span>;
            }}
          />
          />
          <Column title="退款金额" dataIndex="amount" key="amount" />
        </DataGrid>
      </div>
    );
  }

  /**
   * 分页查询
   * @param pageNum
   * @param pageSize
   * @private
   */
  _getData = (pagination, _filter, _sorter) => {
    const { onPagination } = this.props.relaxProps;
    onPagination(pagination.current, pagination.pageSize);
  };
}
