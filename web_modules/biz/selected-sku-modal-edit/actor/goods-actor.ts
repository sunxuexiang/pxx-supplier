/**
 * Created by hht on 2018/2/28.
 */
import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class GoodsActor extends Actor {
  defaultState() {
    return {
      //商品列表（分页等）
      goodsInfoPage:{},
      loading:true,
      //选择商品信息
      selectedRows:fromJS([]),
      //选择的skuid
      selectedSkuIds:fromJS([]),
      //搜索条件
      searchForm:{
        wareId:null,
        brandId: '',
        cateId: '',
        goodsInfoType:'',
        
      },
      // skuModalData:{
        
      // },
      isExportModalData:0,
      // 批量导出弹框 modal状态
      exportModalData: {},
      //商品弹框
      visible:false,
      okBackFun:null
    };
  }

  constructor() {
    super();
  }

  @Action('goodsActor: init')
  goodsActorInit(state, value) {
    return state.set('goodsInfoPage', value).set('loading',false);
  }

  @Action('goodsActor: from')
  goodsActorFrom(state, {key,value}) {
    return state.set(key,value);
  }

  @Action('goodsActor: okBackFun')
  setOkBackFun(state, value) {
    return state.set('okBackFun', value);
  }

    /**
   * 设置新增/编辑的表单信息
   */
  @Action('info:search')
    setFormData(state: IMap, data: IMap) {
      return state.set('searchForm', data);
  }

  @Action('set: search')
  setSearch(state, {key,value}) {
    return state.setIn(['searchForm', key], value);
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

}
