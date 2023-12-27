// 收入对账明细
import React from 'react';
import { Relax } from 'plume2';
import { DataGrid, noop } from 'qmkit';
import moment from 'moment';
const { Column } = DataGrid;

@Relax
export default class RevenueList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      payWaysObj: any;
      incomeDetail: any;
      kind: string;
      total: number;
      pageNum: number;
      onPagination: Function;
      pageSize: number;
    };
  };

  static relaxProps = {
    payWaysObj: 'payWaysObj',
    incomeDetail: 'incomeDetail',
    total: 'total',
    pageNum: 'pageNum',
    onPagination: noop,
    pageSize: 'pageSize'
  };

  render() {
    const {
      incomeDetail,
      payWaysObj,
      total,
      pageSize,
      pageNum
    } = this.props.relaxProps;
    return (
      <div>
        <DataGrid
          dataSource={incomeDetail.toJS().length > 0 ? incomeDetail.toJS() : []}
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
            title="下单时间"
            dataIndex="orderTime"
            key="orderTime"
            render={(text, _rowData: any, _index) => {
              return <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
            }}
          />
          />
          <Column title="订单编号" dataIndex="orderCode" key="orderCode" />
          <Column title="交易流水号" dataIndex="tradeNo" key="tradeNo" />
          <Column
            title="客户昵称"
            dataIndex="customerName"
            key="customerName"
          />
          <Column
            title="支付时间"
            dataIndex="tradeTime"
            key="tradeTime"
            render={(text, _rowData: any) => {
              return <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
            }}
          />
          />
          <Column
            title="支付渠道"
            dataIndex="payWay"
            key="payWay"
            render={(text, rowData: any) => {
              return text ? (
                <span>{payWaysObj.toJS()[rowData.payWay]}</span>
              ) : (
                '无'
              );
            }}
          />
          />
          {/*<Column*/}
          {/*title='优惠金额'*/}
          {/*dataIndex='discounts'*/}
          {/*key='discounts'*/}
          {/*render={(text, rowData: any, index) => {*/}
          {/*return text ?*/}
          {/*<span>{text}</span> :'￥0.00'*/}
          {/*}}/>*/}
          {/*/>*/}
          <Column title="支付金额" dataIndex="amount" key="amount" />
        </DataGrid>
        {/*<Table columns={columns} dataSource={data} />*/}
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
