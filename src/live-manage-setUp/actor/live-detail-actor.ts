import { Actor, Action } from 'plume2';
import { IMap } from 'typings/globalType';

export default class InfoActor extends Actor {
  defaultState() {
    return {
      detail: {},
      //人数列表
      LivePeopleList: [
        { title: '5个以下', value: 1 },
        { title: '5~10', value: 1 },
        { title: '11~20', value: 1 },
        { title: '21~30', value: 1 },
        { title: '31~40', value: 1 },
        { title: '41~50', value: 1 },
        { title: '51~60', value: 1 },
        { title: '61~70', value: 1 },
        { title: '71~80', value: 1 },
        { title: '81~90', value: 1 },
        { title: '91~100', value: 1 },
        { title: '100以上', value: 1 }
      ],
      //基础在线人数(人)
      peopleValue: null,
      currentLiveListTab: '1',
      LivePraiseList: [
        { title: '5个以下', value: 1 },
        { title: '5~10', value: 1 },
        { title: '11~20', value: 1 },
        { title: '21~30', value: 1 },
        { title: '31~40', value: 1 },
        { title: '41~50', value: 1 },
        { title: '51~60', value: 1 },
        { title: '61~70', value: 1 },
        { title: '71~80', value: 1 },
        { title: '81~90', value: 1 },
        { title: '91~100', value: 1 },
        { title: '100以上', value: 1 }
      ],
      praiseValue: null
    };
  }

  /**
   * 初始化详情页
   */
  @Action('init:detail')
  init(state, params) {
    return state.set('detail', params);
  }

  //修改人数
  @Action('LivePeopleList:edit')
  setliveGoodsList(state, params) {
    return state.set('LivePeopleList', params);
  }

  @Action('info:actor:form')
  setLiveActor(state, { key, value }) {
    return state.set(key, value);
  }

  @Action('info:setLiveTab')
  setLiveTab(state, value) {
    return state.set('currentLiveListTab', value);
  }
}
