import React from 'react';
import { StoreProvider } from 'plume2';

import { Alert } from 'antd';
import { Headline, AuthWrapper, BreadCrumb, ExportModal, util } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import Tool from './components/tool';
import Tab from './components/tab';
import FreightModal from './components/freight-modal';
import SortModal from './components/sort-modal';
import ForbidModal from './components/forbid-modal';
import ClassfyiModal from './components/classfyi-modal';

// @ts-ignore
@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsView extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    // const pageNum = sessionStorage.getItem('pageNum');
    let searchCacheForm =
      JSON.parse(sessionStorage.getItem('searchCacheForm')) || {};
    let goodsForm = searchCacheForm?.goodsForm || {};
    if (goodsForm?.pageSize) {
      this.store.onSearchGoodsForm(goodsForm);
    }
    this.store.init(
      {
        pageNum: goodsForm.pageNum ? Number(goodsForm.pageNum) : 0,
        pageSize: !util.isThirdStore() ? 10 : 100,
        flushSelected: false
      },
      goodsForm
    );
    // sessionStorage.removeItem('pageNum');
    delete searchCacheForm['goodsForm'];
    sessionStorage.setItem('searchCacheForm', JSON.stringify(searchCacheForm));
    this.store.setFreightList();
  }

  render() {
    const exportModalData = this.store.get('exportModalData');
    return (
      <AuthWrapper functionName="f_goods_1">
        <div>
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>商品</Breadcrumb.Item>
            <Breadcrumb.Item>商品管理</Breadcrumb.Item>
            <Breadcrumb.Item>商品列表</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container">
            <Headline title="商品搜索" />

            {/*搜索*/}
            <SearchForm />

            {/*工具条*/}
            {!util.isThirdStore() && <Tool />}

            <Headline title="商品列表" />
            {/*tab页显示商品列表*/}
            <Tab />

            {/*批量设置运费模板Modal*/}
            <FreightModal />
            {/*价格弹框*/}
            <SortModal />

            {<ForbidModal />}
            {<ClassfyiModal />}
            <ExportModal
              data={exportModalData}
              onHide={this.store.onExportModalHide}
              handleByParams={exportModalData.get('exportByParams')}
              handleByIds={exportModalData.get('exportByIds')}
              extraDom={
                exportModalData && exportModalData.get('isThird') ? (
                  <Alert
                    message=""
                    description={
                      <div>
                        <p>操作说明</p>
                        <p>
                          为保证效率,每次最多支持导出5000条记录，如需导出更多，请更换筛选条件后再次导出
                        </p>
                      </div>
                    }
                    type="info"
                  />
                ) : (
                  ''
                )
              }
            />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
