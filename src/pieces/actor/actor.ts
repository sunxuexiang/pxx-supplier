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
      areaParam: {
        destinationArea: fromJS([]),
        destinationAreaName: fromJS([])
      },
      cityAreaParam: {
        destinationArea: fromJS([]),
        destinationAreaName: fromJS([])
      }
    };
  }

  /**
   * 初始化
   */
  @Action('areas: init')
  init(state: IMap, param) {
    return state
      .set('areaAry', fromJS(param.areaAry))
      .set('id', param.id)
      .set('cityAreaAry', fromJS(param.cityAreaAry))
      .set('cityName', fromJS(param.cityName))
      .set('areaName', fromJS(param.areaName))
      .set('cityAreaId', param.cityAreaId);
  }
  /**
   * 保存
   */
  @Action('areas: changeArea')
  changeArea(state: IMap, param) {
    console.info('--changeArea--');
    return state
      .setIn(['areaParam', 'destinationArea'], fromJS(param.value))
      .setIn(['areaParam', 'destinationAreaName'], fromJS(param.label));
  }

  @Action('areas: changeCityArea')
  changeCityArea(state: IMap, param) {
    console.info('--cityAreaAry--');
    console.log(param);

    return state.set('cityAreaAry', fromJS(param));
  }
}
