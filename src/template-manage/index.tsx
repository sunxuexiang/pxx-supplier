import * as React from 'react';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import TabDataGrid from './components/tab-data-grid';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class Template extends React.Component<any, any> {
  store: AppStore;
  componentDidMount() {
    const pathTmp = this.props.location.pathname;
    const paramArr = pathTmp.split('/');
    const name = paramArr[paramArr.length - 1];
    this.store.onTabChange(name);
  }
  render() {
    return (
      <div>
        {/*导航面包屑*/}
        <BreadCrumb />
        <div className="container">
          <Headline title="列表" />
          <TabDataGrid />
        </div>
      </div>
    );
  }
}
