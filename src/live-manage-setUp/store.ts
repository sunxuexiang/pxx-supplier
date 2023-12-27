import { Store } from 'plume2';
import LiveDetailActor from './actor/live-detail-actor';
import { message } from 'antd';
import { Const, history } from 'qmkit';
import * as webApi from './webapi';
import { fromJS, Map } from 'immutable';
export default class AppStore extends Store {
  bindActor() {
    return [new LiveDetailActor()];
  }

  /**
   * 初始化方法
   */
  init = async (liveRoomId) => {
    let currentLiveListTab = this.state().get('currentLiveListTab');
    let LivePeopleList = this.state()
      .get('LivePeopleList')
      .toJS();
    let LivePraiseList = this.state()
      .get('LivePraiseList')
      .toJS();
    let { res }: any = await webApi.getById({
      liveRoomId: Number(liveRoomId),
      type: currentLiveListTab
    });
    if (res.code == Const.SUCCESS_CODE) {
      if (!res?.context) {
        res.context = { liveRoomId: Number(liveRoomId) };
      }
      this.dispatch('init:detail', fromJS(res?.context));
      let valList = res?.context.coefficient
        ? res?.context.coefficient.split(',')
        : [];
      if (res?.context.type == 1) {
        LivePeopleList = LivePeopleList.map((item, i) => {
          return { ...item, value: Number(valList[i]) };
        });
        this.dispatch('info:actor:form', {
          key: 'peopleValue',
          value: res?.context?.fixed
        });
        this.dispatch('LivePeopleList:edit', fromJS(LivePeopleList));
      } else {
        LivePraiseList = LivePraiseList.map((item, i) => {
          return { ...item, value: Number(valList[i]) };
        });
        this.dispatch('info:actor:form', {
          key: 'praiseValue',
          value: res?.context?.fixed
        });
        this.dispatch('info:actor:form', {
          key: 'LivePraiseList',
          value: fromJS(LivePraiseList)
        });
      }
    } else {
      message.error(res.message);
    }
  };

  //修改人数表信息
  onLivePeopleList = (key, value, index) => {
    let list = this.state()
      .get('LivePeopleList')
      .toJS();
    list[index][key] = value || 0;
    this.dispatch('LivePeopleList:edit', fromJS(list));
  };

  onLivePraiseList = (key, value, index) => {
    let list = this.state()
      .get('LivePraiseList')
      .toJS();
    list[index][key] = value || 0;
    this.changeLiveInfo('LivePraiseList', fromJS(list));
  };

  /**
   * 人数保存
   */
  onPeopleSave = async () => {
    let {
      currentLiveListTab,
      LivePeopleList,
      detail,
      peopleValue
    } = this.state().toJS();
    let { res } = await webApi.saveRule({
      type: currentLiveListTab,
      liveRoomId: detail.liveRoomId,
      beginNum: 5,
      fixed: peopleValue,
      coefficient: LivePeopleList.map((item) => item.value).join()
    });
    if (res.code == Const.SUCCESS_CODE) {
      message.success(res.message);
      // history.push({ pathname: `/live-manage` });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 点赞保存
   */
  onPraiseSave = async () => {
    let {
      currentLiveListTab,
      LivePraiseList,
      detail,
      praiseValue
    } = this.state().toJS();
    let { res } = await webApi.saveRule({
      type: currentLiveListTab,
      liveRoomId: detail.liveRoomId,
      beginNum: 5,
      fixed: praiseValue,
      coefficient: LivePraiseList.map((item) => item.value).join()
    });
    if (res.code == Const.SUCCESS_CODE) {
      message.success(res.message);
      // history.push({ pathname: `/live-manage` });
    } else {
      message.error(res.message);
    }
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
    this.dispatch('info:setLiveTab', value);
    let { liveRoomId } = this.state()
      .get('detail')
      .toJS();
    console.log(liveRoomId);
    this.init(liveRoomId);
  };
}
