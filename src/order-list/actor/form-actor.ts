import { Actor, IMap, Action } from 'plume2';
import { Map } from 'immutable';
import moment from 'moment';

export default class FormActor extends Actor {
  defaultState() {
    return {
      form: {
        tradeState: {
          // deliverStatus:'',
          // payState:'',
          // orderSource:''
        },
        orderRejectModalVisible: false,
        wareId: null,
        deliverWay: null,
        activityType: null,
        beginTime:
          moment().subtract(6, 'months').format('YYYY-MM-DD') +
          ' ' +
          '00:00:00',
        endTime: moment().format('YYYY-MM-DD') + ' ' + '23:59:59'
      },
      addonBeforeForm: {
        business: 'employeeName',
        buyerOptions: 'buyerName',
        receiverSelect: 'consigneeName',
        goodsOptions: 'skuName'
      }
    };
  }

  @Action('form:field')
  formFieldChange(state: IMap, params) {
    return state.update('form', (form) => form.mergeDeep(params));
  }

  @Action('form:field:val')
  formValFieldChange(state: IMap, { key, value, formName }) {
    return state.setIn([formName || 'form', key], value);
  }

  @Action('form:clear')
  formFieldClear(state: IMap) {
    return state.set('form', Map());
  }

  @Action('addonBeforeForm:field')
  addonBeforeFormFieldChange(state: IMap, params) {
    return state.update('addonBeforeForm', (form) => form.mergeDeep(params));
  }

  /**
   * 显示驳回弹框
   * @param state
   */
  @Action('order:list:reject:show')
  showRejectModal(state: IMap) {
    return state.set('orderRejectModalVisible', true);
  }

  /**
   *关闭驳回弹框
   * @param state
   */
  @Action('order:list:reject:hide')
  hideRejectModal(state: IMap) {
    return state.set('orderRejectModalVisible', false);
  }
}
