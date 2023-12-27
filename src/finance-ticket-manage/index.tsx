//财务-资金管理-退款退单
import React from 'react';
import { Breadcrumb, Button } from 'antd';
import { Headline,BreadCrumb } from 'qmkit';
import TicketList from './components/ticket-list';
import TicketModal from './components/ticket-modal';
import { StoreProvider } from 'plume2';
import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class FinanceOrderReceive extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init({ pageNum: 0 });
  }

  render() {
    return (
      <div>
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>财务</Breadcrumb.Item>
          <Breadcrumb.Item>开票管理</Breadcrumb.Item>
          <Breadcrumb.Item>开票项目管理</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="开票项目管理" />

          <div className="handle-bar">
            <Button type="primary" onClick={() => this.store.onAdd()}>
              新增
            </Button>
          </div>

          <TicketList />
          <TicketModal />
        </div>
      </div>
    );
  }
}
