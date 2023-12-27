import { Action, Actor } from 'plume2';
import { IList, IMap } from 'typings/globalType';
import { fromJS, List, Map, OrderedMap } from 'immutable';
export default class GoodsActor extends Actor {
  defaultState() {
    return {
      // 平台类目信息
      cateList: [],
      sourceCateList: [],
      // 店铺分类信息
      storeCateList: [],
      sourceStoreCateList: [],
      // 品牌信息
      brandList: [],
      labelList: [], // 标签列表
      // 商品信息
      goods: {
        // 分类编号
        cateId: '',
        // 品牌编号
        brandId: '',
        // 商品名称
        goodsName: '',
        // SPU编码
        goodsNo: '',
        // 商品标签
        labelIdStr: [],
        // 计量单位
        goodsUnit: '',
        // 上下架状态
        addedFlag: 1,
        // 商品详情
        goodsDetail: '',
        // 门店价
        mktPrice: '',
        // 成本价
        costPrice: '',
        goodsSubTitle: '',
        //商品视频
        goodsVideo: '',
        //是否允许独立设价
        allowPriceSet: 0,
        saleType: 0,
        goodsSource: 1
      },
      // 是否编辑商品
      isEditGoods: false,
      //保存状态loading
      saveLoading: false,
      detailEditor: {},
      detailEditor_0: {},
      detailEditor_1: {},
      detailEditor_2: {},
      tabDetailEditor: {},
      editor: 'detail',
      // 当前处于基础信息tab还是价格tab：main | price
      activeTabKey: 'main',
      isProviderGoods: false,
      // 平台类目是否禁用，默认是，如果是新增商品，改成false
      cateDisabled: true,
      goodsTabs: [],
      //正在进行或将要进行的抢购商品
      flashsaleGoods: []
    };
  }

  /**
   * 初始化分类
   * @param state
   * @param dataList
   */
  @Action('goodsActor: initCateList')
  initCateList(state, dataList: IList) {
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
    return state.set('cateList', newDataList).set('sourceCateList', dataList);
  }

  /**
   * 初始化店铺分类
   * @param state
   * @param dataList
   */
  @Action('goodsActor: initStoreCateList')
  initStoreCateList(state, dataList: IList) {
    // 改变数据形态，变为层级结构
    const newDataList = dataList
      .filter((item) => item.get('cateParentId') == 0)
      .map((data) => {
        const children = dataList
          .filter((item) => item.get('cateParentId') == data.get('storeCateId'))
          .map((childrenData) => {
            const lastChildren = dataList.filter(
              (item) =>
                item.get('cateParentId') == childrenData.get('storeCateId')
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
      .set('storeCateList', newDataList)
      .set('sourceStoreCateList', dataList);
  }

  /**
   * 初始化品牌
   * @param state
   * @param brandList
   */
  @Action('goodsActor: initBrandList')
  initBrandList(state, brandList: IList) {
    return state.set('brandList', brandList);
  }

  @Action('goodsActor: isEditGoods')
  isEditGoods(state, isEditGoods) {
    return state.set('isEditGoods', isEditGoods);
  }

  @Action('goodsActor: tabChange')
  tabChange(state, activeKey) {
    return state.set('activeTabKey', activeKey);
  }

  @Action('goodsActor: detailEditor')
  detailEditor(state, detailEditor) {
    return state.set('detailEditor', detailEditor);
  }

  @Action('goodsActor: tabDetailEditor')
  tabDetailEditor(state, data) {
    return state.set(data.tab, data);
  }

  @Action('goodsActor: goodsTabs')
  goodsTabs(state, goodsTabs) {
    return state.set('goodsTabs', goodsTabs);
  }
  @Action('goodsActor:labelList')
  labelList(state, labelList) {
    return state.set('labelList', labelList);
  }

  /**
   * 修改商品信息
   * @param state
   * @param data
   */
  @Action('goodsActor: editGoods')
  editGoods(state, data: IMap) {
    const labels = data.toJS().labelIdStr;
    const goodsList = {
      ...data.toJS(),
      labelIdStr: labels
        ? typeof labels === 'string'
          ? labels.split(',').map(Number)
          : labels
        : []
    };
    return state.update('goods', (goods) => goods.merge(fromJS(goodsList)));
  }

  @Action('goodsActor:randomGoodsNo')
  randomGoodsNo(state) {
    return state.update('goods', (goods) =>
      goods.set(
        'goodsNo',
        'P' +
          new Date().getTime().toString().slice(4, 10) +
          Math.random().toString().slice(2, 5)
      )
    );
  }

  /**
   * 修改商品信息
   * @param state
   * @param saveLoading
   */
  @Action('goodsActor: saveLoading')
  saveLoading(state, saveLoading: boolean) {
    return state.set('saveLoading', saveLoading);
  }

  /**
   * 是否禁用平台类目选择
   * @param state
   * @param disableCate
   */
  @Action('goodsActor: disableCate')
  disableCate(state, disableCate: boolean) {
    return state.set('cateDisabled', disableCate);
  }

  /**
   * 是否是供货商商品
   * @param state
   * @param disableCate
   */
  @Action('goodsActor: isProviderGoods')
  isProviderGoods(state, isProviderGoods: boolean) {
    return state.set('isProviderGoods', isProviderGoods);
  }

  @Action('goodsActor: editor')
  editEditor(state, editor) {
    return state.set('editor', editor);
  }

  @Action('priceActor:setAlonePrice')
  toggleSetAlonePrice(state, result) {
    return state.setIn(['goods', 'allowPriceSet'], result);
  }

  @Action('goodsActor:flashsaleGoods')
  setFlashsaleGoods(state, context) {
    return state.set('flashsaleGoods', context);
  }
}
