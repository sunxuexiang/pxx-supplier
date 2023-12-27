import React from 'react';
import { Breadcrumb } from 'antd';
import { StoreProvider } from 'plume2';
import { AuthWrapper, Headline, Tips, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import Tab from './components/tab';
import EvaluateSum from './components/store-evaluate-sum';
import SeeRecord from './components/see-record';
import See from './components/see';
// import { Link } from 'react-router-dom';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class Customer extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  /**
   * 显示服务评价弹框
   */
  _showCateModal = () => {
    this.store.serviceModal(true);
    this.store.initStoreEvaluate();
  };

  render() {
    return (
      <AuthWrapper functionName="f_customer_0">
        <div>
          <BreadCrumb />
          {/*导航面包屑*/}
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>商品</Breadcrumb.Item>
            <Breadcrumb.Item>商品管理</Breadcrumb.Item>
            <Breadcrumb.Item>评价管理</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container customer">
            <Headline title="评价管理" />
            <EvaluateSum />
            <br />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Tips title="说明：评价概况展示近180天内服务评价数据汇总，评分根据各数据加权平均计算，" />
              {/*权限*/}
              <AuthWrapper functionName="f_goods_detail_1">
                <span
                  style={{ color: '#F56C1D', cursor: 'pointer' }}
                  onClick={this._showCateModal}
                >
                  查看服务评价记录
                </span>
              </AuthWrapper>
            </div>
            <br />
            {/*搜索条件*/}
            <SearchForm />
            {/*tab的评价列表*/}
            <Tab />
            <SeeRecord />
            <See />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
