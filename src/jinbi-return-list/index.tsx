import React from 'react';
import { Breadcrumb } from 'antd';
import { StoreProvider } from 'plume2';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import JinbiRetrunList from './components/tab-data-grid';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class JinbiRetrunActivity extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const pageNum = sessionStorage.getItem('pageNum');

    const state = this.props.location.state;
    if (state && state.key) {
      this.store.onTabChange(state.key);
    } else {
      this.store.init({ pageNum: pageNum ? Number(pageNum) : 0, pageSize: 10 });
    }
    sessionStorage.removeItem('pageNum');
  }

  render() {
    return (
      <AuthWrapper functionName="f_jinbi_return_view">
        <div>
          <BreadCrumb />
          {/*导航面包屑*/}
          <div className="container customer">
            <Headline title="返鲸币活动" />

            {/*搜索条件*/}
            <SearchForm />

            {/*tab的客户列表*/}
            <JinbiRetrunList />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
