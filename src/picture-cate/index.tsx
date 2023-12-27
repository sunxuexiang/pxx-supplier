import React from 'react';
import { Breadcrumb, Alert } from 'antd';
import { StoreProvider } from 'plume2';

import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import AppStore from './store';
import CateList from './component/cate-list';
import CateModal from './component/cate-modal';
import Tool from './component/tool';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class PictureCate extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName="f_pictureCate_0">
        <div>
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>设置</Breadcrumb.Item>
            <Breadcrumb.Item>图片管理</Breadcrumb.Item>
            <Breadcrumb.Item>图片分类</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container">
            <Headline title="图片分类" />
            <Alert
              message="图片分类最多可添加3个层级，没有任何分类时，所有图片将会归类到默认分类"
              type="info"
              showIcon
            />
            {/*工具条*/}
            <Tool />

            {/*列表*/}
            <CateList />

            {/*弹框*/}
            <CateModal />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
