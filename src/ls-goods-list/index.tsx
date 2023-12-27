import React from 'react';
import { StoreProvider } from 'plume2';

import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import Tool from './components/tool';
import Tab from './components/tab';
import FreightModal from './components/freight-modal';
import SortModal from './components/sort-modal';
import ClassfyiModal from './components/classfyi-modal';
import ForbidModal from './components/forbid-modal';
@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsView extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const pageNum = sessionStorage.getItem('pageNum');
    this.store.init({
      pageNum: pageNum ? Number(pageNum) : 0,
      pageSize: 10,
      flushSelected: false
    });
    sessionStorage.removeItem('pageNum');
    this.store.setFreightList();
  }

  render() {
    return (
      <AuthWrapper functionName="f_goods_1-ls">
        <div>
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>商品</Breadcrumb.Item>
            <Breadcrumb.Item>商品管理</Breadcrumb.Item>
            <Breadcrumb.Item>商品列表</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container">
            <Headline title="零售商品列表" />

            {/*搜索*/}
            <SearchForm />

            {/*工具条*/}
            <Tool />

            {/*tab页显示商品列表*/}
            <Tab />

            {/*批量设置运费模板Modal*/}
            <FreightModal />
            {/*价格弹框*/}
            {/* <SortModal /> */}

            {<ForbidModal />}
            {<ClassfyiModal />}
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
