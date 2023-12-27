import { Action, Actor } from 'plume2';
import { List } from 'immutable';

declare type IList = List<any>;

export default class CateActor extends Actor {
  defaultState() {
    return {
      cateList: [], //层级结构的分类列表
      allCateList: [] //扁平的分类列表
    };
  }

  @Action('cateActor: init')
  init(state, cateList: IList) {
    // 改变数据形态，变为层级结构(目前最多2层)
    const newDataList = cateList
      .filter(item => item.get('cateParentId') == 0)
      .map(data => {
        const children = cateList.filter(
          item => item.get('cateParentId') == data.get('storeCateId')
        );
        if (!children.isEmpty()) {
          data = data.set('children', children);
        }
        return data;
      });
    return state.set('cateList', newDataList).set('allCateList', cateList);
  }
}
