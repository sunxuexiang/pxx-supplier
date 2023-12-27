//开票管理-开票项目
import React from 'react';
import { Breadcrumb, Button } from 'antd';
import { Headline, AuthWrapper,BreadCrumb } from 'qmkit';
import TicketList from './components/ticket-list';
import TicketModal from './components/ticket-modal';
import Info from './components/info';
import { StoreProvider } from 'plume2';
import AppStore from './store';

@StoreProvider(AppStore, { debug: true })
export default class FinanceOrderReceive extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init({ pageNum: 0 });
  }

  render() {
    return (
      <AuthWrapper functionName="fetchFinaceTicket">
        <div>
          <BreadCrumb/>
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>财务</Breadcrumb.Item>
            <Breadcrumb.Item>开票管理</Breadcrumb.Item>
            <Breadcrumb.Item>开票项目</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container">
            <Headline title="开票项目" />

            {/*开票类型*/}
            <Info />

            <AuthWrapper functionName="editFinaceTicket">
              <div className="handle-bar">
                <Button type="primary" onClick={() => this.store.onAdd()}>
                  新增
                </Button>
              </div>
            </AuthWrapper>

            {/*开票项目列表*/}
            <TicketList />

            {/*开票编辑弹窗*/}
            <TicketModal />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
