import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchHead from './components/search-head';
import SearchList from './components/search-list';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class VideoSetting extends React.Component<any, any> {
  store: AppStore;
  componentDidMount() {
    this.store.onSearch();
  }
  render() {
    return (
      <div>
        {/*导航面包屑*/}
        <BreadCrumb />
        <div className="container customer">
          <Headline title="商家发现" />

          <SearchHead />
          <SearchList />
        </div>
      </div>
    );
  }
}
