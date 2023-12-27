import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
// import GradeList from './component/grade-list';
import EquitiesList from './component/equities-lists';

import EquitiesModal from './component/equities-modal';
import EquitiesTool from './component/equities-tool';
import PicModal from './component/pic-modal';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CustomerEquities extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();

    this.store.initImg({ pageNum: 0, cateId: -1, successCount: 0 });
    // this.store.fetchAboutUs();
  }
  render() {
    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>客户</Breadcrumb.Item>
          <Breadcrumb.Item>权益管理</Breadcrumb.Item>
          <Breadcrumb.Item>权益设置</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="权益设置" />
          {/*工具条*/}
          <EquitiesTool />
          {/*列表*/}
          <EquitiesList />
          {/*弹框*/}
          <EquitiesModal />
          {/*富文本选择图片*/}
          <PicModal />
        </div>
      </div>
    );
  }
}
