import React from 'react';
import { Relax } from 'plume2';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

import LiveBagList from './live-bag-list';
import { noop } from 'qmkit';

@Relax
export default class LiveBagListTabs extends React.Component<any, any> {
  props: {
    relaxProps?: {
      // currentLiveListTab: string;
      // changeLiveListTab: Function;
    };
  };

  static relaxProps = {
    // currentLiveListTab: 'currentLiveListTab',
    // changeLiveListTab: noop
  };

  render() {
    return (
      <div>
        <LiveBagList />
      </div>
    );
  }
}
