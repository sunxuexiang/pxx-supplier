import React from 'react';
import { Breadcrumb } from 'antd';
import { StoreProvider } from 'plume2';

import { Headline, BreadCrumb } from 'qmkit';

import AppStore from './store';
import SearchForm from './components/search-form';
import GoodsMatterList from './components/goods-matter-list';
import { DistributionGoodsMatterHead } from 'biz';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class Customer extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const data = this.props.location.state.goodsInfo;
    this.store.init({ pageNum: 0, pageSize: 10, headInfo: data });
  }

  render() {
    const data = this.props.location.state.goodsInfo;
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>商品分销素材</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container customer">
          <Headline title="商品分销素材" />

          {/*头部信息*/}
          <DistributionGoodsMatterHead
            skuImageUrl={data.goodsInfoImg}
            skuName={data.goodsInfoName}
            skuNo={data.goodsInfoNo}
            skuSpe={data.currentGoodsSpecDetails}
          />

          {/*搜索条件*/}
          <SearchForm />

          {/*tab的素材列表*/}
          <GoodsMatterList />
        </div>
      </div>
    );
  }
}
