import React from 'react';

import { Relax } from 'plume2';
import { Table } from 'antd';
import { IMap } from 'typings/globalType';

@Relax
export default class CouponList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      couponInfoList: IMap;
      couponActivity: IMap;
      couponActivityLevelVOSasd: IMap;
    };
  };

  static relaxProps = {
    couponInfoList: ['activityInfo', 'couponInfoList'],
    couponActivity: ['activityInfo', 'couponActivity'],
    couponActivityLevelVOSasd: ['activityInfo', 'couponActivityLevelVOSasd']
  };

  render() {
    const { couponInfoList, couponActivity, couponActivityLevelVOSasd } = this.props.relaxProps;
    // const listcou = couponActivityLevelVOSasd.toJS();
    console.log(couponActivityLevelVOSasd.toJS(), 'couponActivityLevelVOSasdcouponActivityLevelVOSasd');

    return (couponActivityLevelVOSasd.toJS().length > 0 ?
      couponActivityLevelVOSasd.toJS().map((item,index) => {
        return (
          <div key={index}>
            <div style={{color: 'red',marginTop: '30px'}}>满 {item.fullCount ? item.fullCount + ' 件' :  item.fullAmount + ' 元'}，赠如下优惠劵</div>
            <Table
              dataSource={item.fullGiftDetailList}
              pagination={false}
              scroll={{ x: true, y: 500 }}
              rowKey="couponId"
            >
              <Table.Column
                title="优惠券名称"
                dataIndex="couponName"
                key="couponName"
                width="20%"
              />
              <Table.Column title="面值" dataIndex="price" key="price" width="10%" />
              <Table.Column title="有效期" dataIndex="time" key="time" width="40%" />
              <Table.Column
                title={couponActivity.get('couponActivityType') == 2 ? '每组赠送张数' : '总张数'}
                dataIndex="totalCount"
                key="totalCount"
                width="10%"
              />
            </Table>
          </div>
        )
      }) : <Table
        dataSource={couponInfoList.toJS()}
        pagination={false}
        scroll={{ x: true, y: 500 }}
        rowKey="couponId"
      >
        <Table.Column
          title="优惠券名称"
          dataIndex="couponName"
          key="couponName"
          width="20%"
        />
        <Table.Column title="面值" dataIndex="price" key="price" width="10%" />
        <Table.Column title="有效期" dataIndex="time" key="time" width="40%" />
        <Table.Column
          title={couponActivity.get('couponActivityType') == 2 ? '每组赠送张数' : '总张数'}
          dataIndex="totalCount"
          key="totalCount"
          width="10%"
        />
      </Table>

    );
  }
}
