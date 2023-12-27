import React from 'react';
import { Form } from 'antd';
import { StoreProvider, Relax } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import AddressInfo from './components/address-info';
import { AuthWrapper } from 'qmkit';

const AddressInfoForm = Form.create()(AddressInfo) as any;

@StoreProvider(AppStore, { debug: __DEV__ })
export default class InfoIndex extends React.Component<any, any> {
  store: AppStore;
  _form;

  componentDidMount() {
    // this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName="f_pieces">
        <div>
          {/* 面包屑导航 */}
          <BreadCrumb />

          <div className="container">
            {/* 头部标题 */}
            <Headline title="乡镇件地址配置" />

            <AddressInfoForm
              areaAry={this.store.state().get('areaAry')}
              cityAreaAry={this.store.state().get('cityAreaAry')}
              changeArea={this.store.changeArea}
              changeCityArea={this.store.changeCityArea}
              save={this.store.handleSave}
            />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
