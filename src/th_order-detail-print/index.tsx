import React from 'react';
import { Breadcrumb, Button, Tabs } from 'antd';
import { StoreProvider } from 'plume2';
import AppStore from './store';

import OrderPrintHeader from './components/order-print-header';
import OrderPrintBody from './components/order-print-body';
import OrderPrintBottom from './components/order-print-bottom';
import Headline from './components/head-line';

import { BreadCrumb, AuthWrapper } from 'qmkit';
import './index.less';

/**
 * 订单详情
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class OrderDetailPrint extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { tid } = this.props.match.params;
    this.store.init(tid);
  }

  render() {
    if (this.state.loading) {
      return <div>loading...</div>;
    }
    return (
      <AuthWrapper functionName="thfprint001">
        <div>
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>订单打印</Breadcrumb.Item>
          </BreadCrumb>
          <div className="container">
            <Headline title="订单打印" />
            <div id="container-print">
              <div className="container-print-body">
                <OrderPrintHeader />
                <OrderPrintBody />
                <OrderPrintBottom />
                <div style={{ marginTop: '80px' }}>
                  <div>温馨提示：</div>
                  <div>
                    1.所有商品非质量问题，概不退货（一线及进口产品坚果炒货裸散无售后）。
                  </div>
                  <div>
                    2.自提及送货上门客户，请当面核对商品品类及数量，并请签字确认。
                  </div>
                  <div>
                    3.本货物为代办运输，货交第一承运人户的风险由客户承担
                  </div>
                  <div>
                    4.接货时请检查外包装，如第三方配送损坏造成损失。请当面沟通，二日内（超时不予处理）报备超级喜吖吖。
                  </div>
                  <div>
                    5.保质期未过三分之一，不失为老期产品，不得因此而退货。
                  </div>
                </div>
              </div>
            </div>
            <div className="bar-button">
              <Button type="primary" onClick={(e) => this._printInfo(e)}>
                打印
              </Button>
            </div>
          </div>
        </div>
      </AuthWrapper>
    );
  }

  _printInfo(e) {
    window.document
      .getElementsByClassName('container-print-body')[0]
      .setAttribute('style', 'padding: 32px 16px;');
    window.document.body.innerHTML = window.document.getElementById(
      'container-print'
    ).innerHTML;
    window.print();
    window.location.reload();
  }
}
