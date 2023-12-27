import { Actor, Action } from 'plume2';
import { fromJS } from 'immutable';
import { IMap } from 'typings/globalType';

interface IPageResponse {
  content: Array<any>;
  size: number;
  totalElements: number;
}

export default class InfoActor extends Actor {
  defaultState() {
    return {
      // 数据总条数
      total: 0,
      // 每页显示条数
      pageSize: 10,
      // 当前页的数据列表
      dataList: [],
      // 当前页码
      current: 1,
      // 数据是否正在加载中
      loading: true,
      // 搜索项信息
      searchData: {},
      // 设置勾选的id
      checkedIds: [],
      // 弹框是否展示
      visible: false,
      // 新增/编辑的表单信息
      formData: {},
      // 批量导出弹框 modal状态
      exportModalData: {},
      // 规则配置 仓库Tab
      ruleTabList: [],
      currentRultTab: '',
      // 同步弹框是否展示
      syncVisible: false,
      // 同步弹框类型 1规则同步 2物流公司同步
      syncType: 1,
      // 自营商家数据
      storeList: [],
      // 0: 托运部，1：指定物流
      urlType: 0
    };
  }

  @Action('setUrlType: change')
  setUrlType(state, val) {
    return state.set('urlType', val);
  }

  @Action('ruleTabList: change')
  changeRuleTab(state, val) {
    return state.set('ruleTabList', val);
  }

  @Action('currentRultTab: change')
  currentRultTab(state, val) {
    return state.set('currentRultTab', val);
  }

  /**
   * 设置分页数据
   */
  @Action('info:setPageData')
  setPageData(state: IMap, res: IPageResponse) {
    const { content, size, totalElements } = res;
    return state.withMutations((state) => {
      state
        .set('total', totalElements)
        .set('pageSize', size)
        .set('dataList', fromJS(content));
    });
  }

  /**
   * 设置当前页码
   */
  @Action('info:setCurrent')
  setCurrent(state: IMap, current) {
    return state.set('current', current);
  }

  /**
   * 设置loading状态
   */
  @Action('info:setLoading')
  setLoading(state: IMap, loading) {
    return state.set('loading', loading);
  }

  /**
   * 设置新增/编辑弹框是否展示
   */
  @Action('info:setVisible')
  setVisible(state: IMap, visible) {
    return state.set('visible', visible);
  }

  /**
   * 设置新增/编辑的表单信息
   */
  @Action('info:setFormData')
  setFormData(state: IMap, data: IMap) {
    return state.set('formData', data);
  }

  /**
   * 修改新增/编辑的表单字段值
   */
  @Action('info:editFormData')
  editFormData(state: IMap, { key, value }) {
    return state.setIn(['formData', key], value);
  }

  /**
   * 修改搜索项信息
   */
  @Action('info:setSearchData')
  setSearchData(state: IMap, searchData) {
    return state.set('searchData', searchData);
  }

  /**
   * 设置勾选的id
   */
  @Action('info:setCheckedData')
  setCheckedData(state: IMap, ids) {
    return state.set('checkedIds', ids);
  }

  /**
   * 打开导出弹框 并设置 modal状态
   */
  @Action('info:exportModalShow')
  exportModalShow(state: IMap, exportModalData: IMap) {
    return state.set('exportModalData', exportModalData);
  }

  /**
   * 关闭导出弹框
   */
  @Action('info:exportModalHide')
  exportModalHide(state: IMap) {
    return state.setIn(['exportModalData', 'visible'], false);
  }

  /**
   * 数据更新
   */
  @Action('info:update')
  update(state: IMap, { key, value }) {
    return state.set(key, value);
  }

  /**
   * 自营商家数据
   */
  @Action('info:setStoreList')
  setStoreList(state: IMap, value) {
    return state.set('storeList', value);
  }
}
