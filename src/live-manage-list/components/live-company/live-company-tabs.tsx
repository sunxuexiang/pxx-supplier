import React from 'react';
import { Relax } from 'plume2';
import { Tabs } from 'antd';
const { TabPane } = Tabs;
import { noop } from 'qmkit';

import LiveCompanyList from './live-company-list';

@Relax
export default class LiveListTabs extends React.Component<any, any> {
  props: {
    relaxProps?: {};
  };

  static relaxProps = {};

  render() {
    return <LiveCompanyList />;
  }
}
