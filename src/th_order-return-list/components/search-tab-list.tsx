import React from 'react';
import { IMap, Relax } from 'plume2';
import { Tabs } from 'antd';
import List from './search-list';
import { noop } from 'qmkit';

@Relax
export default class SearchTabList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onTabChange: Function;
      tab: IMap;
    };
  };

  static relaxProps = {
    onTabChange: noop,
    tab: 'tab'
  };

  render() {
    const { onTabChange, tab } = this.props.relaxProps;
    const key = tab.get('key');

    return (
      <div>
        <Tabs
          onChange={(key) => {
            onTabChange(key);
          }}
          activeKey={key}
        >
          <Tabs.TabPane tab="全部" key="0">
            {tab.get('key') === '0' ? <List /> : null}
          </Tabs.TabPane>

          {/* <Tabs.TabPane tab="待审核" key="flowState-INIT">
            {tab.get('key') === 'flowState-INIT' ? <List /> : null}
          </Tabs.TabPane>*/}

          {/* <Tabs.TabPane tab="待填写物流信息" key="flowState-AUDIT">
            {tab.get('key') === 'flowState-AUDIT' ? <List /> : null}
          </Tabs.TabPane>

          <Tabs.TabPane tab="待商家收货" key="flowState-DELIVERED">
            {tab.get('key') === 'flowState-DELIVERED' ? <List /> : null}
          </Tabs.TabPane> */}

          <Tabs.TabPane tab="待退款" key="flowState-AUDIT">
            {tab.get('key') === 'flowState-AUDIT' ? <List /> : null}
          </Tabs.TabPane>

          <Tabs.TabPane tab="已完成" key="flowState-COMPLETED">
            {tab.get('key') === 'flowState-COMPLETED' ? <List /> : null}
          </Tabs.TabPane>

          {/* <Tabs.TabPane tab="拒绝收货" key="flowState-REJECT_RECEIVE">
            {tab.get('key') === 'flowState-REJECT_RECEIVE' ? <List /> : null}
          </Tabs.TabPane>

          <Tabs.TabPane tab="拒绝退款" key="flowState-REJECT_REFUND">
            {tab.get('key') === 'flowState-REJECT_REFUND' ? <List /> : null}
          </Tabs.TabPane> */}

          <Tabs.TabPane tab="已作废" key="flowState-VOID">
            {tab.get('key') === 'flowState-VOID' ? <List /> : null}
          </Tabs.TabPane>

          {/* <Tabs.TabPane tab="退款失败" key="flowState-REFUND_FAILED">
            {tab.get('key') === 'flowState-REFUND_FAILED' ? <List /> : null}
          </Tabs.TabPane> */}
        </Tabs>
      </div>
    );
  }
}
