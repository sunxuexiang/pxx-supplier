import React from 'react';
import { StoreProvider } from 'plume2';

import { Breadcrumb, Alert, Radio, Button, Tabs } from 'antd';
import { Headline, history, AuthWrapper, checkAuth, BreadCrumb } from 'qmkit';
import styled from 'styled-components';

import GoodsSetting from './component/goods-setting';
import StoreSetting from './component/store-setting';
import AppStore from './store';

const TitleBox = styled.div`
  background: #fafafa;
  height: 60px;
  padding-left: 10px;
  padding-right: 20px;
  line-height: 60px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .ant-radio-group {
    width: calc(100% - 230px);
    margin-left: 20px;
    .ant-radio-wrapper:last-child {
      margin-left: 40px;
    }
  }
`;

const RadioGroup = Radio.Group;
/**
 * 运费模板
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class FreightTemplate extends React.Component<any, any> {
  store: AppStore;

  componentWillMount() {
    let { tab = 0 } = (this.props &&
      this.props.location &&
      this.props.location.state) || {
      tab: 0
    };
    // 初始化
    this.store.changePageType(1);
    this.store.init({ tab } as any);
  }

  constructor(props) {
    super(props);
  }

  render() {
    const fMode = this.store.state().get('fMode');
    const tab = this.store.state().get('tab');
    return (
      // [
      //   <BreadCrumb />,
      // <div className="container" key="container">
      <div>
        <Headline title="运费模板" />
        <Alert
          message={
            <div>
              请先设置运费计算模式，选择单品运费时订单运费使用每件商品的运费叠加{' '}
              <a onClick={() => history.push('/freight-instruction')}>
                查看计算公式
              </a>{' '}
              ，
              选择店铺运费则商品选择的单品运费模板不生效，按照订单金额收取统一运费；
            </div>
          }
          type="info"
          showIcon
        />
        <AuthWrapper functionName="f_freight_type_same_city_set">
          <TitleBox>
            设置运费计算模式:
            <RadioGroup
              onChange={(e: any) =>
                this.store.fieldSave({ field: 'fMode', value: e.target.value })
              }
              value={fMode}
            >
              <Radio value={0}>店铺运费</Radio>
              <Radio value={1}>单品运费</Radio>
            </RadioGroup>
            <Button type="primary" onClick={() => this._save()}>
              保存设置
            </Button>
          </TitleBox>
        </AuthWrapper>
        {(checkAuth('f_store_temp_same_city_list') ||
          checkAuth('f_goods_temp_list')) && (
          <Tabs
            activeKey={tab + ''}
            defaultActiveKey={tab + ''}
            onChange={(value) => this.store.fieldSave({ field: 'tab', value })}
            tabBarStyle={{ marginTop: 16 }}
          >
            {checkAuth('f_store_temp_list') && (
              <Tabs.TabPane tab="店铺运费" key={0}>
                <StoreSetting />
              </Tabs.TabPane>
            )}
            {checkAuth('f_goods_temp_list') && (
              <Tabs.TabPane tab="单品运费" key={1}>
                <GoodsSetting />
              </Tabs.TabPane>
            )}
          </Tabs>
        )}
      </div>
      // ];
    );
  }

  /**
   * 保存店铺的运费模板类别
   */
  _save = () => {
    this.store.saveStoreFreight();
  };
}
