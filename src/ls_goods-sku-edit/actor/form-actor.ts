import { Actor, Action } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      skuForm: {},
      levelPriceForm: {},
      userPriceForm: {},
      areaPriceForm: {},
      addedFlagForm: {},
      isScatteredQuantitative: {}
    };
  }

  @Action('formActor:sku')
  updateSkuForm(state, skuForm) {
    return state.set('skuForm', skuForm);
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
  @Action('formActor:setisScatteredQuantitative')
  editGoodsisscatt(state, isScatteredQuantitative) {
    return state.set('isScatteredQuantitative', isScatteredQuantitative);
  }

  @Action('formActor:addedFlag')
  updateAddedFlagForm(state, addedFlagForm) {
    return state.set('addedFlagForm', addedFlagForm);
  }
}
