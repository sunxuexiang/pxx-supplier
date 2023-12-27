import React from 'react';
import { Alert } from 'antd';
import { StoreProvider } from 'plume2';

import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import Tab from './components/tab';
import { EnterpriseSKUModal } from 'biz';
import EditCommissionModal from './components/edit-commision-modal';
import ChooseSkuModal from './components/choose-sku-modal';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class EnterPriseGoodsView extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    const {
      selectedSkuKeys,
      goodsModalVisible,
      selectedSkuRows
    } = this.store.state().toJS();
    const iepInfo = this.store.state().get('iepInfo');
    const { iepInfo: info = {} } = iepInfo.toJS();
    const { enterprisePriceName } = info;
    return (
      <div>
        <BreadCrumb />
        <div className="container">
          <Headline title="企业购商品" />
          <Alert
            style={{ marginTop: 15, marginBottom: 15 }}
            message={
              <div>
                <p>
                  设置为企业购商品后，企业会员可享受{enterprisePriceName}
                  购买商品；
                </p>
              </div>
            }
            type="info"
          />

          {/*搜索*/}
          <SearchForm />

          {/*页签列表*/}
          <Tab />

          {/*编辑企业购商品佣金弹出框*/}
          <EditCommissionModal />

          <ChooseSkuModal />

          <EnterpriseSKUModal
            skuLimit={50}
            showValidGood={false}
            visible={goodsModalVisible}
            selectedSkuIds={selectedSkuKeys}
            selectedRows={selectedSkuRows}
            onOkBackFun={this.store.onNextBackFun}
            onCancelBackFun={this.store.onCancelBackFun}
          />
        </div>
      </div>
    );
  }
}
