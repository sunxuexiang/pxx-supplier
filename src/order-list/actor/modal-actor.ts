import { Actor, Action, IMap } from 'plume2';
import { List } from 'immutable';

declare type IList = List<any>;
export default class ModalActor extends Actor {
  defaultState() {
    return {
      //显示订单发货modal
      visible: false,
      //显示修改运单号modal
      changeVisible: false,
      //订单信息
      detail: {},
      //快递公司list
      expressCompanyList: [],
      //托运部公司list
      logisticsCompanyList: [],
      loading: false,
      // 接货点list
      marketShipmentList: [],
      // 快递到家发货点list
      shippingList: [],
      //显示预售到货modal
      presaleVisible: false,
      //预售订单信息
      presaleDetail: {}
    };
  }

  @Action('modal:visible')
  setVisible(state: IMap, visible: boolean) {
    return state.set('visible', visible);
  }

  @Action('modal:marketShipmentList')
  setMarketShipmentList(state: IMap, marketShipmentList) {
    return state.set('marketShipmentList', marketShipmentList);
  }

  @Action('modal:shippingList')
  setShippingList(state: IMap, shippingList) {
    return state.set('shippingList', shippingList);
  }

  @Action('modal:presaleVisible')
  setPresaleVisible(state: IMap, visible: boolean) {
    return state.set('presaleVisible', visible);
  }

  @Action('modal:changeVisible')
  setChangeVisible(state: IMap, changeVisible: boolean) {
    return state.set('changeVisible', changeVisible);
  }

  @Action('modal:detail')
  setDetail(state: IMap, detail: Object) {
    return state.set('detail', detail);
  }

  @Action('modal:presaleDetail')
  setPresaleDetail(state: IMap, detail: Object) {
    return state.set('presaleDetail', detail);
  }

  @Action('modal:expressCompanyList')
  setExpressCompanyList(state: IMap, expressCompanyList: IList) {
    return state.set('expressCompanyList', expressCompanyList);
  }

  @Action('modal:logisticsCompanyList')
  setLogisticsCompanyList(state: IMap, logisticsCompanyList: IList) {
    return state.set('logisticsCompanyList', logisticsCompanyList);
  }

  @Action('modal:loading')
  setLoading(state: IMap, loading: boolean) {
    return state.set('loading', loading);
  }
}
