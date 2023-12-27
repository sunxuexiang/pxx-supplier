import { IOptions, Store } from 'plume2';
import { IList } from 'typings/globalType';
import { fromJS, List, Map, OrderedMap } from 'immutable';
import { message } from 'antd';
import {Const, util} from 'qmkit';

import GoodsActor from '../goods-add/actor/goods-actor';
import ImageActor from '../goods-add/actor/image-actor';
import SpecActor from '../goods-add/actor/spec-actor';
import PriceActor from '../goods-add/actor/price-actor';
import UserActor from '../goods-add/actor/user-actor';
import FormActor from '../goods-add/actor/form-actor';
import BrandActor from '../goods-add/actor/brand-actor';
import CateActor from '../goods-add/actor/cate-actor';
import ModalActor from '../goods-add/actor/modal-actor';

import {
  getBossUserLevelList,
  getBossUserList,
  getBrandList,
  getCateList,
  getGoodsDetail,
  getStoreCateList,
  getUserLevelList,
  getUserList
} from '../goods-add/webapi';

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
      new ImageActor(),
      new SpecActor(),
      new PriceActor(),
      new UserActor(),
      new FormActor(),
      new BrandActor(),
      new CateActor(),
      new ModalActor()
    ];
  }

  /**
   * 初始化
   */
  init = async (goodsId?: string) => {
    // 保证品牌分类等信息先加载完
    await Promise.all([getCateList(), getStoreCateList(), getBrandList()]).then(
      (results) => {
        this.dispatch(
          'goodsActor: initCateList',
          fromJS((results[0].res as any).context)
        );
        this.dispatch(
          'goodsActor: initStoreCateList',
          fromJS((results[1].res as any).context)
        );
        this.dispatch(
          'goodsActor: initBrandList',
          fromJS((results[2].res as any).context)
        );
      }
    );

    let userList : any;
    if(util.isThirdStore()){
      userList = await getUserList('');
    }else{
      userList = await getBossUserList();
    }
    this.dispatch('userActor: setUserList', fromJS(userList.res.context));

    let newLevelList = [];
    if(util.isThirdStore()){
      const userLevelList : any = await getUserLevelList();
      userLevelList.res.context.storeLevelVOList.map(v => {
        newLevelList.push({customerLevelId: v.storeLevelId,
          customerLevelName: v.levelName,
          customerLevelDiscount: v.discountRate
        });
      });
    }else{
      const userLevelList : any = await getBossUserLevelList();
      newLevelList = userLevelList.res.context.customerLevelVOList;
    }

    const userLevel = {
      customerLevelId: 0,
      customerLevelName: '全平台客户',
      customerLevelDiscount: 1
    };
    newLevelList.unshift(userLevel);
    this.dispatch('userActor: setUserLevelList', fromJS(newLevelList));
    this.dispatch('priceActor: setUserLevelList', fromJS(newLevelList));

    if (goodsId) {
      this.dispatch('goodsActor: isEditGoods', true);
      this._getGoodsDetail(goodsId);
    } else {
      this.dispatch('goodsActor:randomGoodsNo');
    }
  };

  /**
   *  编辑时获取商品详情，转换数据
   */
  _getGoodsDetail = async (goodsId?: string) => {
    let goodsDetail: any = await getGoodsDetail(goodsId);

    if (goodsDetail.res.code == Const.SUCCESS_CODE) {
      goodsDetail = fromJS(goodsDetail.res.context);
    } else {
      message.error('查询商品信息失败');
      return false;
    }

    this.transaction(() => {
      // 商品基本信息
      let goods = goodsDetail.get('goods');

      // 商品可能没有品牌，后面取值有toString等操作，空字符串方便处理
      if (!goods.get('brandId')) {
        goods = goods.set('brandId', '');
      }

      this.dispatch('goodsActor: editGoods', goods);
      this.dispatch(
        'goodsSpecActor: editSpecSingleFlag',
        goodsDetail.getIn(['goods', 'moreSpecFlag']) == 0
      );

      // 商品图片
      let images = goodsDetail.get('images').map((image, index) => {
        return Map({
          uid: index,
          name: index,
          size: 1,
          status: 'done',
          artworkUrl: image.get('artworkUrl')
        });
      });
      this.editImages(images);

      const tabs = [];
      if (goodsDetail.get('storeGoodsTabs')) {
        goodsDetail.get('storeGoodsTabs').forEach((info) => {
          tabs.push({
            tabName: info.get('tabName'),
            tabDetail:
              goodsDetail
                .get('goodsTabRelas')
                .find(
                  (tabInfo) => tabInfo.get('tabId') === info.get('tabId')
                ) &&
              goodsDetail
                .get('goodsTabRelas')
                .find((tabInfo) => tabInfo.get('tabId') === info.get('tabId'))
                .get('tabDetail')
          });
        });
      }
      this.dispatch('goodsActor: goodsTabs', tabs);

      // 是否为多规格
      if (goodsDetail.getIn(['goods', 'moreSpecFlag']) == 1) {
        // 规格，按照id升序排列
        let goodsSpecs = goodsDetail.get('goodsSpecs').sort((o1, o2) => {
          return o1.get('specId') - o2.get('specId');
        });

        const goodsSpecDetails = goodsDetail.get('goodsSpecDetails');
        goodsSpecs = goodsSpecs.map((item) => {
          // 规格值列表，按照id升序排列
          const specValues = goodsSpecDetails
            .filter(
              (detailItem) => detailItem.get('specId') == item.get('specId')
            )
            .map((detailItem) => detailItem.set('isMock', false))
            .sort((o1, o2) => {
              return o1.get('specDetailId') - o2.get('specDetailId');
            });
          return item.set('specValues', specValues);
        });

        // 商品列表
        let goodsList = List();
        goodsList = goodsDetail.get('goodsInfos').map((item, index) => {
          // 获取规格值并排序
          const mockSpecDetailIds = item.get('mockSpecDetailIds').sort();
          item.get('mockSpecIds').forEach((specId) => {
            // 规格值保存的顺序可能不是按照规格id的顺序，多个sku的规格值列表顺序是乱序，因此此处不能按照顺序获取规格值。只能从规格规格值对应关系里面去捞一遍。
            const detail = goodsSpecDetails.find(
              (detail) =>
                detail.get('specId') == specId &&
                item
                  .get('mockSpecDetailIds')
                  .contains(detail.get('specDetailId'))
            );
            const detailId = detail.get('specDetailId');

            const goodsSpecDetail = goodsSpecDetails.find(
              (d) => d.get('specDetailId') == detailId
            );
            item = item.set(
              'specId-' + specId,
              goodsSpecDetail.get('detailName')
            );
            item = item.set('specDetailId-' + specId, detailId);
            if (item.get('goodsInfoImg')) {
              item = item.set(
                'images',
                List([
                  Map({
                    uid: item.get('goodsInfoId'),
                    name: item.get('goodsInfoId'),
                    size: 1,
                    status: 'done',
                    artworkUrl: item.get('goodsInfoImg')
                  })
                ])
              );
            }
          });
          item = item.set('id', item.get('goodsInfoId'));
          item = item.set('skuSvIds', mockSpecDetailIds.join());
          item = item.set('index', index + 1);
          return item;
        });
        this.dispatch('goodsSpecActor: init', { goodsSpecs, goodsList });
      } else {
        // 商品列表
        let goodsList = List();
        goodsList = goodsDetail.get('goodsInfos').map((item) => {
          item = item.set('id', item.get('goodsInfoId'));
          if (item.get('goodsInfoImg')) {
            item = item.set(
              'images',
              List([
                Map({
                  uid: item.get('goodsInfoId'),
                  name: item.get('goodsInfoId'),
                  size: 1,
                  status: 'done',
                  url: item.get('goodsInfoImg')
                })
              ])
            );
          }
          return item;
        });
        this.dispatch('goodsSpecActor: init', {
          goodsSpecs: List(),
          goodsList
        });
      }

      // 解析价格数据
      this._getPriceInfo(goodsDetail);
    });
  };

  /**
   * 解析设价信息
   * @param {any} goodsDetail
   * @returns {Promise<void>}
   * @private
   */
  _getPriceInfo = async (goodsDetail) => {
    // 价格
    const priceOpt = goodsDetail.getIn(['goods', 'priceType']);
    const openUserPrice = goodsDetail.getIn(['goods', 'customFlag']) == 1;
    const levelDiscountFlag =
      goodsDetail.getIn(['goods', 'levelDiscountFlag']) == 1;
    this.dispatch('priceActor: editPriceSetting', {
      key: 'priceOpt',
      value: priceOpt
    });
    this.dispatch('priceActor: editPriceSetting', {
      key: 'mtkPrice',
      value: goodsDetail.getIn(['goods', 'marketPrice'])
    });
    this.dispatch('priceActor: editPriceSetting', {
      key: 'costPrice',
      value: goodsDetail.getIn(['goods', 'costPrice'])
    });
    this.dispatch('priceActor: editPriceSetting', {
      key: 'openUserPrice',
      value: openUserPrice
    });
    this.dispatch('priceActor: editPriceSetting', {
      key: 'levelDiscountFlag',
      value: levelDiscountFlag
    });

    // 级别价
    let levelPriceMap = Map();
    if (goodsDetail.get('goodsLevelPrices') != null) {
      goodsDetail.get('goodsLevelPrices').forEach((item) => {
        levelPriceMap = levelPriceMap.set(item.get('levelId') + '', item);
      });
    }
    this.dispatch('priceActor: initPrice', {
      key: 'userLevelPrice',
      priceMap: levelPriceMap
    });

    if (priceOpt == 0) {
      // 密价
      if (openUserPrice) {
        const userList = this.state().get('userList');
        let userPriceMap = OrderedMap();
        goodsDetail.get('goodsCustomerPrices').forEach((item) => {
          const user = userList.find(
            (userItem) => userItem.get('customerId') == item.get('customerId')
          );
          if (user != null) {
            item = item.set('userLevelName', user.get('customerLevelName'));
            item = item.set('userName', user.get('customerName'));
            userPriceMap = userPriceMap.set(item.get('customerId') + '', item);
          }
        });
        this.dispatch('priceActor: initPrice', {
          key: 'userPrice',
          priceMap: userPriceMap
        });
      }
    } else if (priceOpt == 1) {
      // 区间价
      let areaPriceMap = Map();
      goodsDetail.get('goodsIntervalPrices').forEach((item) => {
        areaPriceMap = areaPriceMap.set(item.get('intervalPriceId') + '', item);
      });
      this.dispatch('priceActor: initPrice', {
        key: 'areaPrice',
        priceMap: areaPriceMap
      });
    }
  };

  /**
   * 修改商品图片
   */
  editImages = (images: IList) => {
    this.dispatch('imageActor: editImages', images);
  };

  /**
   * 放大还原图片
   */
  clickImg = (imgUrl: string) => {
    this.dispatch('modal: imgVisible', imgUrl);
  };

  /**
   * 移除图片
   * @param id
   */
  removeImg = ({ type, id }) => {
    if (type === 0) {
      this.dispatch('imageActor: remove', id);
    } else {
      this.dispatch('goodsSpecActor: removeImg', id);
    }
  };

  /**
   * 切换 基础信息 与 价格及订货量 tab
   * @param activeKey
   */
  onMainTabChange = (activeKey) => {
    this.dispatch('goodsActor: tabChange', activeKey);
  };
}
