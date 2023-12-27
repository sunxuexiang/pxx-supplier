import { IOptions, Store } from 'plume2';
import { IMap } from 'typings/globalType';
import { fromJS, List, Map, OrderedMap } from 'immutable';
import { Const } from 'qmkit';

import GoodsActor from '../goods-sku-edit/actor/goods-actor';
import SpecActor from '../goods-sku-edit/actor/spec-actor';
import PriceActor from '../goods-sku-edit/actor/price-actor';
import UserActor from '../goods-sku-edit/actor/user-actor';
import FormActor from '../goods-sku-edit/actor/form-actor';
import ModalActor from '../goods-sku-edit/actor/modal-actor';

import {
  getGoodsDetail,
  getUserLevelList,
  getUserList
} from '../goods-sku-edit/webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [
      new GoodsActor(),
      new SpecActor(),
      new PriceActor(),
      new UserActor(),
      new FormActor(),
      new ModalActor()
    ];
  }

  /**
   * 初始化
   */
  init = async (goodsId?: string) => {
    if (goodsId) {
      const userList: any = await getUserList('');
      this.dispatch('userActor: setUserList', fromJS(userList.res.context));

      const userLevelList: any = await getUserLevelList();
      this.dispatch(
        'userActor: setUserLevelList',
        fromJS(userLevelList.res.context)
      );

      this.dispatch(
        'priceActor: setUserLevelList',
        fromJS(userLevelList.res.context)
      );

      this._getGoodsDetail(goodsId);
    }
  };

  /**
   *  编辑时获取商品详情，转换数据
   */
  _getGoodsDetail = async (goodsId?: string) => {
    let goodRes: any = await getGoodsDetail(goodsId);
    let goodsDetail = fromJS({});
    if (goodRes.res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        goodsDetail = fromJS(goodRes.res.context);
        // 商品基本信息
        let goodsInfo = goodsDetail.get('goodsInfo');
        let goods = goodsDetail.get('goods');

        this.dispatch('goodsActor: editGoods', goodsInfo);
        this.dispatch('goodsActor: spu', goods);

        // 规格
        let goodsSpecs = goodsDetail.get('goodsSpecs') || List();
        const goodsSpecDetails = goodsDetail.get('goodsSpecDetails');
        goodsSpecs = goodsSpecs.map((item) => {
          const specValues = goodsSpecDetails.filter(
            (detailItem) => detailItem.get('specId') == item.get('specId')
          );
          return item.set('specValues', specValues);
        });

        // 商品列表
        goodsInfo = goodsInfo.set('id', goodsInfo.get('goodsInfoId'));

        // 图片
        const images = goodsInfo.get('goodsInfoImg')
          ? [
              {
                uid: -1,
                name: 'sku',
                status: 'done',
                size: 10000,
                url: goodsInfo.get('goodsInfoImg')
              }
            ]
          : [];
        goodsInfo = goodsInfo.set('images', fromJS(images));

        const mockSpecDetailIds = goodsInfo.get('mockSpecDetailIds');
        const mockSpecIds = goodsInfo.get('mockSpecIds') || List();
        mockSpecIds.forEach((specId, index) => {
          const detailId = mockSpecDetailIds.get(index);
          const goodsSpecDetail = goodsSpecDetails.find(
            (item) => item.get('specDetailId') == detailId
          );
          goodsInfo = goodsInfo.set(
            'specId-' + specId,
            goodsSpecDetail.get('detailName')
          );
          goodsInfo = goodsInfo.set('specDetailId-' + specId, detailId);
        });
        let goodsList = List();
        goodsList = goodsList.push(goodsInfo);
        this.dispatch('goodsSpecActor: init', {
          goodsSpecs: goodsSpecs,
          goodsList
        });

        this.dispatch(
          'priceActor: editLevelDiscountFlag',
          goodsInfo.get('levelDiscountFlag')
        );

        // 价格
        const goodsLevelPrices = goodsDetail.get('goodsLevelPrices');
        const priceOpt = this.state()
          .get('spu')
          .get('priceType');
        const openUserPrice = goodsInfo.get('customFlag') == 1 ? true : false;
        this.dispatch('priceActor: editPriceSetting', {
          key: 'priceOpt',
          value: priceOpt
        });
        this.dispatch('priceActor: editPriceSetting', {
          key: 'marketPrice',
          value: goodsInfo.get('marketPrice')
        });
        this.dispatch('priceActor: editPriceSetting', {
          key: 'costPrice',
          value: goodsInfo.get('costPrice')
        });
        this.dispatch('priceActor: editPriceSetting', {
          key: 'openUserPrice',
          value: openUserPrice
        });

        if (priceOpt == 0) {
          // 级别价
          let levelPriceMap = Map();
          goodsLevelPrices.forEach((item) => {
            levelPriceMap = levelPriceMap.set(item.get('levelId') + '', item);
          });
          this.dispatch('priceActor: initPrice', {
            key: 'userLevelPrice',
            priceMap: levelPriceMap
          });

          // 密价
          if (openUserPrice) {
            const userList = this.state().get('userList');
            let userPriceMap = OrderedMap();
            goodsDetail.get('goodsCustomerPrices').forEach((item) => {
              const user = userList.find(
                (userItem) =>
                  userItem.get('customerId') == item.get('customerId')
              );
              item = item.set('userLevelName', user.get('customerLevelName'));
              item = item.set('userName', user.get('customerName'));
              userPriceMap = userPriceMap.set(
                item.get('customerId') + '',
                item
              );
            });
            this.dispatch('priceActor: initPrice', {
              key: 'userPrice',
              priceMap: userPriceMap
            });
          }
        } else {
          // 区间价
          let areaPriceMap = Map();
          if(goodsDetail.get('goodsIntervalPrices') != null){
            goodsDetail.get('goodsIntervalPrices').forEach((item) => {
              areaPriceMap = areaPriceMap.set(
                item.get('intervalPriceId') + '',
                item
              );
            });
          }
          this.dispatch('priceActor: initPrice', {
            key: 'areaPrice',
            priceMap: areaPriceMap
          });
        }
      });
    }
  };

  /**
   * 修改商品基本信息
   */
  editGoods = (goods: IMap) => {
    this.dispatch('goodsActor: editGoods', goods);
  };

  /**
   * 修改商品属性
   */
  editGoodsItem = (id: string, key: string, value: any) => {
    this.dispatch('goodsSpecActor: editGoodsItem', { id, key, value });
  };

  /**
   * 更改设价方式
   * @param state
   * @param priceOpt
   */
  editPriceSetting = (key: string, value: any) => {
    this.dispatch('priceActor: editPriceSetting', { key, value });
  };

  /**
   * 修改级别价单个属性
   * @param state
   * @param param1
   */
  editUserLevelPriceItem = (
    userLevelId: string,
    key: string,
    value: string
  ) => {
    this.dispatch('priceActor: editUserLevelPriceItem', {
      userLevelId,
      key,
      value
    });
  };

  /**
   * 修改用户价
   */
  editUserPrice = (userId: string, userName: string, userLevelName: string) => {
    this.dispatch('priceActor: editUserPrice', {
      userId,
      userName,
      userLevelName
    });
  };

  /**
   * 修改客户价单个属性
   */
  editUserPriceItem = (userId: string, key: string, value: string) => {
    this.dispatch('priceActor: editUserPriceItem', { userId, key, value });
  };

  /**
   * 修改客户价单个属性
   */
  editAreaPriceItem = (id: string, key: string, value: string) => {
    this.dispatch('priceActor: editAreaPriceItem', { id, key, value });
  };

  updateSkuForm = (skuForm) => {
    this.dispatch('formActor:sku', skuForm);
  };

  updateLevelPriceForm = (levelPriceForm) => {
    this.dispatch('formActor:levelprice', levelPriceForm);
  };

  updateUserPriceForm = (userPriceForm) => {
    this.dispatch('formActor:userprice', userPriceForm);
  };

  updateAreaPriceForm = (areaPriceForm) => {
    this.dispatch('formActor:areaprice', areaPriceForm);
  };

  updateAddedFlagForm = (addedFlagForm) => {
    this.dispatch('formActor:addedFlag', addedFlagForm);
  };

  /**
   * 客户搜索
   */
  searchUserList = async (customerName?: string) => {
    const userList: any = await getUserList(customerName);
    this.dispatch(
      'userActor: setUserList',
      fromJS(userList.res.context.detailResponseList)
    );
  };

  /**
   * 更新等级起订量选中状态
   */
  updateLevelCountChecked = async (levelCountChecked?: boolean) => {
    this.dispatch('priceActor: editLevelCountChecked', levelCountChecked);
  };

  /**
   * 同步等级起订量
   */
  synchLevelCount = async () => {
    this.dispatch('priceActor: synchLevelCount');
  };

  /**
   * 更新等级限订量选中状态
   */
  updateLevelMaxCountChecked = async (levelMaxCountChecked?: boolean) => {
    this.dispatch('priceActor: editLevelMaxCountChecked', levelMaxCountChecked);
  };

  /**
   * 更新客户起订量选中状态
   */
  updateUserCountChecked = async (userCountChecked?: boolean) => {
    this.dispatch('priceActor: editUserCountChecked', userCountChecked);
  };

  /**
   * 更新客户限订量选中状态
   */
  updateUserMaxCountChecked = async (userCountChecked?: boolean) => {
    this.dispatch('priceActor: editUserMaxCountChecked', userCountChecked);
  };

  /**
   * 切换 基础信息 与 价格及订货量 tab
   * @param activeKey
   */
  onMainTabChange = (activeKey) => {
    this.dispatch('goodsActor: tabChange', activeKey);
  };
}
