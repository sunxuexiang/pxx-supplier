import React from 'react';
import { StoreProvider, Relax } from 'plume2';

import { Breadcrumb, Form, Alert } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';

import AppStore from './store';
import FreightTemp from './component/freight-temp';
const FreightTempForm = Form.create()(FreightTemp) as any;
const FreightTempRelax = Relax(FreightTempForm);
/**
 * 运费模板
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsFreight extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { freightId } = (this.props.match && this.props.match.params) || {
      freightId: 0
    };
    const { isCopy } = (this.props.location && this.props.location.state) || {
      isCopy: false
    };
    this.store.setPageType(1);
    if (freightId) {
      // 初始化
      this.store.init(freightId, isCopy);
    }
  }

  constructor(props) {
    super(props);
  }

  render() {
    let typeTxt = '新增';
    if (this.store.state().get('freightTempId')) {
      typeTxt = '编辑';
    }
    return [
      // <AuthWrapper functionName="f_freight_1">
      <BreadCrumb thirdLevel={true}>
        <Breadcrumb.Item>{typeTxt}单品运费模板</Breadcrumb.Item>
      </BreadCrumb>,
      <div className="container" key="container">
        <Headline title={`${typeTxt}单品运费模板`} />
        <Alert
          message={
            <div>
              <div>
                在设置运费模板时建议考虑分批发货可能产生的溢出成本，适当调高基数
              </div>
              <div>
                若要设置包邮，请选择卖家承担运费，若要设置部分地区包邮，请选择买家承担运费，另外再指定条件包邮
              </div>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 15 }}
        />
        <FreightTempRelax />
      </div>
    ];
  }
}
