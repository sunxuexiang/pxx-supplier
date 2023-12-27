import React from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb } from 'antd';
import { AuthWrapper, Headline, util,BreadCrumb } from 'qmkit';
import AppStore from './store';
import ListView from './component/list';
import LevelModal from './component/level-modal';
import Tips from './component/tips';
import Tool from './component/toolbar';
import SelfTips from './component/self-tips';
import SelfListView from './component/self-list';
import SelfLevelViewModal from './component/self-level-view-modal';

/**
 * 模块的顶级父组件装饰@StoreProvider
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class CustomerLevel extends React.Component<any, any> {
  store: AppStore;

  /**
   * 组件装载后被立即调用init（）
   */
  componentDidMount() {
    if (util.isThirdStore()) {
      this.store.init();
    } else {
      this.store.initSelf();
    }
  }

  render() {
    return (
      <AuthWrapper functionName="f_customer_level_0">
        <div>
          <BreadCrumb/>
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>客户</Breadcrumb.Item>
            <Breadcrumb.Item>客户管理</Breadcrumb.Item>
            <Breadcrumb.Item>客户等级</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container">
            <Headline title="客户等级" />
            {util.isThirdStore() ? (
              <div>
                <Tips />
                <Tool />
                <ListView />
                <LevelModal />
              </div>
            ) : (
              <div>
                <SelfTips />
                <SelfListView />
                <SelfLevelViewModal />
              </div>
            )}
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
