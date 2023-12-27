import { Actor, Action, IMap } from 'plume2';
import { Map, fromJS } from 'immutable';
import { detail } from '@/groupon-add/webapi';

export default class DetailActor extends Actor {
  defaultState() {
    return {
      detail: {},
      // 表单内容
      formData: {},
      modalVisible: false,
      sellerRemarkVisible: true,
      // 卖家备注修改
      remedySellerRemark: '',
      //拒绝订单
      orderRejectModalVisible: false,
      // 订单是否需要审核
      needAudit: false,

      //供应商订单数量
      supplierNum: [],
      sNum: 0,
      //自提码兑换弹框
      modalPickUpVisible: false,
      //物流信息弹框
      modalLogisticsVisible: false,
      //物流公司信息
      companyInfo: [],
      //收获点弹框
      areaVisible: false,
      //选中的物流公司id
      company: {},
      //收货站点信息
      areaInfo: ''
    };
  }

  @Action('detail:init')
  init(state: IMap, res: Object) {
    return state.update('detail', (detail) => detail.merge(res));
  }

  @Action('detail:setNeedAudit')
  setNeedAudit(state: IMap, need) {
    return state.set('needAudit', need);
  }

  @Action('detail-actor:changeDeliverNum')
  changeDeliverNum(state: IMap, { skuId, isGift, num }) {
    return state.update('detail', (detail) => {
      if (isGift) {
        return detail.setIn(
          [
            'gifts',
            detail.get('gifts').findIndex((item) => skuId == item.get('skuId')),
            'deliveringNum'
          ],
          num
        );
      } else {
        return detail.setIn(
          [
            'tradeItems',
            detail
              .get('tradeItems')
              .findIndex((item) => skuId == item.get('skuId')),
            'deliveringNum'
          ],
          num
        );
      }
    });
  }

  @Action('detail-actor:changeDeliverNumS')
  changeDeliverNumS(state: IMap, { skuId, isGift, num, index }) {
    let list = state
      .get('detail')
      .get('tradeVOList')
      .get(index);
    let a;
    if (isGift) {
      a = list.setIn(
        [
          'gifts',
          list.get('gifts').findIndex((item) => skuId == item.get('skuId')),
          'deliveringNum'
        ],
        num
      );
    } else {
      a = list.setIn(
        [
          'tradeItems',
          list
            .get('tradeItems')
            .findIndex((item) => skuId == item.get('skuId')),
          'deliveringNum'
        ],
        num
      );
    }
    return state
      .update('detail', (detail) => {
        return detail.setIn(['tradeVOList', index], a);
      })
      .set('sNum', index);
  }

  @Action('detail-actor:changePrice')
  changePrice(state: IMap, { key, value, index }) {
    let list = state
      .get('detail')
      .get('tradeItems')
      .get(index)
      .toJS();
    list[key] = value;
    list.hasChanged = true;

    const tradePrice = state
      .get('detail')
      .get('tradePrice')
      .toJS();
    const tradeItems = state
      .get('detail')
      .get('tradeItems')
      .toJS();
    tradeItems[index][key] = value;
    tradeItems[index].hasChanged = true;
    tradePrice.goodsPrice = 0;
    let allZkPrice = 0;
    tradeItems.forEach((item) => {
      tradePrice.goodsPrice += Number(item.changedPrice) * item.num;
      allZkPrice += Number(item.zkPrice);
    });
    tradePrice.totalPrice =
      tradePrice.goodsPrice - allZkPrice + tradePrice.deliveryPrice;
    return state.update('detail', (detail) => {
      return detail
        .set('tradeItems', fromJS(tradeItems))
        .set('tradePrice', fromJS(tradePrice));
    });
  }

  /**
   * 显示发货modal
   */
  @Action('detail-actor:showDelivery')
  show(state, needClear: boolean) {
    if (needClear) {
      state = state.set('formData', Map());
    }
    return state.set('modalVisible', true);
  }

  /**
   * 关闭发货modal
   * @param state
   */
  @Action('detail-actor:hideDelivery')
  hide(state) {
    return state.set('modalVisible', false);
  }

  /**
   * 显示自提modal
   */
  @Action('detail-actor:showPickUp')
  showPickUp(state) {
    return state.set('modalPickUpVisible', true);
  }

  /**
   * 关闭自提modal
   * @param state
   */
  @Action('detail-actor:hidePickUp')
  hidePickUp(state) {
    return state.set('modalPickUpVisible', false);
  }

  /**
   * 显示驳回弹框
   * @param state
   */
  @Action('detail-actor:reject:show')
  showRejectModal(state: IMap) {
    return state.set('orderRejectModalVisible', true);
  }

  /**
   *关闭驳回弹框
   * @param state
   */
  @Action('detail-actor:reject:hide')
  hideRejectModal(state: IMap) {
    return state.set('orderRejectModalVisible', false);
  }

  @Action('detail-actor:modalLogisticsVisible')
  modalLogisticsVisible(state: IMap, param: boolean) {
    return state.set('modalLogisticsVisible', param);
  }

  /**
   * 显示/取消收获点信息
   * @param state
   * @returns {Map<string, boolean>}
   */
  @Action('detail-actor:areaVisible')
  areaVisibleVisible(state: IMap, param: boolean) {
    return state.set('areaVisible', param);
  }

  /**
   * 显示/取消卖家备注修改
   * @param state
   * @returns {Map<string, boolean>}
   */
  @Action('detail-actor:setSellerRemarkVisible')
  setSellerRemarkVisible(state: IMap, param: boolean) {
    return state.set('sellerRemarkVisible', param);
    // .set('remedySellerRemark', '');
  }

  /**
   * 修改卖家备注
   * @param state
   * @param param
   * @returns {Map<string, boolean>}
   */
  @Action('detail-actor:remedySellerRemark')
  remedySellerRemark(state: IMap, param: boolean) {
    return state.set('remedySellerRemark', param);
  }

  /**
   * 修改 供应商数组
   * @param state
   * @param param
   * @returns {Map<string, boolean>}
   */
  @Action('detail:num')
  SellerRemark(state: IMap, param) {
    return state.set('supplierNum', fromJS(param));
  }

  @Action('detail:companyInfo')
  companyInfoInit(state: IMap, param) {
    return state.set('companyInfo', fromJS(param));
  }

  /**
   * 显示/取消供应商备注修改
   * @param state
   * @returns {Map<string, boolean>}
   */
  @Action('detail-actor:setSelfSellerRemarkVisible')
  setSelfSellerRemarkVisible(state: IMap, { key, param }) {
    return state
      .setIn(['supplierNum', key, 'selfSellerRemarkVisible'], param)
      .setIn(['supplierNum', key, 'selfRemedySellerRemark'], '');
  }
  /**
   * 修改供应商备注
   * @param state
   * @param param
   * @returns {Map<string, boolean>}
   */
  @Action('detail-actor:selfRemedySellerRemark')
  selfRemedySellerRemark(state: IMap, { key, param }) {
    return state.setIn(['supplierNum', key, 'selfRemedySellerRemark'], param);
  }

  @Action('detail-actor:changeAreaInfo')
  changeAreaInfo(state: IMap, param) {
    return state.set('areaInfo', param);
  }

  @Action('detail-actor:changeCompanyId')
  changeCompanyId(state: IMap, param) {
    return state.set('company', fromJS(param));
  }
}
