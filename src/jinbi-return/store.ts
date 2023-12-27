import { IOptions, Store } from 'plume2';

import { fromJS } from 'immutable';
import { Const, history } from 'qmkit';
import { message } from 'antd';
import moment from 'moment';
import * as webapi from './webapi';
import InfoActor from './actor/actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new InfoActor()];
  }

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {};

  /**
   * 修改表单信息
   */
  changeFormField = (params) => {
    this.dispatch('change: form: field', fromJS(params));
  };

  /**
   * 新增返鲸币活动
   */
  save = async () => {
    // 1.从state中获取数据
    let activity = this.state()
      .get('activity')
      .toJS();
    // 2.格式化数据
    let params = {} as any;
    params.goodsInfos = activity.skuIds;
    params.coinActivityFullType = activity.coinActivityFullType;
    params.activityName = activity.activityName;
    params.wareId = activity.wareId;
    params.startTime = activity.startTime;
    params.endTime = activity.endTime;
    params.coinNum = activity.coinNum;
    params.joinLevel = -1; // 全部客户
    params.isOverlap = activity.isOverlap; // 是否叠加优惠

    console.log(params, 'paramsparamsparamsparams');
    // 3.提交
    let res: any = await webapi.addCoinActivity(params);
    res = res.res;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('保存成功');
      history.push({
        pathname: '/jinbi-return-list'
      });
    } else {
      message.error(res.message);
    }
  };
}
