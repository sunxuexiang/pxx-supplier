import { Actor, Action, IMap } from 'plume2';

export default class EditActor extends Actor {
  defaultState() {
    return {
      accountForm: {
        // 账户ID
        accountId: null,
        // 账户名称
        accountName: '',
        // 开户银行
        bankName: '',
        // 银行账户
        bankNo: ''
      },
      edit: false
    };
  }

  constructor() {
    super();
  }

  @Action('edit:init')
  init(state: IMap, account) {
    return state.mergeIn(['accountForm'], account);
  }

  @Action('edit')
  edit(state: IMap, isEdit) {
    return state.set('edit', isEdit);
  }
}
