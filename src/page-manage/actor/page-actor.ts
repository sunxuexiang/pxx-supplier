import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class PageActor extends Actor {
  defaultState() {
    return {
      visible: false,
      loading: false,
      dataList: [],
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前页
      currentPage: 1,
      includePageTypeList: ['index'],
      typeList: 'ADMIN',
      platform: '',
      templateList: [],
      inputEdit: {
        isShow: false,
        id: '',
        title: ''
      },
      storeId: ''
    };
  }

  @Action('templateList:set')
  setTemplateList(state: IMap, templateList) {
    return state.set('templateList', templateList);
  }

  @Action('platform:set')
  setPlatfrom(state: IMap, platform: string) {
    return state.set('platform', platform);
  }

  @Action('visible:set')
  setVisible(state: IMap, visible: boolean) {
    return state.set('visible', visible);
  }

  @Action('includePageTypeList:set')
  setIncludePageTypeList(state: IMap, includePageTypeList) {
    return state.set('includePageTypeList', includePageTypeList);
  }

  @Action('listActor:init')
  init(state: IMap, res) {
    const { pageInfoList, totalCount } = res.data;

    return state.withMutations((state) => {
      state.set('total', totalCount).set('dataList', fromJS(pageInfoList));
    });
  }

  @Action('list:currentPage')
  currentPage(state: IMap, current) {
    return state.set('currentPage', current);
  }

  @Action('form:platform')
  checkState(state: IMap, index: string) {
    return state.set('platform', index);
  }

  @Action('loading:start')
  start(state: IMap) {
    return state.set('loading', true);
  }

  @Action('loading:end')
  end(state: IMap) {
    return state.set('loading', false);
  }

  @Action('edit:set')
  setEdit(state: IMap, inputEdit) {
    return state.set('inputEdit', inputEdit);
  }

  @Action('store:storeId')
  setStoreId(state: IMap, storeId) {
    return state.set('storeId', storeId);
  }
}
