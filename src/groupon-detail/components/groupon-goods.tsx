import React from 'react';
import { Relax } from 'plume2';
import { DataGrid, util } from 'qmkit';
import { QMFloat } from 'qmkit';

const { Column } = DataGrid;

import styled from 'styled-components';
const TableRow = styled.div`
  margin-top: 20px;
  .red {
    background-color: #eee;
  }
`;

@Relax
export default class GrouponGoods extends React.Component<any, any> {
  props: {
    relaxProps?: {
      goodsInfos: any;
    };
  };

  static relaxProps = {
    goodsInfos: 'goodsInfos'
  };

  render() {
    const { goodsInfos } = this.props.relaxProps;

    return (
      <TableRow>
        <DataGrid
          scroll={{ y: 500 }}
          size="small"
          rowKey={(record) => record.goodsInfoId}
          dataSource={goodsInfos ? goodsInfos.toJS() : []}
          pagination={false}
        >
          <Column
            title="商品名称"
            dataIndex="goodsInfoName"
            key="goodsInfoName"
            width="15%"
          />

          <Column
            title="规格"
            dataIndex="specText"
            key="specText"
            width="10%"
            render={(value) => {
              if (value) {
                return value;
              } else {
                return '-';
              }
            }}
          />

          <Column
            title="拼团价格"
            dataIndex="grouponPrice"
            key="grouponPrice"
            width="10%"
            render={(value) => {
              return util.FORMAT_YUAN(value);
            }}
          />
          <Column
            title="起售"
            dataIndex="startSellingNum"
            key="startSellingNum"
            width="5%"
          />
          <Column
            title="限购"
            dataIndex="limitSellingNum"
            key="limitSellingNum"
            width="5%"
          />
          <Column
            title="商品销售数量"
            dataIndex="goodsSalesNum"
            key="goodsSalesNum"
            width="10%"
          />
          <Column
            title="订单数量"
            dataIndex="orderSalesNum"
            key="orderSalesNum"
            width="10%"
          />
          <Column
            title="交易额"
            dataIndex="tradeAmount"
            key="tradeAmount"
            width="10%"
            render={(value) => {
              return util.FORMAT_YUAN(value);
            }}
          />

          <Column
            title="成团后退单数量"
            dataIndex="refundNum"
            key="refundNum"
            width="10%"
          />

          <Column
            title="退单金额"
            dataIndex="refundAmount"
            key="refundAmount"
            width="10%"
            render={(value) => {
              return util.FORMAT_YUAN(value);
            }}
          />

          <Column
            title="退品率"
            key="returnRate"
            width="5%"
            render={(row) => {
              if (row.orderSalesNum) {
                return (
                  (
                    QMFloat.accDiv(row.refundNum, row.goodsSalesNum) * 100
                  ).toFixed(0) + '%'
                );
              } else {
                return '0%';
              }
            }}
          />
        </DataGrid>
      </TableRow>
    );
  }
}
