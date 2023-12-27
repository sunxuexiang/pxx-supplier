import React from 'react';
import { Breadcrumb, Form } from 'antd';
import { StoreProvider, Relax } from 'plume2';
import { Headline, AuthWrapper, util } from 'qmkit';
import AppStore from './store';
// import TopTips from './components/top-tips';
import SearchForm from './components/search-form';
import ButtonGroup from './components/button-group';
// import InfoList from './components/tab-data-grid';
import InfoList from './components/info-list';
import EditModal from './components/edit-modal';

const SearchDataForm = Relax(Form.create()(SearchForm));

@StoreProvider(AppStore, { debug: __DEV__ })
export default class InfoIndex extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const isThird = util.isThirdStore();
    this.store.init(isThird);
  }

  render() {
    return (
      <AuthWrapper functionName={'f_live_manage_list'}>
        <div>
          {/* 面包屑导航 */}
          <Breadcrumb separator=">">
            <Breadcrumb.Item>应用</Breadcrumb.Item>
            <Breadcrumb.Item>APP直播</Breadcrumb.Item>
            <Breadcrumb.Item>直播间管理</Breadcrumb.Item>
          </Breadcrumb>

          <div className="container">
            {/* 头部标题 */}
            <Headline title="直播间管理列表" />

            {/* 页面提示 */}
            {/*  <TopTips />*/}

            {/* 搜索项区域 */}
            <SearchDataForm />

            {/* 操作按钮区域 */}
            <ButtonGroup />

            {/* 数据列表区域 */}
            <InfoList />

            {/* 编辑/新增弹框 */}
            <EditModal />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
