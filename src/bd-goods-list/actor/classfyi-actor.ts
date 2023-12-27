import { Actor, Action, IMap } from 'plume2';
import { IList } from 'typings/globalType';

export default class ClassfyiActor extends Actor {
  defaultState() {
    return {
      classfyiVisible: false,
      cateId: '',
      goodsIds: [],
      cateModalList: []
    };
  }

  @Action('classfyi: classfyiVisible')
  setClassfyiVisible(state: IMap, classfyiVisible: boolean) {
    return state.set('classfyiVisible', classfyiVisible);
  }

  @Action('classfyi: cateId')
  setCateId(state: IMap, cateId: string) {
    return state.set('cateId', cateId);
  }

  @Action('classfyi: cateModalList')
  setCateModalList(state: IMap, dataList: IList) {
    // 改变数据形态，变为层级结构
    const newDataList = dataList
      .filter((item) => item.get('cateParentId') == 0)
      .map((data) => {
        const children = dataList
          .filter((item) => item.get('cateParentId') == data.get('cateId'))
          .map((childrenData) => {
            const lastChildren = dataList.filter(
              (item) => item.get('cateParentId') == childrenData.get('cateId')
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
    return state
      .set('cateModalList', newDataList)
      .set('sourceCateList', dataList);
    // return state.set('cateModalList', cateModalList);
  }

  @Action('classfyi: goodsIds')
  setGoodsIds(state: IMap, goodsIds: string[]) {
    return state.set('goodsIds', goodsIds);
  }
}
