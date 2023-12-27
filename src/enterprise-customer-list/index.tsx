import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb, AuthWrapper } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import CustomerList from './components/tab-data-grid';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class Customer extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const state = this.props.location.state;
    if (state && state.key) {
      this.store.onTabChange(state.key);
    } else {
      this.store.init();
    }
  }

  render() {
    return (
      <div>
        {/*导航面包屑*/}
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>客户</Breadcrumb.Item>
          <Breadcrumb.Item>客户管理</Breadcrumb.Item>
          <Breadcrumb.Item>客户列表</Breadcrumb.Item>
        </Breadcrumb> */}
        <AuthWrapper functionName={'f_customer_iep_page'}>
          <div className="container customer">
            <Headline title="企业会员" />

            {/*搜索条件*/}
            <SearchForm />

            {/*tab的客户列表*/}
            <CustomerList />
          </div>
        </AuthWrapper>
      </div>
    );
  }
}
