import React from 'react';

import { Tabs } from 'antd';
import { Relax } from 'plume2';
import { noop } from 'qmkit';

import ActivityInfo from './activity-info';
import CouponRecord from './coupon_record';


@Relax
export default class ActivityTab extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onTabChange: Function;
      tab: string;
    };
    type?: any;
  };

  static relaxProps = {
    onTabChange: noop,
    tab: 'tab'
  };

  render() {
    const { onTabChange, tab } = this.props.relaxProps;
    const {type} = this.props;

    return (
      <Tabs
        onChange={(key) => {
          onTabChange(key);
        }}
        activeKey={tab}
      >
        <Tabs.TabPane tab="活动信息" key="0">
          <ActivityInfo type={type} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="领取记录" key="1">
          <CouponRecord />
        </Tabs.TabPane>
        {/*<Tabs.TabPane tab="相关优惠券" key="1" > </Tabs.TabPane>*/}
      </Tabs>
    );
  }
}
