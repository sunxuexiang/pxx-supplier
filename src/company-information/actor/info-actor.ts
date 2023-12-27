import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      infomation: {
        companyName: '',
        provinceId: '',
        cityId: '',
        areaId: '',
        detailAddress: '',
        contactName: '',
        contactPhone: '',
        copyright: '',
        companyDescript: ''
      }
    };
  }

  constructor() {
    super();
  }

  /**
   * 初始化
   * @param state
   * @param info
   * @returns {Map<K, V>}
   */
  @Action('infomation:init')
  init(state: IMap, info) {
    return state.mergeIn(['infomation'], info);
  }

  /**
   * 编辑
   * @param state
   * @param data
   */
  @Action('infomation:editInfo')
  editInfo(state, data: IMap) {
    return state.update('infomation', infomation => infomation.merge(data));
  }
}
