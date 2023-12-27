import React from 'react';
import { StoreProvider, Relax } from 'plume2';

import { Breadcrumb, Form } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';

import FreightTemp from './component/freight-temp';
import AppStore from './store';

const FreightTempForm = Form.create()(FreightTemp) as any;
const FreightTempRelax = Relax(FreightTempForm);

/**
 * 运费模板
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class StoreFreight extends React.Component<any, any> {
  store: AppStore;

  componentWillMount() {
    const { freightId } = (this.props.match && this.props.match.params) || {
      freightId: 0
    };

    const { pageType } = this.props.location?.state?.pageType || 0;
    this.store.changePageType(pageType);
    if (freightId) {
      // 初始化
      this.store.init(freightId);
    } else {
      this.store.fetchSelectedAreaIds();
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
      <BreadCrumb thirdLevel={true}>
        <Breadcrumb.Item>{typeTxt}店铺运费模板</Breadcrumb.Item>
      </BreadCrumb>,
      <div className="container" key="container">
        <Headline title={`${typeTxt}店铺运费模板`} />
        <FreightTempRelax />
      </div>
    ];
  }
}
