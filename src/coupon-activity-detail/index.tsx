import React from 'react';

import { Breadcrumb } from 'antd';
import { StoreProvider } from 'plume2';
import { Const, Headline, BreadCrumb } from 'qmkit';

import AppStore from './store';
import ActivityTab from './components/tab';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CouponActivityDetail extends React.Component<any, any> {
  store: AppStore;
  state: {
    type: 0;
  };

 async componentDidMount() { 
    const { id, type } = this.props.match.params;
    this.setState({ type: type });
    await this.store.init(id);
    await this.store.inits({ pageNum: 0, pageSize: 10 });
  }

  render() {
    const type = this.state.type;
    console.log(Const.couponActivityType[type],type,'222222222222');
    
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>
            {Const.couponActivityType[type]}活动详情
          </Breadcrumb.Item>
        </BreadCrumb>

        <div className="container">
          <Headline title={Const.couponActivityType[type] + '活动详情'} />
          <ActivityTab type={type} />
        </div>
      </div>
    );
  }
}
