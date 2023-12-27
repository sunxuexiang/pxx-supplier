import { Actor, Action, IMap } from 'plume2';

export default class ModalActor extends Actor {
  defaultState() {
    return {
      //变更当前账号是否显示
      accountVisible: false,
      //确认首次打款是否显示
      moneyVisible: false,
      // 确认删除账号
      deleteVisible: false,
      //确认收到打款弹框内容
      moneyModalContent: {},
      //更改账户信息弹框内容
      accountModalContent: {},
      //删除账户弹框内容
      deleteModalContent: {}
    };
  }

  /**
   * 变更当前账号
   */
  @Action('modalActor: accountModal')
  clickAccount(state) {
    return state.set('accountVisible', !state.get('accountVisible'));
  }

  /**
   *  确认首次打款弹框
   */
  @Action('modalActor: moneyModal')
  clickMoney(state) {
    return state.set('moneyVisible', !state.get('moneyVisible'));
  }

  /**
   *  确认删除账号弹框
   */
  @Action('modalActor: deleteModal')
  clickDelete(state) {
    return state.set('deleteVisible', !state.get('deleteVisible'));
  }

  /**
   * 确认收到打款弹框内容
   * @param state
   * @param content
   */
  @Action('modalActor:moneyModal:content')
  moneyModal(state, content) {
    return state.set('moneyModalContent', content);
  }

  /**
   *
   * @param state
   * @param content
   */
  @Action('modalActor:accountModal:content')
  accountModal(state, content) {
    return state.set('accountModalContent', content);
  }

  /**
   * 更改账号信息字段
   * @param state
   * @param field
   * @param value
   * @returns {any}
   */
  @Action('modalActor:change:account')
  changeAccount(state: IMap, { field, value }) {
    return state.setIn(['accountModalContent', field], value);
  }

  @Action('modalActor:deleteModal:content')
  deleteModal(state: IMap, res) {
    return state.set('deleteModalContent', res);
  }
}
