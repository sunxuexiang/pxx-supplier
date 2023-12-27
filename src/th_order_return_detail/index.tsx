import React from 'react';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import { Headline, BreadCrumb ,AuthWrapper} from 'qmkit';
import { Breadcrumb } from 'antd';

import OrderStatusHead from './components/order-status-head';
import GoodsList from './components/goods-list';
import ReturnRecord from './components/return-record';
import OperateLog from './components/operate-log';

/**
 * 退单详情
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class ReturnOrderDetail extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { rid } = this.props.match.params;
    this.store.init(rid);
  }

  render() {
    return (
      <AuthWrapper functionName="throdf001">
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>退单详情</Breadcrumb.Item>
        </BreadCrumb>

        <div className="container" style={{ paddingBottom: 50 }}>
          <Headline title="退单详情" />
          <OrderStatusHead />
          <GoodsList />
          {/*<ReceiverRecord/>*/}
          <ReturnRecord />
          <OperateLog />
        </div>
      </div>
      </AuthWrapper>
    );
  }
}
