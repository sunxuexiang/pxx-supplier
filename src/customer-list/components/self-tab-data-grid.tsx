import React from 'react';
import { IMap, Relax } from 'plume2';
// import { Tabs } from 'antd';
import { noop } from 'qmkit';
import SelfCustomerList from './self-list';

@Relax
export default class SelfTabDataGrid extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onSelfTabChange: Function;
      selfForm: IMap;
    };
  };

  static relaxProps = {
    onSelfTabChange: noop,
    selfForm: 'selfForm'
  };

  render() {
    // const { onSelfTabChange, selfForm } = this.props.relaxProps;
    // const key = selfForm.get('checkState');

    return <SelfCustomerList />;
    {
      /*<Tabs onChange={(key) => onSelfTabChange(key)} activeKey={key}>*/
    }
    {
      /*<Tabs.TabPane tab="全部" key="-1">*/
    }
    {
      /*<SelfCustomerList />*/
    }
    {
      /*</Tabs.TabPane>*/
    }

    {
      /*<Tabs.TabPane tab="已审核" key="1">*/
    }
    {
      /*<SelfCustomerList />*/
    }
    {
      /*</Tabs.TabPane>*/
    }

    {
      /*<Tabs.TabPane tab="待审核" key="0">*/
    }
    {
      /*<SelfCustomerList />*/
    }
    {
      /*</Tabs.TabPane>*/
    }

    {
      /*<Tabs.TabPane tab="审核未通过" key="2">*/
    }
    {
      /*<SelfCustomerList />*/
    }
    {
      /*</Tabs.TabPane>*/
    }
    {
      /*</Tabs>*/
    }
  }
}
