import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      // 模糊条件-商品名称
      likeGoodsName: '',
      // 模糊条件-SKU编码
      likeGoodsInfoNo: '',
      // 模糊条件-SPU编码
      likeGoodsNo: '',
      // 查询条件-审核状态List,默认查询待审核, 审核未通过, 禁售中的
      auditStatusList: [0, 2, 3],
      // 当前选中tab页下标
      tabIndex: '1',
      // 商品分类
      storeCateId: '-1',
      // 品牌编号
      brandId: '-1',
      // 销售类别 批发or零售
      saleType: '-1',
      pageNum: 0,
      pageSize: 10
    };
  }

  @Action('form:field')
  formFieldChange(state: IMap, { key, value }) {
    return state.set(key, value);
  }
}
