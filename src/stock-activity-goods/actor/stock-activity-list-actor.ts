import { Action, Actor } from 'plume2';
import { fromJS } from 'immutable';

export default class StockListActor extends Actor {
  defaultState() {
    return {
      //选择的标签
      wareId: 1,
      wareHouseVOPage:[],
      //商品选择框
      modalVisible:false,
      selectedSkuIds:fromJS([]),
      selectedRows:fromJS([]),
      searchParams:{},//选择商品选择框导出
      //商品选择框结束
      form: {
        activityName: '',
        cateId:''
      },
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前页
      pageNum: 1,
      activityGoodsList: [],
      // levelList: [],
      activityId:null,
      cateList:[],
      brandsList:[],
    };
  }

  @Action('tab: change')
  changeTab(state, key) {
    return state.set('wareId', key);
  }

  @Action('actor: change')
  changeActor(state, {key,value}) {
    return state.set(key, value);
  }

  @Action('form: field')
  formFiledChange(state, { key, value }) {
    return state.setIn(['form', key], value);
  }

  @Action('init')
  init(state, { activityList, total,pageSize, pageNum }) {
    return state
      .set('activityGoodsList', activityList)
      .set('total', total)
      .set('pageSize',pageSize)
      .set('pageNum', pageNum);
  }

  // @Action('activity: start')
  // setActivityStart(state, id) {
  //   const list = state.get('activityGoodsList').map((item) => {
  //     if (id != item.get('activityId')) {
  //       return item;
  //     }
  //     return item.set('pauseFlag', 1);
  //   });
  //   return state.set('activityGoodsList', list);
  // }

  // @Action('activity: pause')
  // setActivityPause(state, id) {
  //   const list = state.get('activityGoodsList').map((item) => {
  //     if (id != item.get('activityId')) {
  //       return item;
  //     }
  //     return item.set('pauseFlag', 2);
  //   });
  //   return state.set('activityGoodsList', list);
  // }

  // @Action('init: Level')
  // initLevel(state, levelData) {
  //   const list =
  //     levelData.size == 0
  //       ? fromJS([])
  //       : levelData.map((item) => {
  //           let data = { key: '', value: '' };
  //           data.key = item.get('customerLevelId');
  //           data.value = item.get('customerLevelName');
  //           return fromJS(data);
  //         });
  //   return state.set('levelList', list);
  // }
}
