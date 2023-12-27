import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import { message } from 'antd';
import moment from 'moment';
import CoinActor from './common/actor/coin-actor';
import ListActor from './common/actor/list-actor';
import LoadingActor from './common/actor/loading-actor';
import { Const, history, util } from 'qmkit';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new CoinActor(), new ListActor(), new LoadingActor()];
  }

  init = async (activityId?: string) => {
    const result = await webapi.fetchCoinInfo(activityId);
    if (result.res.code == Const.SUCCESS_CODE) {
      this.dispatch('jinbiActor:init', result.res.context);
    } else {
      message.error(result.res.message);
    }

    let levelList = [];
    if (util.isThirdStore()) {
      const levRes = await webapi.getUserLevelList();
      if (levRes.res.code != Const.SUCCESS_CODE) {
        message.error(levRes.res.message);
        return;
      }
      levelList = levRes.res.context.storeLevelVOList;
      // 店铺等级转成平台等级格式,方便后面的业务逻辑公用
      levelList.forEach((level) => {
        level.customerLevelId = level.storeLevelId;
        level.customerLevelName = level.levelName;
      });
    }
    this.dispatch('jinbiActor:level', fromJS(levelList));
  };

  getRecordInfo = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 },
    activityId?: string
  ) => {
    let paramId;
    if (activityId) {
      this.dispatch('activityId', activityId);
      paramId = activityId;
    } else {
      paramId = this.state().get('activityId');
    }
    const query = this.state()
      .get('form')
      .toJS();
    this.dispatch('loading:start');
    this.dispatch('list:inits', {
      content: fromJS([])
    });
    Promise.all([
      webapi.fetchcoupRecordList({
        ...query,
        activityId: paramId, // 暂时写死假数据
        pageNum,
        pageSize
      })
    ]).then((res) => {
      console.log(res[0].res.context.total, '123123');

      if (res[0].res.code != Const.SUCCESS_CODE) {
        message.error(res[0].res.message);
      }

      let couponList = null;
      if (res[0].res.context) {
        couponList = res[0].res.context.content;
        this.dispatch('loading:end');
        this.dispatch('list:inits', {
          content: fromJS(couponList),
          total: res[0].res.context.total,
          pageNum: pageNum + 1
        });
      }
    });
  };

  search = () => {
    this.getRecordInfo({ pageNum: 0, pageSize: 10 });
  };

  oneGoodsTermination = async (scope, have) => {
    const params = {
      activityId: scope.get('activityId'),
      activityGoodsId: scope.get('id')
    };
    const { res } = await webapi.oneGoodsTermination(params);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      history.push(
        `/jinbi-return-details/${scope.get('activityId')}/0/${have}`
      );
    } else {
      message.error(res.message);
    }
  };

  /**
   * 初始化信息
   */
  onFormFieldChange = (key, value) => {
    this.dispatch('form: field', { key, value });
  };
}
