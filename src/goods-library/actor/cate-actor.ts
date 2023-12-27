import { Actor, Action } from 'plume2';
import { List } from 'immutable';

declare type IList = List<any>;

export default class CateActor extends Actor {
  defaultState() {
    return {
      cateList: [] //层级结构的分类列表
    };
  }

  @Action('cateActor: init')
  init(state, dataList: IList) {
    // 改变数据形态，变为层级结构

    const newDataList = dataList
      .filter(item => item.get('cateParentId') == 0)
      .map(data => {
        const children = dataList
          .filter(item => item.get('cateParentId') == data.get('cateId'))
          .map(childrenData => {
            const lastChildren = dataList.filter(
              item => item.get('cateParentId') == childrenData.get('cateId')
            );
            if (!lastChildren.isEmpty()) {
              childrenData = childrenData.set('children', lastChildren);
            }
            return childrenData;
          });

        if (!children.isEmpty()) {
          data = data.set('children', children);
        }
        return data;
      });
    return state.set('cateList', newDataList);
  }
}
