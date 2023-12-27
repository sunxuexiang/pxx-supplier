import React, { Component } from 'react';
import { StoreProvider } from 'plume2';
import { fromJS } from 'immutable';
import { Alert, Breadcrumb, Form } from 'antd';
import { Headline, BreadCrumb, AuthWrapper } from 'qmkit';
import StoreForm from './components/add-form';

import Appstore from './store';

const WrappedForm = Form.create()(StoreForm);

@StoreProvider(Appstore, { debug: __DEV__ })
export default class CouponInfo extends Component<any, any> {
  store: Appstore;
  _form;

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const { activityId } = this.props.match.params;
    if (activityId) {
      this.store.init(activityId);
    }

    if (
      this.store.state().get('activity').toJS().fullGiftLevelList.length == 0
    ) {
      this.initLevel();
    }

    // await this.initLevel();
  }

  /**
   * 初始化等级
   */
  initLevel = () => {
    const initLevel = [
      {
        key: this.makeRandom(),
        fullAmount: null,
        fullCount: null,
        giftType: 1,
        modalVisible: false,
        fullGiftDetailList: []
      }
    ];
    this.setState({ fullGiftLevelList: initLevel });
    // console.log(initLevel, '初始化');

    // const { onChangeBack } = this.props;
    // onChangeBack(initLevel);
  };

  /**
   * 生成随机数，作为key值
   * @returns {string}
   */
  makeRandom = () => {
    return 'key' + (Math.random() as any).toFixed(6) * 1000000;
  };

  render() {
    const id = this.store.state().getIn(['activity', 'activityId']);
    const goodsInfoVOS = this.store.state().getIn(['activity', 'goodsInfoVOS']);
    console.log(this.store.state().get('activity').toJS(), '32134156');

    const state = this.props.location.state;
    const { fullGiftLevelList } = this.state;

    return [
      <AuthWrapper functionName={'f_coupon_zdls'}>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{id ? '编辑' : '创建'}指定商品赠券</Breadcrumb.Item>
        </BreadCrumb>
        ,
        <div className="container" key="container">
          <Headline title={id ? '编辑指定商品赠券' : '创建指定商品赠券'} />
          <Alert
            message={
              <div>
                <p>操作说明：</p>
                <p>购买指定商品赠优惠劵；</p>
                {/* <p>
                一组优惠券中每张优惠券的赠送张数最多支持10张，活动在领取组数达到上限后停止；
              </p>
              <p>
                同一时间只生效一个进店赠券活动，已创建进店赠券活动的日期不可被再次选择；
              </p> */}
              </div>
            }
            type="info"
          />
          <WrappedForm
            ref={(form) => (this._form = form)}
            {...{
              store: this.store,
              goodsInfoVOS: goodsInfoVOS.toJS(),
              fullGiftLevelList:
                this.store.state().get('activity').toJS().fullGiftLevelList
                  .length > 0
                  ? this.store.state().get('activity').toJS().fullGiftLevelList
                  : fullGiftLevelList
              // marketingId: marketingId,
            }}
          />
        </div>
      </AuthWrapper>
    ];
  }
}
