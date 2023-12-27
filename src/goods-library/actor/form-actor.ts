import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      // 模糊条件-商品名称
      likeGoodsName: '',
      // 品牌编号
      brandId: '-1',
      // 类目
      cateId: '-1',
      erpNos: '',
      ffskus: '',
      pageNum: 0,
      pageSize: 10
    };
  }

  @Action('form:field')
  formFieldChange(state: IMap, { key, value }) {
    return state.set(key, value);
  }
}
