import React from 'react';
import { Breadcrumb,Alert } from 'antd';
import { StoreProvider } from 'plume2';

import { Headline,AuthWrapper,BreadCrumb } from 'qmkit';
import AppStore from './store';
import Search from './component/search';
import Tab from './component/tab';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GrouponActivity extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
      this.store.getGrouponCateList();
    this.store.init();
  }

  render() {
    return (
      <div>
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>营销</Breadcrumb.Item>
          <Breadcrumb.Item>营销中心</Breadcrumb.Item>
          <Breadcrumb.Item>拼团活动</Breadcrumb.Item>
        </Breadcrumb> */}
          <AuthWrapper functionName="f_groupon-activity-list">
        <div className="container">
          <Headline title="拼团活动" />
            <Alert
                message={
                    <div>
                        <p>-商品同一时间段仅可参与一个拼团</p>
                        <p>
                            -拼团活动独立于其他营销活动，仅通过拼团频道进行参与，可使用优惠券和积分进行抵扣
                        </p>
                    </div>
                }
                type="info"
            />
          {/*搜索框*/}
          <Search />
          {/*Tab切换拼团活动列表*/}
          <Tab />

        </div>
          </AuthWrapper>
      </div>
    );
  }
}
