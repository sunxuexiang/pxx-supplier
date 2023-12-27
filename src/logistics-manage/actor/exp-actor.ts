/**
 * Created by feitingting on 2017/6/20.
 */
import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class ExpActor extends Actor {
  defaultState() {
    return {
      checkedList: [],
      allExpressList: [],
      checkedRelation: {}
    };
  }

  constructor() {
    super();
  }

  /**
   * action建立actor的handle和store的dispatch之间的关联*/
  @Action('exp:init')
  init(state: IMap, content) {
    const { all, checked } = content;
    const relaMap = {};
    if (checked) {
      checked.forEach(rela => {
        relaMap[rela.expressCompanyId] = rela.id;
      });
    }

    all.forEach(express => {
      express['isChecked'] = relaMap[express['expressCompanyId']] != null;
    });

    return state.withMutations(state => {
      state
        .set('checkedList', fromJS(checked))
        .set('allExpressList', fromJS(all))
        .set('checkedRelation', fromJS(relaMap));
    });
  }

  @Action('exp:checked')
  checked(state: IMap, { index, checked }) {
    /**
     * 将第index个的对象的isChecked属性设置为当前的值
     * 后面批量操作进行设置的时候取的就是isChecked的值*/
    return state.setIn(['allExpressList', index, 'isChecked'], checked);
  }

  @Action('exp:afterChecked')
  afterChecked(state: IMap, { expressCompanyId, id }) {
    return state.mergeDeep({ checkedRelation: { [expressCompanyId]: id } });
  }

  @Action('exp:afterUnChecked')
  afterUnChecked(state: IMap, expressCompanyId) {
    return state.removeIn(['checkedRelation', expressCompanyId]);
  }
}
