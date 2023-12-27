import React from 'react';
import { IMap, Relax } from 'plume2';
import { Tabs } from 'antd';
import CustomerList from './list';
import { noop } from 'qmkit';

@Relax
export default class TabDataGrid extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onTabChange: Function;
      form: IMap;
    };
  };

  static relaxProps = {
    onTabChange: noop,
    form: 'form'
  };

  render() {
    const { onTabChange, form } = this.props.relaxProps;
    const key = form.get('customerType');

    return (
      <Tabs onChange={key => onTabChange(key)} activeKey={key}>
        <Tabs.TabPane tab="全部" key="-1">
          <CustomerList />
        </Tabs.TabPane>

        <Tabs.TabPane tab="我发展的客户" key="1">
          <CustomerList />
        </Tabs.TabPane>

        <Tabs.TabPane tab="我关联的客户" key="0">
          <CustomerList />
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
