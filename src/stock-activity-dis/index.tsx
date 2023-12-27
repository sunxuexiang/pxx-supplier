import React from 'react';

import { Breadcrumb } from 'antd';
import { StoreProvider } from 'plume2';
import { Const, Headline, BreadCrumb } from 'qmkit';

import AppStore from './store';
// import ActivityTab from './components/tab';
import ActivityInfo from './components/activity-info';
import GoodsList from './components/goods-list';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CouponActivityDetail extends React.Component<any, any> {
  store: AppStore;
  state: {
    type: 0;
  };

 async componentDidMount() { 
    const { marketingId, type } = this.props.match.params;
    this.setState({ type: type });
    await this.store.init(marketingId);
    // await this.store.inits({ pageNum: 0, pageSize: 10 });
  }

  render() {
    const type = this.state.type;
    console.log(Const.couponActivityType[type],type,'222222222222');
    
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>
            囤货活动详情
          </Breadcrumb.Item>
        </BreadCrumb>

        <div className="container">
          <Headline title={'活动详情'} />
          <ActivityInfo type={type} />
          <GoodsList type={type} />
          {/* <ActivityTab type={type} /> */}
        </div>
      </div>
    );
  }
}
