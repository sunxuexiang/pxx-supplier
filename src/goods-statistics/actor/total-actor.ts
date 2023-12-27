/**
 * Created by feitingting on 2017/10/19.
 */
import { Actor, Action } from 'plume2';
export default class TotalActor extends Actor {
  defaultState() {
    return {
      //报表分类标记，0：商品报表，1：分类报表，2：品牌报表
      tableFlag: 0,
      //事件分类标记，0：今天，1：昨天，2：近7天，3：近30天，9:自然月
      dateFlag: 0,
      warehouseList:[],
      GoodsTotal: {},
      wareId:null,
      visible: false //下载弹框显示或隐藏
    };
  }

  @Action('goods:total')
  total(state, goodsTotal: any) {
    return state.update('GoodsTotal', GoodsTotal =>
      GoodsTotal.merge(goodsTotal)
    );
  }

  @Action('table:flag')
  tableFlag(state, flag) {
    return state.set('tableFlag', flag);
  }

  @Action('date:flag')
  dateFlag(state, flag) {
    return state.set('dateFlag', flag);
  }

  @Action('download:show')
  showModal(state) {
    return state.set('visible', true);
  }

  @Action('download:hide')
  hideModal(state) {
    return state.set('visible', false);
  }

  @Action('goods:total:companyInfoId')
  companyInfoId(state, id) {
    return state.set('companyInfoId', id);
  }

  @Action('goods:wareId')
  wareId(state, id) {
    return state.set('wareId', id);
  }

  @Action('form:warehouseList')
  warehouseList(state, flag) {
    return state.set('warehouseList', flag);
  }

}
