import React from 'react';
import { Breadcrumb, Form } from 'antd';
import { StoreProvider, Relax } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import TopTips from './components/top-tips';
import SearchForm from './components/live-list/search-form';
import ButtonGroup from './components/button-group';
import InfoList from './components/live-list/info-list';
import EditModal from './components/edit-modal';
import OpenStatus from './components/open-status';
import LiveTabs from './components/live-tabs';

const SearchDataForm = Relax(Form.create()(SearchForm));

@StoreProvider(AppStore, { debug: __DEV__ })
export default class InfoIndex extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { currentTab } = this.props.match.params;
    this.store.init(currentTab);
  }

  render() {
    return (
      <div>
        {/* 面包屑导航 */}
        <BreadCrumb />

        <div className="container">
          {/* 头部标题 */}
          <Headline title="小程序直播" />

          {/* 头部开通状态 */}
          <OpenStatus />

          {/* tab页 */}
          <LiveTabs />
        </div>
      </div>
    );
  }
}
