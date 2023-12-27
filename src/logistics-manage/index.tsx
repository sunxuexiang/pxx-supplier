import React from 'react';

import { Breadcrumb, Alert } from 'antd';
import { StoreProvider } from 'plume2';

import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';

import AppStore from './store';
import CompanyChoose from './components/company-choose';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class LogisticsManage extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AuthWrapper functionName="f_expressManage_1">
        <div>
          <BreadCrumb />,
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>设置</Breadcrumb.Item>
            <Breadcrumb.Item>物流设置</Breadcrumb.Item>
            <Breadcrumb.Item>物流公司设置</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container">
            <Headline title="快递公司设置" />
            <Alert
              message="管理您常用的快递公司，订单发货时方便选择，最多可设置20个快递公司。"
              type="info"
              showIcon
            />
            <CompanyChoose />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
