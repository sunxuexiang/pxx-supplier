import { Actor, Action } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      goodsForm: {},
      skuForm: {},
      specForm: {},
      levelPriceForm: {},
      userPriceForm: {},
      areaPriceForm: {},
      logisticsForm: {},
      //分销 切换类型是否要提示
      checkFlag: false,
      //企业购提示按钮
      enterpriseFlag: false
    };
  }

  @Action('formActor:goods')
  updateGoodsForm(state, goodsForm) {
    return state.set('goodsForm', goodsForm);
  }

  @Action('formActor:logistics')
  updateLogisticsForm(state, logisticsForm) {
    return state.set('logisticsForm', logisticsForm);
  }

  @Action('formActor:sku')
  updateSkuForm(state, skuForm) {
    return state.set('skuForm', skuForm);
  }

  @Action('formActor:spec')
  updateSpecForm(state, specForm) {
    return state.set('specForm', specForm);
  }

  @Action('formActor:levelprice')
  updateLevelPriceForm(state, levelPriceForm) {
    return state.set('levelPriceForm', levelPriceForm);
  }

  @Action('formActor:userprice')
  updateUserPriceForm(state, userPriceForm) {
    return state.set('userPriceForm', userPriceForm);
  }

  @Action('formActor:areaprice')
  updateAreaPriceForm(state, areaPriceForm) {
    return state.set('areaPriceForm', areaPriceForm);
  }

  @Action('formActor:check')
  setCheckFlag(state, value) {
    return state.set('checkFlag', value);
  }

  @Action('formActor:enterpriseFlag')
  setEnterpriseFlag(state, value) {
    return state.set('enterpriseFlag', value);
  }
}
