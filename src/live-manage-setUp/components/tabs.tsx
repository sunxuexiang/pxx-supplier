import React from 'react';
import { Relax } from 'plume2';
import { Tabs, Alert } from 'antd';
import PeopleList from './people-list';
import PraiseList from './praise-list';
const { TabPane } = Tabs;
import { noop } from 'qmkit';

@Relax
export default class LiveTabs extends React.Component<any, any> {
  props: {
    relaxProps?: {
      currentLiveListTab: string;
      changeLiveListTab: Function;
    };
  };

  static relaxProps = {
    currentLiveListTab: 'currentLiveListTab',
    changeLiveListTab: noop
  };

  render() {
    const { currentLiveListTab, changeLiveListTab } = this.props.relaxProps;

    return (
      <Tabs
        activeKey={currentLiveListTab}
        onChange={(key) => changeLiveListTab(key)}
      >
        <TabPane tab="在线人数" key="1">
          <Alert
            message=""
            description={
              <div>
                <p>
                  {' '}
                  在线人数在真实值的指定范围内，根据设定的系数逐渐增长，设定的系数只对当前范围有效，并不代表之前所有的系数{' '}
                </p>
                <p> 该设定值为虚拟值，不做真实数据统计</p>
                <p>公式：直播间在线人数=范围值 X 系数 </p>
              </div>
            }
            type="info"
          />
          <PeopleList />
        </TabPane>
        <TabPane tab="在线点赞量" key="2">
          <Alert
            message=""
            description={
              <div>
                <p>
                  {' '}
                  在线人数在真实值的指定范围内，根据设定的系数逐渐增长，设定的系数只对当前范围有效，并不代表之前所有的系数{' '}
                </p>
                <p> 该设定值为虚拟值，不做真实数据统计</p>
                <p>公式：直播间在线人数=范围值 X 系数 </p>
              </div>
            }
            type="info"
          />
          <PraiseList />
        </TabPane>
      </Tabs>
    );
  }
}
