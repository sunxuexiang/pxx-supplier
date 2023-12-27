import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

interface IRefundOrderPageResponse {
  content: Array<any>;
  size: number;
  total: number;
  pageNum: Number;
}

export default class ListActor extends Actor {
  defaultState() {
    return {
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前的商品列表
      goodsInfoList: fromJS([]),
      current: 1,
      form: {
        customerAccount: '',
        couponName: ''
      },
    };
  }

  /**
   * 数据初始化
   * @param state
   * @param res
   * @returns {Map<K, V>}
   */
  @Action('list:inits')
  inits(state: IMap, res: IRefundOrderPageResponse) {
    console.log(res,'data, pageSize, total');

    const { content, size, total,pageNum } = res;
    
    return state.set('total', total)
    .set('pageSize', size)
    .set('pageNum', pageNum)
    .set('goodsInfoList',content);
  }

  @Action('form: field')
  formFiledChange(state, { key, value }) {
    return state.setIn(['form', key], value);
  }

  @Action('current')
  current(state: IMap, current: number) {
    return state.set('current', current);
  }
}
