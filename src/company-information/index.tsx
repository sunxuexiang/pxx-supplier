import React from 'react';
import { Form, Breadcrumb } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';
import { StoreProvider } from 'plume2';
import InfoForm from './components/info-form';
import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CompanyInformation extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.init();
  }

  render() {
    const InfoFormDetail = Form.create({})(InfoForm);

    return (
      <div>
        <BreadCrumb />
        <div className="container">
          <Headline title="公司信息" />

          <InfoFormDetail />
        </div>
      </div>
    );
  }
}
