import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      settings: {
        homeDeliveryId: 0, //主键
        content: '', // 配送到家文案
        logisticsContent: '', // 物流文案
        expressContent: '', // 快递文案
        pickSelfContent: '' // 自提文案
      },
      imgType: 0, // 0: spu图片  1: sku图片   2: 详情
      // 富文本编辑器
      regEditor: {},
      maxCount: 1,
      searchName: '',
      chooseImgs: [],
      skuId: '', // spu中该字段无
      imgs: [],
      imageName: '',
      visible: false,
      cateIds: [],
      cateId: [],
      imgCates: [],
      // 扁平的分类列表信息
      cateAllList: [],
      total: 0,
      currentPage: 0,
      pageSize: 15,
      previewImage: '',
      regLogisticsContent: '',
      expensesCostContent: '',
      regExpressContent: '',
      regPickSelfContent: ''
    };
  }

  @Action('setting:init')
  init(state: IMap, setting) {
    return state.mergeIn(['settings'], setting);
  }

  @Action('setting:editSetting')
  editSetting(state, data: IMap) {
    return state.update('settings', (settings) => settings.merge(data));
  }
  /**
   * 保存新增的基本信息
   * @param state
   * @param data
   */
  @Action('setting:saveSetting')
  saveSetting(state, data: IMap) {
    return state.set('settings', data);
  }

  @Action('setting: regEditor')
  regEditor(state, regEditor) {
    return state.set('regEditor', regEditor);
  }

  /**
   * 最大图片数量
   * @param state
   * @param maxCount
   */
  @Action('modal: maxCount')
  setMaxCount(state, maxCount) {
    return state.set('maxCount', maxCount);
  }

  /**
   * 弹框关闭/展示
   * @param state
   */
  @Action('modal: visible')
  visible(state, { imgType, skuId }: { imgType: number; skuId: string }) {
    let imgs = state.get('imgs');

    return state
      .set('visible', !state.get('visible'))
      .set('imageName', '')
      .set('searchName', '')
      .set('chooseImgs', fromJS([]))
      .set(
        'imgs',
        imgs.map((img) => {
          img = img.set('checked', false);
          return img;
        })
      )
      .set('imgType', imgType)
      .set('skuId', skuId);
  }

  /**
   * 图片分类选中
   * @param state
   * @param cateIds
   */
  @Action('modal: cateIds')
  editCateIds(state, cateIds) {
    return state.set('cateIds', cateIds);
  }

  /**
   * 图片分类选择
   * @param state
   * @param cateId
   */
  @Action('modal: cateId')
  editCateId(state, cateId) {
    return state.set('cateId', cateId);
  }
  /**
   * 图片分类
   * @param state
   * @param imgCates
   */
  @Action('modal: imgCates')
  cates(state, cateList) {
    // 改变数据形态，变为层级结构
    const newDataList = cateList
      .filter((item) => item.get('cateParentId') == 0)
      .map((data) => {
        const children = cateList
          .filter((item) => item.get('cateParentId') == data.get('cateId'))
          .map((childrenData) => {
            const lastChildren = cateList.filter(
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
    return state.set('imgCates', newDataList).set('cateAllList', cateList);
  }

  /**
   * 选中上传成功的图片
   * @param state
   * @param successImgs
   */
  @Action('modal: chooseImgs')
  chooseImgs(state, successImgs) {
    let imgs = state.get('imgs');
    return state.set('chooseImgs', successImgs).set(
      'imgs',
      imgs.map((img) => {
        img = img.set(
          'checked',
          successImgs.findIndex(
            (i) => i.get('resourceId') === img.get('resourceId')
          ) >= 0
        );
        return img;
      })
    );
  }

  /**
   * 图片集合
   * @param state
   * @param imgs
   */
  @Action('modal: imgs')
  imgs(state, imgs) {
    const chooseImgs = state.get('chooseImgs');
    return state
      .set(
        'imgs',
        imgs.get('content')
          ? imgs.get('content').map((img) => {
              img = img.set(
                'checked',
                chooseImgs.findIndex(
                  (i) => i.get('resourceId') === img.get('resourceId')
                ) >= 0
              );
              return img;
            })
          : []
      )
      .set('total', imgs.get('totalElements'));
  }

  /**
   * 分页
   * @param state
   * @param page
   */
  @Action('modal: page')
  page(state, page) {
    return state.set('currentPage', page.get('currentPage'));
  }

  @Action('setting: regLogisticsContent')
  regLogisticsContent(state, regEditor) {
    return state.set('regLogisticsContent', regEditor);
  }
  @Action('setting: expensesCostContent')
  refexpensesCostContent(state, regEditor) {
    return state.set('expensesCostContent', regEditor);
  }

  @Action('setting: regExpressContent')
  regExpressContent(state, regEditor) {
    return state.set('regExpressContent', regEditor);
  }

  @Action('setting: regPickSelfContent')
  regPickSelfContent(state, regEditor) {
    return state.set('regPickSelfContent', regEditor);
  }
}
