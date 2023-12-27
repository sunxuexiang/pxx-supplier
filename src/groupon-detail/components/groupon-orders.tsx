import React from 'react';
import { Relax } from 'plume2';
import { DataGrid, noop, util, Const } from 'qmkit';
import { Input, Button } from 'antd';
import moment from 'moment';

const { Column } = DataGrid;
const GROUPON_ORDER_STATUS  = {
    0: '待成团',
    1: '待成团',
    2: '已成团',
    3: '拼团失败'
};

const PAY_STATUS = {
  NOT_PAID: '未支付',
  UNCONFIRMED: '待确认',
  PAID: '已支付'
};
@Relax
export default class GrouponOrders extends React.Component<any, any> {
  props: {
    relaxProps?: {
      dataList: any;
      pageSize: number;
      total: number;
      pageNum: number;
      setOrderNo: Function;
      orderPage: Function;
    };
  };

  static relaxProps = {
    dataList: ['orderPage', 'dataList'],
    pageSize: ['orderPage', 'pageSize'],
    total: ['orderPage', 'total'],
    pageNum: ['orderPage', 'pageNum'],
    setOrderNo: noop,
    orderPage: noop
  };

  render() {
    const {
      dataList,
      pageSize,
      total,
      pageNum,
      setOrderNo,
      orderPage
    } = this.props.relaxProps;

    return (
      <div>
        <div
          style={{
            marginBottom: 10,
            marginTop: 20,
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <Input
            style={{ width: 250, marginRight: 10 }}
            addonBefore="订单编号"
            onKeyDown={(e) => {if (e.keyCode == 13){orderPage()}}}
            onChange={(e) => {
              setOrderNo((e.target as any).value);
            }}
          />
          <Button type="primary" icon="search" onClick={() => orderPage()}>
            搜索
          </Button>
        </div>

        <DataGrid
          dataSource={dataList.toJS()}
          rowKey="orderNo"
          pagination={{
            pageSize,
            total,
            current: pageNum + 1,
            onChange: (currentPage, pageSize) => {
              orderPage({ pageNum: currentPage - 1, pageSize: pageSize });
            }
          }}
        >
          <Column title="团号" dataIndex="grouponNo" key="grouponNo" />
          <Column title="订单号" dataIndex="orderNo" key="orderNo" />
          <Column
            title="商品名称"
            dataIndex="goodsInfoName"
            key="goodsInfoName"
          />
          <Column title="商品规格" dataIndex="specText" key="specText" />
          <Column
            title="成团时间"
            dataIndex="grouponSuccessTime"
            key="grouponSuccessTime"
            render={(value) => {
                return value ? moment(value)
                    .format(Const.TIME_FORMAT)
                    .toString():"-";
            }}
          />
          <Column
            title="会员名称"
            dataIndex="customerName"
            key="customerName"
          />
          <Column
            title="订单金额"
            dataIndex="totalPrice"
            key="totalPrice"
            render={(value) => {
              return util.FORMAT_YUAN(value);
            }}
          />
          <Column title="退单商品数量" dataIndex="returnNum" key="returnNum" />
          <Column
            title="退单金额"
            dataIndex="returnPrice"
            key="returnPrice"
            render={(value) => {
              return util.FORMAT_YUAN(value);
            }}
          />
          <Column
            title="支付状态"
            dataIndex="payState"
            render={(value) => PAY_STATUS[value]}
            key="payState"
          />
          <Column
            title="拼团状态"
            render={(row) => {
              if (row.payState == 'PAID'){
                return  GROUPON_ORDER_STATUS[row.grouponOrderStatus];
              }
              return '-';
            }}
            key="grouponOrderStatus"
          />
        </DataGrid>
      </div>
    );
  }
}
