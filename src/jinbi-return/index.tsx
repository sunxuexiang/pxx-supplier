import React from 'react';
import { StoreProvider } from 'plume2';

import { Alert, Breadcrumb, Form } from 'antd';
import { AuthWrapper, Headline, BreadCrumb } from 'qmkit';

import StoreForm from './components/add-form';
import AppStore from './store';

const WrappedForm = Form.create()(StoreForm);

// @ts-ignore
@StoreProvider(AppStore, { debug: __DEV__ })
export default class JinbiReturn extends React.Component<any, any> {
  store: AppStore;
  _form;

  async componentDidMount() {
    const { activityId } = this.props.match.params;
    if (activityId) {
      this.store.init(activityId);
    }
  }

  render() {
    const goodsInfoVOS = this.store.state().getIn(['activity', 'goodsInfoVOS']);
    return (
      <AuthWrapper functionName={'f_jinbi_return_zdls'}>
        <div>
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>指定商品返鲸币</Breadcrumb.Item>
          </BreadCrumb>
          <div className="container coupon">
            <Headline title="指定商品返鲸币" />
            <Alert
              message={
                <div>
                  <p>操作说明：</p>
                  <p>购买指定商品返鲸币；</p>
                </div>
              }
              type="info"
            />
            <WrappedForm
              ref={(form) => (this._form = form)}
              {...{
                store: this.store,
                goodsInfoVOS: goodsInfoVOS.toJS()
                // marketingId: marketingId,
              }}
            />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
