import { Actor, Action } from 'plume2';
import { fromJS } from 'immutable';
import { IMap } from 'typings/globalType';

interface IPageResponse {
  content: Array<any>;
  size: number;
  totalElements: number;
}

export default class InfoActor extends Actor {
  defaultState() {
    return {
      areaAry: fromJS([]),
      cityName: fromJS([]),

      cityAreaAry: fromJS([]),
      areaName: fromJS([]),

      id: null,
      five_pcsNumber: 5,
      ten_pcsNumber: 10,
      areaParam: {
        destinationArea: fromJS([]),
        destinationAreaName: fromJS([])
      },
      cityAreaParam: {
        destinationArea: fromJS([]),
        destinationAreaName: fromJS([])
      },
      wareId: null,
      openFlag: 0,
      liswre: []
    };
  }

  /**
   * 初始化
   */
  @Action('areas: init')
  init(state: IMap, param) {
    console.log(param, 'paramparam');

    return state
      .set('areaAry', fromJS(param.areaAry))
      .set('id', param.id)
      .set('cityAreaAry', fromJS(param.cityAreaAry))
      .set('cityName', fromJS(param.cityName))
      .set('areaName', fromJS(param.areaName))
      .set('cityAreaId', param.cityAreaId)
      .set('five_pcsNumber', param.five_pcsNumber)
      .set('ten_pcsNumber', param.ten_pcsNumber)
      .set('wareId', param.wareId)
      .set('openFlag', param.openFlag);
  }

  @Action('wareIdas: init')
  wareIdInit(state: IMap, wareId) {
    return state.set('wareId', wareId);
  }

  /**
   * 初始化
   */
  @Action('number: set')
  numbersChnage(state: IMap, param) {
    return state.set(param.keys, param.value);
  }

  /**
   * 初始化
   */
  @Action('openFlag: set')
  openFlagChange(state: IMap, val) {
    return state.set('openFlag', val);
  }

  /**
   * 初始化
   */
  @Action('liswre: init')
  liswre(state: IMap, param) {
    return state.set('liswre', param);
  }
  /**
   * 保存
   */
  @Action('areas: changeArea')
  changeArea(state: IMap, param) {
    console.info('--changeArea--');
    return state
      .setIn(['areaParam', 'destinationArea'], fromJS(param.value))
      .set('areaAry', fromJS(param.value))
      .setIn(['areaParam', 'destinationAreaName'], fromJS(param.label));
  }

  @Action('areas: changeCityArea')
  changeCityArea(state: IMap, param) {
    console.info('--changeCityArea--');
    console.log(param);

    return state
      .setIn(['cityAreaParam', 'destinationArea'], fromJS(param.value))
      .set('cityAreaAry', fromJS(param.value))
      .setIn(['cityAreaParam', 'destinationAreaName'], fromJS(param.label));
  }
}
