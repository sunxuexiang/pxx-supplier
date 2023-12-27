import React from 'react';
import { Form, Alert } from 'antd';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import AddressInfo from './components/address-info';
const AddressInfoForm = Form.create()(AddressInfo) as any;

@StoreProvider(AppStore, { debug: __DEV__ })
export default class InfoIndex extends React.Component<any, any> {
  store: AppStore;
  _form;

  // componentDidMount() {
  //   this.store.init();
  // }
  componentWillMount() {
    const state = this.props.location.state;
    const { wareId } = (state || {}) as any;
    this.store.init(wareId);
  }
  render() {
    return (
      <div>
        {/* 面包屑导航 */}
        <BreadCrumb />

        <div className="container">
          {/* 头部标题 */}
          <Headline title="免费店配" />
          <Alert
            message=""
            description={
              <div>
                <p>操作说明</p>
                <p>1、可根据实际情况设置包邮门槛及覆盖区域</p>
                <p>
                  2、设置成功后，用户下单满足设定的件数且收货地址在设定的区域内，则可以享受包邮到家的服务
                </p>
              </div>
            }
            type="info"
          />
          <AddressInfoForm
            areaAry={this.store.state().get('areaAry')}
            cityAreaAry={this.store.state().get('cityAreaAry')}
            changeArea={this.store.changeArea}
            changeCityArea={this.store.changeCityArea}
            save={this.store.handleSave}
            five_pcsNumber={this.store.state().get('five_pcsNumber')}
            ten_pcsNumber={this.store.state().get('ten_pcsNumber')}
            liswre={this.store.state().get('liswre')}
          />
        </div>
      </div>
    );
  }
}
