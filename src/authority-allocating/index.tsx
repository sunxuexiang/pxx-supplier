import React from 'react';
import { Alert, Button } from 'antd';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import AuthorityManager from './components/authority-manager';

import { AuthWrapper, Headline, BreadCrumb } from 'qmkit';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class AuthorityAllocating extends React.Component<any, any> {
  store: AppStore;
  _container;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { roleInfoId, roleName } = this.props.match.params;

    this.store.init(roleInfoId, roleName);
  }

  render() {
    const roleName = this.store.state().get('roleName');
    return (
      <div
        ref={(node) => {
          this._container = node;
        }}
      >
        <BreadCrumb />

        <div className="container" style={{ paddingBottom: 50 }}>
          <Headline title="编辑角色权限" />
          <Alert
            message=""
            description={
              <div>
                <p>
                  修改角色权限后，所有赋予此角色的员工账号对应权限均将修改；
                </p>
              </div>
            }
            type="info"
          />

          <div>角色：{roleName}</div>

          <AuthorityManager />
        </div>
        <AuthWrapper functionName="updateBossMenus">
          <div className="bar-button">
            <Button type="primary" onClick={() => this.store.onSave()}>
              保存
            </Button>
          </div>
        </AuthWrapper>
      </div>
    );
  }
}
