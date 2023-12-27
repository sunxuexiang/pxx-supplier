import React from 'react';
import { Breadcrumb, Alert } from 'antd';
import { StoreProvider } from 'plume2';

import { Headline,BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import Tab from './components/tab';
import { SKUModal } from 'biz';
import EditCommissionModal from './components/edit-commision-modal';
import ChooseSkuModal from './components/choose-sku-modal';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsView extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    const settingOpenFlag = this.store.state().get('settingOpenFlag');

    const {
      selectedSkuKeys,
      goodsModalVisible,
      selectedSkuRows
    } = this.store.state().toJS();

    return (
      <div>
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>营销</Breadcrumb.Item>
          <Breadcrumb.Item>社交分销</Breadcrumb.Item>
          <Breadcrumb.Item>分销商品</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="分销商品" />
          <Alert
            style={{ marginTop: 15, marginBottom: 15 }}
            message={
              <div>
                <p>
                  1、只支持将销售模式为零售的商品设为分销商品，零售商设为分销商品后，如果切换销售模式，将会退出分销。
                </p>
                <p>
                  2、设置为分销商品后，商品原有的客户设价、订货量设价、营销活动都会失效，分销商品不可使用优惠券。
                </p>
              </div>
            }
            type="info"
          />

          {settingOpenFlag == 0 && (
            <Alert
              style={{ marginBottom: 12 }}
              message={
                <p>
                  请注意！社交分销开关已关闭，当前所有商品(包含新增的商品)不会按照分销规则销售。
                </p>
              }
              type="warning"
            />
          )}

          {/*搜索*/}
          <SearchForm />

          {/*页签列表*/}
          <Tab />

          {/*编辑分销商品佣金弹出框*/}
          <EditCommissionModal />

          <ChooseSkuModal />

          <SKUModal
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
