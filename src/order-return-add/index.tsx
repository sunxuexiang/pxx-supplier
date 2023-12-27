import React from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb, Form } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';

import AppStore from './store';
import ReturnOrderForm from './components/form';

const WrapperForm = Form.create({})(ReturnOrderForm);

/**
 * 新增退单
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class OrderReturnAdd extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const tid = this.props.location.search.split('=')[1];
    this.store.init(tid);
  }

  render() {
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>新增退单</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container" style={{ paddingBottom: 50 }}>
          <Headline title="新增退单" />
          <WrapperForm ref={(form) => (window['_form'] = form)} />
        </div>
      </div>
    );
  }
}
