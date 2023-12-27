import { Store } from 'plume2';
import LiveDetailActor from './actor/live-detail-actor';
import { message } from 'antd';
import { Const } from 'qmkit';
import * as webApi from './webapi';
import { fromJS, Map } from 'immutable';
export default class AppStore extends Store {
  bindActor() {
    return [new LiveDetailActor()];
  }

  /**
   * 初始化方法
   */
  init = async (id) => {
    let pageRes = await webApi.getById({ liveId: Number(id) });
    let goodsRes = await webApi.getLiveGoodsRecordList({ liveId: Number(id) });
    let activityRes = await webApi.getActivityRecordList({
      liveId: Number(id)
    });
    if (pageRes.res.code === Const.SUCCESS_CODE) {
      this.dispatch('init:detail', pageRes.res.context.content);
      this.onBagListPageBut();
    } else {
      message.error(pageRes.res.message);
    }
    if (goodsRes.res.code === Const.SUCCESS_CODE) {
      this.dispatch(
        'init:liveGoodsList',
        fromJS(goodsRes.res.context.goodsInfoPage.content || [])
      );
    } else {
      message.error(pageRes.res.message);
    }
    if (activityRes.res.code === Const.SUCCESS_CODE) {
      this.dispatch('info:actor:form', {
        key: 'liveVouchersList',
        value: fromJS(activityRes.res.context || [])
      });
    } else {
      message.error(pageRes.res.message);
    }
  };

  /**
   * 福袋列表
   */
  onBagListPageBut = async () => {
    const param = this.state()
      .get('searchBagData')
      .toJS();
    const { liveId } = this.state().get('detail');
    let { res } = await webApi.liveBagRecordListt({ ...param, liveId });
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('init:liveBagList', fromJS(res.context || []));
    } else {
      message.error(res.message);
    }
  };

  /**
   * 查看领券记录
   */
  onVouchersRecord = async (activityId) => {
    const { res } = await webApi.getRecord({
      pageNum: 0,
      pageSize: 10000,
      activityId
    });
    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('info:actor:form', {
          key: 'liveVouchersInfoList',
          value: fromJS(res.context.content || [])
        });
        this.changeLiveInfo('isModalVisible', true);
      });
    } else {
      message.error(res.message);
    }
  };
  /**
   * 修改搜索 条件值
   */

  onFormFieldChange = (key, value) => {
    this.dispatch('form: field', { key, value });
  };

  /**
   * 修改值
   */
  changeLiveInfo = (key, value) => {
    this.dispatch('info:actor:form', { key, value });
  };
  /**
   * tab切换
   */
  changeLiveListTab = (value) => {
    if (value == 3) {
    }
    this.dispatch('info:setLiveTab', value);
  };
}
