import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb, AuthWrapper } from 'qmkit';
import AppStore from './store';
import EquitiesList from './component/role-lists';

import RoleModal from './component/role-modal';
import RoleTool from './component/role-tool';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CustomerEquities extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }
  render() {
    return (
      <div>
        <BreadCrumb />
        <div className="container">
          <Headline title="角色权限" />
          <AuthWrapper functionName={'f_role_add'}>
            {/*工具条*/}
            <RoleTool />
          </AuthWrapper>
          <AuthWrapper functionName={'f_role_list'}>
            {/*列表*/}
            <EquitiesList />
          </AuthWrapper>
          {/*弹框*/}
          <RoleModal />
        </div>
      </div>
    );
  }
}
