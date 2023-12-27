import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import Detail from './components/detail';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class LiveDetailIndex extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { id } = this.props.match.params;
    this.store.init(id);
  }

  render() {
    return (
      <div>
        {/* 面包屑导航 */}
        <BreadCrumb />

        <div className="container">
          {/* 头部标题 */}
          <Headline title="直播详情" />

          <Detail />
        </div>
      </div>
    );
  }
}
