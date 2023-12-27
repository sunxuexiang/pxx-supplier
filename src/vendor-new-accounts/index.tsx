//收款账户-商家收款账户-新增账号
import React from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb, Alert, Form } from 'antd';
import AppStore from './store';
import { Headline, BreadCrumb } from 'qmkit';
import List from './components/list';

const ListForm = Form.create()(List);

@StoreProvider(AppStore, { debug: __DEV__ })
export default class VendorNewAccount extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <div>
        <BreadCrumb>
          <Breadcrumb.Item>新增账号</Breadcrumb.Item>
        </BreadCrumb>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>财务</Breadcrumb.Item>
          <Breadcrumb.Item>收款账户</Breadcrumb.Item>
          <Breadcrumb.Item>商家收款账户</Breadcrumb.Item>
          <Breadcrumb.Item>新增账号</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="新增账号" />

          <Alert
            // style={{ marginBottom: 20 }}
            message={
              <div>
                <p>填写说明：</p>
                <p>1.账户名不超过20个字符；</p>
                <p>2.账号不超过50个字符（含数字、字母、特殊字符）</p>
                <p>3.银行列如：建设银行或支付宝</p>
                <p>4.支行或昵称如：建设银行雨花支行或支付宝昵称/微信昵称</p>
              </div>
            }
            type="info"
          />

          {/*新增账号表单表他格*/}
          <ListForm />

          {/*<Foot form= { ListForm  } />*/}
        </div>
      </div>
    );
  }
}
