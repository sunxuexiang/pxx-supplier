import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class TemplateActor extends Actor {
  defaultState() {
    return {
      includePageTypeList: 'index',
      dataList: [],
      //当前的数据总数
      total: 0,
      platform: '',
      typeList: 'ADMIN',
      // 当前编辑的标题
      inputEdit: {
        isShow: false,
        id: '',
        title: ''
      },
      storeId: ''
    };
  }

  @Action('listActor:init')
  init(state: IMap, res) {
    const { list, totalCount } = res.data;

    return state.withMutations((state) => {
      state.set('total', totalCount).set('dataList', fromJS(list));
    });
  }

  @Action('typeList:set')
  setTypeList(state: IMap, typeList: string) {
    return state.set('typeList', typeList);
  }

  @Action('platform:set')
  setPlatfrom(state: IMap, platform: string) {
    return state.set('platform', platform);
  }

  @Action('includePageTypeList:set')
  setIncludePageTypeList(state: IMap, includePageTypeList) {
    return state.set('includePageTypeList', includePageTypeList);
  }

  @Action('form:platform')
  checkState(state: IMap, index: string) {
    return state.set('platform', index);
  }

  @Action('edit:set')
  setEdit(state: IMap, inputEdit) {
    return state.set('inputEdit', inputEdit);
  }

  @Action('listActor:updateTitle')
  updateTitle(state: IMap, inputEdit) {
    return state.update('dataList', (dataList) => {
      const index = dataList.findIndex(
        (info) => info.get('_id') === inputEdit.id
      );
      return dataList.update(index, (item) =>
        item.set('name', inputEdit.title)
      );
    });
  }
  @Action('store:storeId')
  setStoreId(state: IMap, storeId) {
    return state.set('storeId', storeId);
  }
}
