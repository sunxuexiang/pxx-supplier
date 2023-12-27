import React from 'react';

import { Relax } from 'plume2';
import { Table } from 'antd';
import { IMap } from 'typings/globalType';
import { util } from 'qmkit';

@Relax
export default class GoodsList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      couponInfoLisat: IMap;
      //   couponActivity: IMap;
    };
    type?: any;
  };

  static relaxProps = {
    couponInfoLisat: ['activityInfo', 'goodsInfoVOS']
    // couponActivity: ['activityInfo','couponActivity']
  };

  render() {
    const { couponInfoLisat } = this.props.relaxProps;
    const { type } = this.props;
    console.log(
      type,
      '11111111111111',
      couponInfoLisat ? couponInfoLisat.toJS() : couponInfoLisat
    );

    return (
      type == 9 && (
        <Table
          dataSource={couponInfoLisat ? couponInfoLisat.toJS() : []}
          pagination={false}
          scroll={{ x: true, y: 500 }}
          rowKey="couponId"
        >
          <Table.Column
            title="SKU编码"
            dataIndex="goodsInfoNo"
            key="goodsInfoNo"
            width="15%"
          />

          <Table.Column
            title="商品名称"
            dataIndex="goodsInfoName"
            key="goodsInfoName"
            width="40%"
          />
          {util.isThirdStore() && (
            <Table.Column
              title="规格"
              dataIndex="specText"
              key="specText"
              width="30%"
              render={(value, row: any) => {
                const result = [];
                row.goodsAttributeKeys?.forEach((item) => {
                  result.push(item.goodsAttributeValue);
                });
                return result.join('-');
              }}
            />
          )}

          <Table.Column
            title="价格"
            dataIndex="marketPrice"
            key="marketPrice"
            width="15%"
          />
        </Table>
      )
    );
  }
}
