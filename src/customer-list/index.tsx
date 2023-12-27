import React from 'react';
import { Breadcrumb } from 'antd';
import { StoreProvider } from 'plume2';
import { Headline, AuthWrapper, util,BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import ButtonGroup from './components/button-group';
import CustomerList from './components/tab-data-grid';
import CustomerModal from './components/customer-modal';
import AddRelatedModal from './components/add-related-modal';
import UpdateRelaterForm from './components/update-related-modal';
import SelfSearchForm from './components/self-search-form';
import SelfCustomerList from './components/self-tab-data-grid';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class Customer extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const state = this.props.location.state;
    if (state && state.key) {
      this.store.onTabChange(state.key);
    } else if (state && state.addCustomer) {
      this.store.onAdd();
      this.store.init();
    } else {
      if (util.isThirdStore()) {
        this.store.init();
      } else {
        this.store.initForSelf();
      }
    }
  }

  render() {
    return (
      <AuthWrapper functionName="f_customer_0">
        <div>
          <BreadCrumb/>
          {/*导航面包屑*/}
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>客户</Breadcrumb.Item>
            <Breadcrumb.Item>客户管理</Breadcrumb.Item>
            <Breadcrumb.Item>客户列表</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container customer">
            <Headline title="客户列表" />
            {util.isThirdStore() ? (
              <div>
                {/*非自营店铺展示*/}
                {/*搜索条件*/}
                <SearchForm />

                {/*操作按钮组*/}
                <ButtonGroup />

                {/*tab的客户列表*/}
                <CustomerList />

                {/*新增弹窗*/}
                <CustomerModal />

                {/*添加平台客户关联弹窗*/}
                <AddRelatedModal />

                {/*修改平台客户关联弹窗*/}
                <UpdateRelaterForm />
              </div>
            ) : (
              <div>
                {/*自营店铺展示*/}
                {/*搜索条件*/}
                <SelfSearchForm />

                {/*tab的客户列表*/}
                <SelfCustomerList />
              </div>
            )}
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
