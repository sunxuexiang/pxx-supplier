import { IOptions, Store } from 'plume2';
import { IList, IMap } from 'typings/globalType';
import { fromJS, List, Map, OrderedMap } from 'immutable';
import { message } from 'antd';
import { Const, history, util } from 'qmkit';

import GoodsActor from './actor/goods-actor';
import ImageActor from './actor/image-actor';
import SpecActor from './actor/spec-actor';
import PriceActor from './actor/price-actor';
import UserActor from './actor/user-actor';
import FormActor from './actor/form-actor';
import BrandActor from './actor/brand-actor';
import CateActor from './actor/cate-actor';
import ModalActor from './actor/modal-actor';
import PropActor from './actor/prop-actor';
import FreightActor from './actor/freight-actor';

import {
  addAll,
  addBrand,
  addCate,
  checkSalesType,
  edit,
  editAll,
  fetchImages,
  fetchResource,
  freightList,
  getBossUserLevelList,
  getBossUserList,
  getBossUserListByName,
  getBrandList,
  getCateIdsPropDetail,
  getCateList,
  getLabelList,
  getGoodsDetail,
  syncGoodsWareStock,
  getImgCates,
  getResourceCates,
  getStoreCateList,
  getStoreGoodsTab,
  getUserLevelList,
  getUserList,
  goodsFreight,
  goodsFreightExpress,
  isFlashsele,
  save,
  toGeneralgoods,
  fetchBossCustomerList,
  fetchCustomerList,
  checkEnterpriseType,
  enterpriseToGeneralgoods,
  syncErpGoodsWareStock
} from './webapi';
import config from '../qmkit/config';

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
      new ModalActor(),
      new PropActor(),
      new FreightActor()
    ];
  }

  /**
   * 初始化
   */
  init = async (goodsId?: string) => {
    // 保证品牌分类等信息先加载完
    await Promise.all([
      getCateList(),
      getStoreCateList(),
      getBrandList(),
      getBrandList(),
      // checkSalesType(goodsId),
      isFlashsele(goodsId),
      getLabelList({})
    ]).then((results) => {
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
      // this.dispatch('formActor:check', fromJS((results[3].res as any).context));
      this.dispatch(
        'goodsActor:flashsaleGoods',
        fromJS((results[4].res as any).context).get('flashSaleGoodsVOList')
      );
      const goodsLabelVOList = results[5].res.context?.goodsLabelVOList;
      this.dispatch('goodsActor:labelList', fromJS(goodsLabelVOList));
    });
    // 如果是编辑则判断是否有企业购商品
    // if (goodsId) {
    //   const { res: checkResponse } = await checkEnterpriseType(goodsId);
    //   if (checkResponse.code === config.SUCCESS_CODE) {
    //     this.dispatch(
    //       'formActor:enterpriseFlag',
    //       fromJS(checkResponse.context).get('checkFlag')
    //     );
    //   }
    // } else {
      this.dispatch('formActor:enterpriseFlag', false);
    // }

    let userList: any;
    if (util.isThirdStore()) {
      userList = await getUserList('');
    } else {
      userList = await getBossUserList();
    }

    const sourceUserList = fromJS(userList.res.context);
    this.dispatch('userActor: setUserList', sourceUserList);
    this.dispatch('userActor: setSourceUserList', sourceUserList);

    let newLevelList = [];
    if (util.isThirdStore()) {
      const userLevelList: any = await getUserLevelList();
      userLevelList.res.context.storeLevelVOList.map((v) => {
        newLevelList.push({
          customerLevelId: v.storeLevelId,
          customerLevelName: v.levelName,
          customerLevelDiscount: v.discountRate
        });
      });
    } else {
      const userLevelList: any = await getBossUserLevelList();
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
      this._getGoodsDetail(goodsId, false);
    } else {
      // 新增商品，可以选择平台类目
      this.dispatch('goodsActor: disableCate', false);
      this.dispatch('goodsActor:randomGoodsNo');
      const storeGoodsTab = await getStoreGoodsTab();
      if ((storeGoodsTab.res as any).code === Const.SUCCESS_CODE) {
        const tabs = [];
        (storeGoodsTab.res as any).context.forEach((info) => {
          if (info.isDefault !== 1) {
            tabs.push({
              tabId: info.tabId,
              tabName: info.tabName,
              tabDetail: ''
            });
          }
        });
        this.dispatch('goodsActor: goodsTabs', tabs);
      }
    }
  };

  /**
   * 重新获取最新库存信息
   * @param goodsId
   */
  doInitGoodList = async (goodsId?: string) => {
    await this._getGoodsDetail(goodsId, true);
  };

  /**
   * 初始化
   */
  initVideo = async (
    { pageNum, cateId, successCount } = {
      pageNum: 0,
      cateId: null,
      successCount: 0
    }
  ) => {
    const cateList: any = await getResourceCates();
    const cateListIm = this.state().get('resCateAllList');
    if (cateId == -1 && cateList.res.length > 0) {
      cateId = fromJS(cateList.res)
        .find((item) => item.get('isDefault') == 1)
        .get('cateId');
    }
    cateId = cateId ? cateId : this.state().get('videoCateId').toJS();

    //查询视频分页信息
    const videoList: any = await fetchResource({
      pageNum,
      pageSize: 10,
      resourceName: this.state().get('videoSearchName'),
      cateIds: this._getCateIdsList(cateListIm, cateId),
      resourceType: 1
    });

    if (videoList.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        if (cateId) {
          this.selectVideoCate(cateId);
        }
        this.dispatch('cateActor: init', fromJS(cateList.res));
        if (successCount > 0) {
          //表示上传成功之后需要选中这些图片
          this.dispatch(
            'modal: chooseVideos',
            fromJS(videoList.res.context).get('content').slice(0, successCount)
          );
        }
        this.dispatch('modal: videos', fromJS(videoList.res.context)); //初始化视频分页列表
        this.dispatch(
          'modal: page',
          fromJS({ currentPage: pageNum + 1, resourceType: 1 })
        );
      });
    } else {
      message.error(videoList.res.message);
    }
  };

  /**
   * 初始化
   */
  initImg = async (
    { pageNum, cateId, successCount } = {
      pageNum: 0,
      cateId: null,
      successCount: 0
    }
  ) => {
    const cateList: any = await getImgCates();
    const cateListIm = this.state().get('resCateAllList');
    if (cateId == -1 && cateList.res.length > 0) {
      const cateIdList = fromJS(cateList.res).filter(
        (item) => item.get('isDefault') == 1
      );
      if (cateIdList.size > 0) {
        cateId = cateIdList.get(0).get('cateId');
      }
    }
    cateId = cateId ? cateId : this.state().get('cateId');
    const imageList: any = await fetchImages({
      pageNum,
      pageSize: 10,
      resourceName: this.state().get('searchName'),
      cateIds: this._getCateIdsList(cateListIm, cateId),
      resourceType: 0
    });
    if (imageList.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        if (cateId) {
          this.dispatch('modal: cateIds', List.of(cateId.toString()));
          this.dispatch('modal: cateId', cateId.toString());
        }
        this.dispatch('modal: imgCates', fromJS(cateList.res));
        if (successCount > 0) {
          //表示上传成功之后需要选中这些图片
          this.dispatch(
            'modal: chooseImgs',
            fromJS(imageList.res.context).get('content').slice(0, successCount)
          );
        }
        this.dispatch('modal: imgs', fromJS(imageList.res.context));
        this.dispatch(
          'modal: page',
          fromJS({ currentPage: pageNum + 1, resourceType: 0 })
        );
      });
    } else {
      message.error(imageList.res.message);
    }
  };

  syncErpStock = async (erpGoodsInfoNo, goodsInfoId) => {
    let skuWareStocks;
    //查询wms接口返回库存信息
    await syncErpGoodsWareStock({
      erpGoodsInfoNo: erpGoodsInfoNo,
      goodsInfoId: goodsInfoId
    }).then(({ res, err }) => {
      if (res.code === 'K-4000001') {
        message.error('WMS未查询到该商品的库存！');
        return;
      }
      if (res.code !== Const.SUCCESS_CODE) {
        message.error('同步最新库存信息失败！');
        return;
      }
      if (res.code == Const.SUCCESS_CODE) {
        message.info('同步成功！');
        const goodsWareStockVOS = res.context.goodsWareStockVOS;
        let goodsList = this.state().get('goodsList');
        let goodsSpecs = this.state().get('goodsSpecs');
        if (goodsList) {
          let goodsInfoList = goodsList.map((g) => {
            if (g.get('goodsInfoId') == goodsInfoId) {
              g = g.set('goodsWareStocks', goodsWareStockVOS);
            }
            return g;
          });
          goodsInfoList = fromJS(goodsInfoList);
          this.dispatch('goodsSpecActor: init', {
            goodsSpecs,
            goodsList: goodsInfoList
          });
        }
        return;
      }
    });
  };

  /**
   *  编辑时获取商品详情，转换数据
   */
  _getGoodsDetail = async (goodsId?: string, syncStock?: boolean) => {
    let goodsDetail: any = await getGoodsDetail(goodsId);
    if (goodsDetail.res.code == Const.SUCCESS_CODE) {
      goodsDetail = fromJS(goodsDetail.res.context);
    } else {
      message.error('查询商品信息失败');
      return false;
    }

    this.transaction(() => {
      // 可能只保存了基本信息没有设价方式，价格tab中由需要默认选中按客户设价
      // 这里给一个默认值2，保存基本信息的时候不能传这个值，要过滤掉 priceType-mark
      if (goodsDetail.getIn(['goods', 'priceType']) == null) {
        goodsDetail = goodsDetail.setIn(['goods', 'priceType'], 2);
      }

      // 商品基本信息
      let goods = goodsDetail.get('goods');

      // 如果不是已审核状态，都可以编辑平台类目
      this.dispatch('goodsActor: disableCate', goods.get('auditStatus') == 1);

      // 判断是否是供货商商品
      this.dispatch(
        'goodsActor: isProviderGoods',
        goods.get('providerGoodsId') != null
      );

      // 商品可能没有品牌，后面取值有toString等操作，空字符串方便处理
      if (!goods.get('brandId')) {
        goods = goods.set('brandId', '');
      }
      if (goods.get('freightTempId')) {
        this.setGoodsFreight(goods.get('freightTempId'), true);
      }
      goods=goods.set('addStep',goodsDetail.get('goodsInfos')?.toJS()[0]?.addStep||0)
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

      let videoObj = Map({
        uid: 0,
        size: 1,
        status: 'done',
        artworkUrl: goods.get('goodsVideo')
      });
      this.dispatch('imageActor: editVideo', videoObj);

      const tabs = [];
      if (goodsDetail.get('storeGoodsTabs')) {
        goodsDetail.get('storeGoodsTabs').forEach((info) => {
          tabs.push({
            tabId: info.get('tabId'),
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
      // 属性信息
      this.showGoodsPropDetail(
        goodsDetail.getIn(['goods', 'cateId']),
        goodsDetail.get('goodsPropDetailRels')
      );
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
        let goodsList = goodsDetail.get('goodsInfos').map((item, index) => {
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
            if (item.get('goodsInfoQrcode')) {
              item = item.set(
                'qrcodeImages',
                List([
                  Map({
                    uid: item.get('goodsInfoId'),
                    name: item.get('goodsInfoId'),
                    size: 1,
                    status: 'done',
                    artworkUrl: item.get('goodsInfoQrcode')
                  })
                ])
              );
            }
          });
          item = item.set('id', item.get('goodsInfoId'));
          item = item.set('goodsWareStocks', item.get('goodsWareStocks'));
          item = item.set('skuSvIds', mockSpecDetailIds.join());
          item = item.set('index', index + 1);
          // if (skuWareStocks) {
          //   skuWareStocks.map((i) => {
          //     if (i.get('goodsInfoId') == item.get('goodsInfoId')) {
          //       item = item.set('goodsWareStocks', i.get('goodsWareStocks'));
          //     }
          //   });
          // }
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
                  artworkUrl: item.get('goodsInfoImg')
                })
              ])
            );
          }

          if (item.get('goodsInfoQrcode')) {
            item = item.set(
              'qrcodeImages',
              List([
                Map({
                  uid: item.get('goodsInfoId'),
                  name: item.get('goodsInfoId'),
                  size: 1,
                  status: 'done',
                  artworkUrl: item.get('goodsInfoQrcode')
                })
              ])
            );
          }
          item = item.set('goodsWareStocks', item.get('goodsWareStocks'));
          // if (skuWareStocks) {
          //   skuWareStocks.map((i) => {
          //     if (i.get('goodsInfoId') == item.get('goodsInfoId')) {
          //       item = item.set('goodsWareStocks', i.get('goodsWareStocks'));
          //     }
          //   });
          // }
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
    const priceOpt =
      goodsDetail.getIn(['goods', 'saleType']) === 1 &&
      goodsDetail.getIn(['goods', 'priceType']) === 1
        ? 2
        : goodsDetail.getIn(['goods', 'priceType']);
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
        let customerList: any;
        const customerIds = goodsDetail
          .get('goodsCustomerPrices')
          .map((item) => {
            return item.get('customerId');
          });
        if (util.isThirdStore()) {
          const list: any = await fetchCustomerList(customerIds);
          customerList = fromJS(list.res.context.detailResponseList);
        } else {
          const list: any = await fetchBossCustomerList(customerIds);
          customerList = fromJS(list.res.context.detailResponseList);
        }

        let userPriceMap = OrderedMap();
        goodsDetail.get('goodsCustomerPrices').forEach((item) => {
          const user = customerList.find(
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
   * 修改商品基本信息
   */
  editGoods = (goods: IMap) => {
    if (
      goods.get('saleType') !== undefined &&
      goods.get('saleType') === 1 &&
      this.state().getIn(['goods', 'priceType']) === 1
    ) {
      this.editPriceSetting('priceOpt', 2);
    }
    this.dispatch('goodsActor: editGoods', goods);
  };

  /**
   * 修改商品图片
   */
  editImages = (images: IList) => {
    images.map((item, index) => {
      item.imageId = index;
    });
    this.dispatch('imageActor: editImages', images);
  };

  /**
   * 设置是否为单规格
   */
  editSpecSingleFlag = (specSingleFlag: boolean) => {
    this.dispatch('goodsSpecActor: editSpecSingleFlag', specSingleFlag);
  };

  /**
   * 修改规格名称
   */
  editSpecName = (specItem: { specId: number; specName: string }) => {
    this.dispatch('goodsSpecActor: editSpecName', specItem);
  };

  /**
   * 修改规格值
   */
  editSpecValues = (specItem) => {
    const priceOpt = this.state().get('priceOpt');
    const mtkPrice = this.state().get('mtkPrice');
    this.dispatch('goodsSpecActor: editSpecValues', {
      priceOpt,
      mtkPrice,
      ...specItem
    });
  };

  /**
   * 添加规格
   */
  addSpec = () => {
    this.dispatch('goodsSpecActor: addSpec');
  };

  /**
   * 添加规格
   */
  deleteSpec = (specId: number) => {
    this.dispatch('goodsSpecActor: deleteSpec', specId);
  };

  /**
   * 修改商品属性
   */
  editGoodsItem = (id: string, key: string, value: string) => {
    this.dispatch('goodsSpecActor: editGoodsItem', { id, key, value });
  };
  /**
   * 修改商品库存
   * @param disabled
   */
  editGoodsStock = (
    id: string,
    storeWareId: number,
    key: string,
    value: string
  ) => {
    this.dispatch('goodsSpecActor: editGoodsStock', {
      id,
      key,
      value,
      storeWareId
    });
  };

  changePriceDisabled = (disabled: boolean) => {
    this.dispatch('priceActor: priceDisabled', disabled);
  };

  deleteGoodsInfo = (id: string) => {
    this.dispatch('goodsSpecActor: deleteGoodsInfo', id);
  };

  /**
   * 移除视频
   * @param id
   */
  removeVideo = () => {
    this.dispatch('imageActor: deleteVideo');
    let goods = this.state().get('goods');
    goods = goods.set('goodsVideo', '');
    this.dispatch('goodsActor: editGoods', goods);
  };

  /**
   * 清除选中的视频
   */
  cleanChooseVideo = () => {
    this.dispatch('modal: cleanChooseVideo');
  };

  /**
   * 选中某个分类
   * @param cateId
   */
  selectVideoCate = (cateId) => {
    if (cateId) {
      this.dispatch('cateActor: cateIds', List.of(cateId.toString())); //选中的分类id List
      this.dispatch('cateActor: cateId', cateId.toString()); //选中的分类id
    } else {
      this.dispatch('cateActor: cateIds', List()); //全部
      this.dispatch('cateActor: cateId', ''); //全部
    }
  };

  /**
   * 单选
   * @param index
   * @param checked
   */
  onCheckedVideo = ({ video, checked }) => {
    this.dispatch('modal: checkVideo', { video, checked });
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
   * 删除级别价
   */
  deleteUserPrice = (userId: string) => {
    this.dispatch('priceActor: deleteUserPrice', userId);
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

  /**
   * 删除区间价
   */
  deleteAreaPrice = (id: string) => {
    this.dispatch('priceActor: deleteAreaPrice', id);
  };

  /**
   * 新增区间价
   */
  addAreaPrice = () => {
    this.dispatch('priceActor: addAreaPrice');
  };

  updateGoodsForm = (goodsForm) => {
    this.dispatch('formActor:goods', goodsForm);
  };
  updateLogisticsForm = (logisticsForm) => {
    this.dispatch('formActor:logistics', logisticsForm);
  };
  updateSkuForm = (skuForm) => {
    this.dispatch('formActor:sku', skuForm);
  };

  updateSpecForm = (specForm) => {
    this.dispatch('formActor:spec', specForm);
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

  refDetailEditor = (detailEditor) => {
    this.dispatch('goodsActor: detailEditor', detailEditor);
  };

  reftabDetailEditor = (obj) => {
    this.dispatch('goodsActor: tabDetailEditor', obj);
  };

  /**
   * 对基本信息表单进行校验
   * @returns {boolean}
   * @private
   */
  _validMainForms() {
    let valid = true;
    // 校验表单
    this.state()
      .get('goodsForm')
      .validateFieldsAndScroll(null, (errs) => {
        valid = valid && !errs;
        if (!errs) {
        }
      });
    this.state()
      .get('skuForm')
      .validateFieldsAndScroll(null, (errs) => {
        valid = valid && !errs;
        if (!errs) {
        }
      });
    if (
      this.state().get('specForm') &&
      this.state().get('specForm').validateFieldsAndScroll
    ) {
      this.state()
        .get('specForm')
        .validateFieldsAndScroll(null, (errs) => {
          valid = valid && !errs;
          if (!errs) {
          }
        });
    }
    if (
      this.state().get('logisticsForm') &&
      this.state().get('logisticsForm').validateFieldsAndScroll
    ) {
      this.state()
        .get('logisticsForm')
        .validateFieldsAndScroll(null, (errs) => {
          valid = valid && !errs;
          if (!errs) {
          }
        });
    }

    return valid;
  }

  /**
   * 确定选择以上视频
   */
  beSureVideos = () => {
    const chooseVideo = this.state().get('chooseVideos');
    this.dispatch(
      'imageActor: editVideo',
      List.isList(chooseVideo) ? chooseVideo.get(0) : chooseVideo
    );
  };

  /**
   * 对价格表单进行校验
   * @returns {boolean}
   * @private
   */
  _validPriceForms() {
    let valid = true;
    // 校验表单
    if (
      this.state().get('levelPriceForm') &&
      this.state().get('levelPriceForm').validateFieldsAndScroll
    ) {
      this.state()
        .get('levelPriceForm')
        .validateFieldsAndScroll(null, (errs) => {
          valid = valid && !errs;
          if (!errs) {
          }
        });
    }
    if (
      this.state().get('userPriceForm') &&
      this.state().get('userPriceForm').validateFieldsAndScroll
    ) {
      this.state()
        .get('userPriceForm')
        .validateFieldsAndScroll(null, (errs) => {
          valid = valid && !errs;
          if (!errs) {
          }
        });
    }
    if (
      this.state().get('areaPriceForm') &&
      this.state().get('areaPriceForm').validateFieldsAndScroll
    ) {
      this.state()
        .get('areaPriceForm')
        .validateFieldsAndScroll(null, (errs) => {
          valid = valid && !errs;
          if (!errs) {
          }
        });
    }

    return valid;
  }

  validMain = () => {
    return this._validMainForms();
  };

  /**
   * 保存商品基本信息
   */
  saveMain = async () => {
    if (!this._validMainForms()) {
      return false;
    }
    const data = this.state();
    let param = Map();

    // -----商品信息-------
    let goods = data.get('goods');

    if (goods.get('cateId') === '-1') {
      message.error('请选择平台类目');
      return false;
    }

    if (!goods.get('storeCateIds')) {
      message.error('请选择店铺分类');
      return false;
    }

    if (goods.get('brandId') === '0') {
      message.error('请选择品牌');
      return false;
    }

    // 是否多规格标记
    goods = goods.set('moreSpecFlag', data.get('specSingleFlag') ? 0 : 1);
    // 详情
    const detailEditor = data.get('detailEditor') || {};
    goods = goods.set(
      'goodsDetail',
      detailEditor.getContent ? detailEditor.getContent() : ''
    );
    const tabs = [];
    if (
      data.get('detailEditor_0') &&
      data.get('detailEditor_0').val &&
      data.get('detailEditor_0').val.getContent
    ) {
      tabs.push({
        goodsId: goods.get('goodsId'),
        tabId: data.get('detailEditor_0').tabId,
        tabDetail: data.get('detailEditor_0').val.getContent()
      });
    }
    if (
      data.get('detailEditor_1') &&
      data.get('detailEditor_1').val &&
      data.get('detailEditor_1').val.getContent
    ) {
      tabs.push({
        goodsId: goods.get('goodsId'),
        tabId: data.get('detailEditor_1').tabId,
        tabDetail: data.get('detailEditor_1').val.getContent()
      });
    }
    if (
      data.get('detailEditor_2') &&
      data.get('detailEditor_2').val &&
      data.get('detailEditor_2').val.getContent
    ) {
      tabs.push({
        goodsId: goods.get('goodsId'),
        tabId: data.get('detailEditor_2').tabId,
        tabDetail: data.get('detailEditor_2').val.getContent()
      });
    }
    if (data.get('video') && JSON.stringify(data.get('video')) !== '{}') {
      goods = goods.set('goodsVideo', data.get('video').get('artworkUrl'));
    }

    param = param.set('goodsTabRelas', tabs);

    goods = goods.set('goodsType', 0);
    // goods = goods.set('goodsSource', 1);

    param = param.set('goods', goods);
    // 基本信息保存参数中要把priceType去掉 priceType-mark
    // param = param.removeIn(['goods', 'priceType']);

    // -----商品相关图片-------
    const images = data.get('images').map((item) =>
      Map({
        artworkUrl: item.get('artworkUrl')
      })
    );

    param = param.set('images', images);

    // -----商品规格列表-------
    let goodsSpecs = data.get('goodsSpecs').map((item) => {
      return Map({
        specId: item.get('isMock') == true ? null : item.get('specId'),
        mockSpecId: item.get('specId'),
        specName: item.get('specName').trim()
      });
    });
    param = param.set('goodsSpecs', goodsSpecs);

    // -----商品属性列表-------
    let goodsPropDatil = List();
    let list = data.get('propDetail');
    if (list) {
      list.forEach((item) => {
        let { propId, goodsPropDetails } = item.toJS();
        goodsPropDetails = fromJS(goodsPropDetails);
        let goodsId = goods.get('goodsId');
        const propValue = goodsPropDetails.find(
          (i) => i.get('select') == 'select'
        );
        let detailId = propValue.get('detailId');
        goodsPropDatil = goodsPropDatil.push(
          Map({
            propId: propId,
            goodsId: goodsId,
            detailId: detailId
          })
        );
      });
      param = param.set('goodsPropDetailRels', goodsPropDatil);
    }
    // -----商品规格值列表-------
    let goodsSpecDetails = List();
    data.get('goodsSpecs').forEach((item) => {
      item.get('specValues').forEach((specValueItem) => {
        goodsSpecDetails = goodsSpecDetails.push(
          Map({
            specId: item.get('isMock') == true ? null : item.get('specId'),
            mockSpecId: item.get('specId'),
            specName: item.get('specName').trim(),
            specDetailId: specValueItem.get('isMock')
              ? null
              : specValueItem.get('specDetailId'),
            mockSpecDetailId: specValueItem.get('specDetailId'),
            detailName: specValueItem.get('detailName').trim()
          })
        );
      });
    });
    param = param.set('goodsSpecDetails', goodsSpecDetails);
    // -----商品SKU列表-------
    let skuNameMap = Map();
    let existedSkuName = '';
    data.get('goodsSpecs').forEach((item) => {
      if (skuNameMap.has(item.get('specName') + '')) {
        existedSkuName = item.get('specName') + '';
        return false;
      } else {
        skuNameMap = skuNameMap.set(item.get('specName') + '', '1');
      }
    });
    let skuNoMap = Map();
    let existedSkuNo = '';
    let goodsList = List();
    data.get('goodsList').forEach((item) => {
      if (skuNoMap.has(item.get('goodsInfoNo') + '')) {
        existedSkuNo = item.get('goodsInfoNo') + '';
        return false;
      } else {
        skuNoMap = skuNoMap.set(item.get('goodsInfoNo') + '', '1');
      }

      // 规格id集合
      let mockSpecIds = List();
      // 规格值id集合
      let mockSpecDetailIds = List();
      item.forEach((value, key: string) => {
        if (key.indexOf('specId-') != -1) {
          mockSpecIds = mockSpecIds.push(parseInt(key.split('-')[1]));
        }
        if (key.indexOf('specDetailId') != -1) {
          mockSpecDetailIds = mockSpecDetailIds.push(value);
        }
      });

      let imageUrl = null;
      let qrcodeUrl = null;

      if (item.get('images') != null && item.get('images').count() > 0) {
        imageUrl = item.get('images').toJS()[0].artworkUrl;
      }
      if (
        item.get('qrcodeImages') != null &&
        item.get('qrcodeImages').count() > 0
      ) {
        qrcodeUrl = item.get('qrcodeImages').toJS()[0].artworkUrl;
      }
      goodsList = goodsList.push(
        Map({
          goodsInfoId: item.get('goodsInfoId') ? item.get('goodsInfoId') : null,
          goodsInfoNo: item.get('goodsInfoNo'),
          goodsInfoBarcode: item.get('goodsInfoBarcode'),
          stock: item.get('stock'),
          marketPrice: item.get('marketPrice') || 0,
          vipPrice: item.get('vipPrice') || 0,
          supplyPrice: item.get('supplyPrice') || 0,
          mockSpecIds,
          mockSpecDetailIds,
          goodsInfoImg: imageUrl,
          goodsInfoQrcode: qrcodeUrl,
          addStep: item.get('addStep'),
          goodsWareStocks: item.get('goodsWareStocks')
            ? item.get('goodsWareStocks')
            : null
        })
      );
    });
    if (goodsList.count() === 0) {
      message.error('SKU不能为空');
      return false;
    }

    if (existedSkuNo) {
      message.error(`SKU编码[${existedSkuNo}]重复`);
      return false;
    }

    if (existedSkuName) {
      message.error('规格名称重复');
      return false;
    }

    if (goodsList.count() > Const.spuMaxSku) {
      message.error(`SKU数量不超过${Const.spuMaxSku}个`);
      return false;
    }

    param = param.set('goodsInfos', goodsList);

    this.dispatch('goodsActor: saveLoading', true);

    let result: any;
    let result2: any;
    let result3: any;
    const i = this.state().get('checkFlag');
    const enterpriseFlag = this.state().get('enterpriseFlag');
    if (goods.get('goodsId')) {
      if (goods.get('saleType') == 0) {
        const goodsId = goods.get('goodsId');
        if (i == 'true') {
          if (enterpriseFlag) {
            result2 = await toGeneralgoods(goodsId);
            result3 = await enterpriseToGeneralgoods(goodsId);
          } else {
            result2 = await toGeneralgoods(goodsId);
          }
        } else if (enterpriseFlag) {
          result3 = await enterpriseToGeneralgoods(goodsId);
        }
      }
      result = await edit(param.toJS());
    } else {
      result = await save(param.toJS());
    }

    this.dispatch('goodsActor: saveLoading', false);

    if (result.res.code === Const.SUCCESS_CODE) {
      if (i == 'true' && goods.get('saleType') == 0) {
        if (result2 != undefined && result2.res.code !== Const.SUCCESS_CODE) {
          message.error(result.res.message);
          return false;
        }
        if (result3 != undefined && result3.res.code !== Const.SUCCESS_CODE) {
          message.error(result.res.message);
          return false;
        }
      }
      // 新增商品后得到保存后的商品编号
      if (!goods.get('goodsId')) {
        goods = goods.set('goodsId', result.res.context);
      }

      this.dispatch('goodsActor: editGoods', goods);

      message.success('操作成功');

      // 新增时只有保存成功才能进入价格tab
      return true;
    } else {
      message.error(result.res.message);
    }

    return false;
  };

  /**
   * 保存基本信息和价格
   */
  saveAll = async () => {
    if (!this._validMainForms() || !this._validPriceForms()) {
      return false;
    }

    const data = this.state();
    let param = Map();

    // -----商品信息-------
    let goods = data.get('goods');

    if (goods.get('cateId') === '-1') {
      message.error('请选择平台类目');
      return false;
    }

    if (!goods.get('storeCateIds')) {
      message.error('请选择店铺分类');
      return false;
    }

    if (goods.get('brandId') === '0') {
      message.error('请选择品牌');
      return false;
    }

    // 是否多规格标记
    goods = goods.set('moreSpecFlag', data.get('specSingleFlag') ? 0 : 1);
    // 详情
    const detailEditor = data.get('detailEditor') || {};
    goods = goods.set(
      'goodsDetail',
      detailEditor.getContent ? detailEditor.getContent() : ''
    );

    const tabs = [];
    if (
      data.get('detailEditor_0') &&
      data.get('detailEditor_0').val &&
      data.get('detailEditor_0').val.getContent
    ) {
      tabs.push({
        goodsId: goods.get('goodsId'),
        tabId: data.get('detailEditor_0').tabId,
        tabDetail: data.get('detailEditor_0').val.getContent()
      });
    }
    if (
      data.get('detailEditor_1') &&
      data.get('detailEditor_1').val &&
      data.get('detailEditor_1').val.getContent
    ) {
      tabs.push({
        goodsId: goods.get('goodsId'),
        tabId: data.get('detailEditor_1').tabId,
        tabDetail: data.get('detailEditor_1').val.getContent()
      });
    }
    if (
      data.get('detailEditor_2') &&
      data.get('detailEditor_2').val &&
      data.get('detailEditor_2').val.getContent
    ) {
      tabs.push({
        goodsId: goods.get('goodsId'),
        tabId: data.get('detailEditor_2').tabId,
        tabDetail: data.get('detailEditor_2').val.getContent()
      });
    }
    if (data.get('video') && JSON.stringify(data.get('video')) !== '{}') {
      goods = goods.set('goodsVideo', data.get('video').get('artworkUrl'));
    }

    param = param.set('goodsTabRelas', tabs);

    goods = goods.set('goodsType', 0);
    goods = goods.set('goodsSource', 1);

    param = param.set('goods', goods);

    // -----商品相关图片-------
    const images = data.get('images').map((item) =>
      Map({
        artworkUrl: item.get('artworkUrl')
      })
    );

    param = param.set('images', images);
    // -----商品属性列表-------
    let goodsPropDatil = List();
    let list = data.get('propDetail');
    if (list) {
      list.forEach((item) => {
        let { propId, goodsPropDetails } = item.toJS();
        goodsPropDetails = fromJS(goodsPropDetails);
        let goodsId = goods.get('goodsId');
        const propValue = goodsPropDetails.find(
          (i) => i.get('select') == 'select'
        );
        let detailId = propValue.get('detailId');
        goodsPropDatil = goodsPropDatil.push(
          Map({
            propId: propId,
            goodsId: goodsId,
            detailId: detailId
          })
        );
      });
      param = param.set('goodsPropDetailRels', goodsPropDatil);
    }
    // -----商品规格列表-------
    let goodsSpecs = data.get('goodsSpecs').map((item) => {
      return Map({
        specId: item.get('isMock') == true ? null : item.get('specId'),
        mockSpecId: item.get('specId'),
        specName: item.get('specName').trim()
      });
    });
    param = param.set('goodsSpecs', goodsSpecs);

    // -----商品规格值列表-------
    let goodsSpecDetails = List();
    data.get('goodsSpecs').forEach((item) => {
      item.get('specValues').forEach((specValueItem) => {
        goodsSpecDetails = goodsSpecDetails.push(
          Map({
            specId: item.get('isMock') == true ? null : item.get('specId'),
            mockSpecId: item.get('specId'),
            specName: item.get('specName').trim(),
            specDetailId: specValueItem.get('isMock')
              ? null
              : specValueItem.get('specDetailId'),
            mockSpecDetailId: specValueItem.get('specDetailId'),
            detailName: specValueItem.get('detailName').trim()
          })
        );
      });
    });
    param = param.set('goodsSpecDetails', goodsSpecDetails);

    // -----商品SKU列表-------
    let skuNoMap = Map();
    let existedSkuNo = '';
    let goodsList = List();
    data.get('goodsList').forEach((item) => {
      if (skuNoMap.has(item.get('goodsInfoNo') + '')) {
        existedSkuNo = item.get('goodsInfoNo') + '';
        return false;
      } else {
        skuNoMap = skuNoMap.set(item.get('goodsInfoNo') + '', '1');
      }

      // 规格id集合
      let mockSpecIds = List();
      // 规格值id集合
      let mockSpecDetailIds = List();
      item.forEach((value, key: string) => {
        if (key.indexOf('specId-') != -1) {
          mockSpecIds = mockSpecIds.push(parseInt(key.split('-')[1]));
        }
        if (key.indexOf('specDetailId') != -1) {
          mockSpecDetailIds = mockSpecDetailIds.push(value);
        }
      });

      let imageUrl = null;
      let qrcodeUrl = null;

      if (item.get('images') != null && item.get('images').count() > 0) {
        imageUrl = item.get('images').toJS()[0].artworkUrl;
      }
      if (
        item.get('qrcodeImages') != null &&
        item.get('qrcodeImages').count() > 0
      ) {
        qrcodeUrl = item.get('qrcodeImages').toJS()[0].artworkUrl;
      }
      goodsList = goodsList.push(
        Map({
          goodsInfoId: item.get('goodsInfoId') ? item.get('goodsInfoId') : null,
          goodsInfoNo: item.get('goodsInfoNo'),
          goodsInfoBarcode: item.get('goodsInfoBarcode'),
          stock: item.get('stock'),
          marketPrice: item.get('marketPrice'),
          vipPrice: item.get('vipPrice'),
          mockSpecIds,
          mockSpecDetailIds,
          goodsInfoImg: imageUrl,
          goodsInfoQrcode: qrcodeUrl,
          goodsWareStocks: item.get('goodsWareStocks')
            ? item.get('goodsWareStocks')
            : null
        })
      );
    });

    if (goodsList.count() === 0) {
      message.error('SKU不能为空');
      return false;
    }

    if (existedSkuNo) {
      message.error(`SKU编码[${existedSkuNo}]重复`);
      return false;
    }

    if (goodsList.count() > Const.spuMaxSku) {
      message.error(`SKU数量不超过${Const.spuMaxSku}个`);
      return false;
    }

    param = param.set('goodsInfos', goodsList);

    //---价格信息
    let priceType = data.get('priceOpt');
    // 设价类型 0:客户,1:区间
    goods = goods.set('priceType', priceType);
    // 如果不是按客户设价，则删除SPU统一门店价字段
    if (priceType != 0) {
      goods = goods.delete('marketPrice');
    }
    // 是否按客户单独定价
    goods = goods.set('customFlag', data.get('openUserPrice') ? 1 : 0);
    // 是否叠加客户等级折扣
    goods = goods.set(
      'levelDiscountFlag',
      data.get('levelDiscountFlag') ? 1 : 0
    );

    param = param.set('goods', goods);

    // -----商品等级价格列表-------
    let isErr = false;
    data.get('userLevelPrice').forEach((value) => {
      if (
        value.get('count') != null &&
        value.get('maxCount') != null &&
        value.get('count') > value.get('maxCount')
      ) {
        isErr = true;
      }
    });
    if (isErr) {
      message.error('起订量不允许超过限订量');
      return;
    }

    const goodsLevelPrices = data.get('userLevelPrice').valueSeq().toList();
    param = param.set('goodsLevelPrices', goodsLevelPrices);

    // -----商品客户价格列表-------
    data.get('userPrice').forEach((value) => {
      if (
        value.get('count') != null &&
        value.get('maxCount') != null &&
        value.get('count') > value.get('maxCount')
      ) {
        isErr = true;
      }
    });
    if (isErr) {
      message.error('起订量不允许超过限订量');
      return;
    }
    const userPrice = data.get('userPrice').valueSeq().toList();
    param = param.set('goodsCustomerPrices', userPrice);

    // -----商品订货区间价格列表-------
    const areaPrice = data.get('areaPrice').valueSeq().toList();
    //验证订货区间是否重复
    if (priceType == 1 && areaPrice != null && areaPrice.count() > 0) {
      let cmap = Map();
      let isExist = false;
      areaPrice.forEach((value) => {
        if (cmap.has(value.get('count') + '')) {
          isExist = true;
        } else {
          cmap = cmap.set(value.get('count') + '', '1');
        }
      });

      if (isExist) {
        message.error('订货区间不允许重复');
        return;
      }
    }

    param = param.set('goodsIntervalPrices', areaPrice);
    //添加参数，是否允许独立设价
    //param = param.set('allowAlonePrice', this.state().get('allowAlonePrice') ? 1 : 0)
    this.dispatch('goodsActor: saveLoading', true);

    let result: any;
    let result2: any;
    let result3: any;
    const i = this.state().get('checkFlag');
    const enterpriseFlag = this.state().get('enterpriseFlag');
    if (goods.get('goodsId')) {
      if (goods.get('saleType') == 0) {
        const goodsId = goods.get('goodsId');
        if (i == 'true') {
          if (enterpriseFlag) {
            result2 = await toGeneralgoods(goodsId);
            result3 = await enterpriseToGeneralgoods(goodsId);
          } else {
            result2 = await toGeneralgoods(goodsId);
          }
        } else if (enterpriseFlag) {
          result3 = await enterpriseToGeneralgoods(goodsId);
        }
      }
      result = await editAll(param.toJS());
    } else {
      result = await addAll(param.toJS());
    }

    this.dispatch('goodsActor: saveLoading', false);

    if (result.res.code === Const.SUCCESS_CODE) {
      if (i == 'true' && goods.get('saleType') == 0) {
        if (result2 != undefined && result2.res.code !== Const.SUCCESS_CODE) {
          message.error(result.res.message);
          return false;
        }
        if (result3 != undefined && result3.res.code !== Const.SUCCESS_CODE) {
          message.error(result.res.message);
          return false;
        }
      }
      message.success('操作成功');
      history.push('/bd-goods-list');
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 客户搜索
   */
  searchUserList = async (customerName?: string) => {
    //判断是否是自营店铺 自营店铺根据用户名查询 非自营店铺前台过滤查询
    if (util.isThirdStore()) {
      const userList = this.state()
        .get('sourceUserList')
        .filter((user) => user.get('customerName').indexOf(customerName) > -1);
      this.dispatch('userActor: setUserList', userList);
    } else {
      if (customerName) {
        const userList: any = await getBossUserListByName(customerName);
        this.dispatch('userActor: setUserList', fromJS(userList.res.context));
      } else {
        const userList: any = await getBossUserList();
        this.dispatch('userActor: setUserList', fromJS(userList.res.context));
      }
    }
  };

  /**
   * 更新库存或门店价选中状态
   * @param key 取值为stock | marketPrice
   * @param checked 选中状态
   */
  updateChecked = async (key: string, checked?: boolean) => {
    this.dispatch('goodsSpecActor: updateChecked', { key, checked });
  };

  /**
   * 同步库存或门店价的值
   * @param key 取值为stock | marketPrice
   */
  synchValue = async (key: string) => {
    this.dispatch('goodsSpecActor: synchValue', key);
  };

  /**
   * 显示品牌弹窗
   */
  showBrandModal = () => {
    this.transaction(() => {
      this.dispatch('brandActor: showModal');
    });
  };

  /**
   * 修改品牌名称
   */
  editBrandInfo = (formData: IMap) => {
    this.dispatch('brandActor: editBrandInfo', formData);
  };

  /**
   * 关闭品牌弹窗
   */
  closeBrandModal = () => {
    this.dispatch('brandActor: closeModal');
  };

  /**
   * 添加品牌
   */
  doBrandAdd = async () => {
    const formData = this.state().get('brandData');
    let result: any = await addBrand(formData);

    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.dispatch('brandActor: closeModal');

      // 刷新
      const brandList: any = await getBrandList();
      this.dispatch('goodsActor: initBrandList', fromJS(brandList.res));

      this.state()
        .get('goodsForm')
        .setFieldsValue({ brandId: result.res.context + '' });
      this.dispatch(
        'goodsActor: editGoods',
        Map({ ['brandId']: result.res.context + '' })
      );
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 显示分类弹窗
   */
  showCateModal = (_formData: IMap) => {
    this.dispatch('cateActor: showModal');
  };

  /**
   * 关闭分类弹窗
   */
  closeCateModal = () => {
    this.dispatch('cateActor: closeModal');
  };

  /**
   * 修改form信息
   */
  editCateData = (formData: IMap) => {
    this.dispatch('cateActor: editFormData', formData);
  };

  /**
   * 添加品牌
   */
  doCateAdd = async (cateName, cateParentId, sort) => {
    let result: any = await addCate({ cateName, cateParentId, sort });
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.dispatch('cateActor: closeModal');
      // 刷新
      const cateList = await getStoreCateList();
      this.dispatch(
        'goodsActor: initStoreCateList',
        fromJS((cateList.res as any).context)
      );
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 修改商品图片
   */
  editCateImages = (images: IList) => {
    this.dispatch('cateActor: editImages', images);
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
   * 同步等级限订量
   */
  synchLevelMaxCount = async () => {
    this.dispatch('priceActor: synchLevelMaxCount');
  };

  /**
   * 更新客户起订量选中状态
   */
  updateUserCountChecked = async (userCountChecked?: boolean) => {
    this.dispatch('priceActor: editUserCountChecked', userCountChecked);
  };

  /**
   * 同步客户起订量
   */
  synchUserCount = async () => {
    this.dispatch('priceActor: synchUserCount');
  };

  /**
   * 更新客户限订量选中状态
   */
  updateUserMaxCountChecked = async (userCountChecked?: boolean) => {
    this.dispatch('priceActor: editUserMaxCountChecked', userCountChecked);
  };

  /**
   * 同步客户限订量
   */
  synchUserMaxCount = async () => {
    this.dispatch('priceActor: synchUserMaxCount');
  };

  editCateId = async (value: string) => {
    this.dispatch('modal: cateId', value);
  };

  /**
   * 修改选中分类
   * @param value
   * @returns {Promise<void>}
   */
  editDefaultCateId = async (value: string) => {
    this.dispatch('modal: cateIds', List.of(value));
  };

  editVideoCateId = async (value: string) => {
    this.dispatch('cateActor: cateId', value);
  };

  /**
   * 修改选中分类
   * @param value
   * @returns {Promise<void>}
   */
  editVideoDefaultCateId = async (value: string) => {
    this.dispatch('cateActor: cateIds', List.of(value));
  };

  // modalVisible = async (maxCount: number, imgType: number, skuId: string) => {
  //   if (this.state().get('visible')) {
  //     this.initImg({ pageNum: 0, cateId: '', successCount: 0 });
  //   }
  //   if (maxCount) {
  //     //取消时候, 该值为0, 不重置, 防止页面渲染太快, 看到数量变化不友好
  //     this.dispatch('modal: maxCount', maxCount);
  //   }
  //   this.dispatch('modal: visible', { imgType, skuId });
  // };

  modalVisible = async (maxCount: number, imgType: number, skuId: string) => {
    if (this.state().get('visible')) {
      let cateId;
      cateId = imgType === -1000 ? -1000 : '';
      this.initImg({
        pageNum: 0,
        cateId: cateId,
        successCount: 0
      });
    }
    if (this.state().get('videoVisible')) {
      this.initVideo({
        pageNum: 0,
        cateId: '',
        successCount: 0
      });
    }
    if (maxCount) {
      //取消时候, 该值为0, 不重置, 防止页面渲染太快, 看到数量变化不友好
      this.dispatch('modal: maxCount', maxCount);
    }
    this.dispatch('modal: visible', { imgType, skuId });
  };

  search = async (imageName: string) => {
    this.dispatch('modal: search', imageName);
  };

  videoSearch = async (videoName: string) => {
    this.dispatch('modal: videoSearch', videoName);
  };

  /**
   * 点击搜索保存搜索内容
   * @param {string} searchName
   * @returns {Promise<void>}
   */
  saveSearchName = async (searchName: string) => {
    this.dispatch('modal: searchName', searchName);
  };

  /**
   * 点击搜索保存搜索内容
   * @param {string} searchName
   * @returns {Promise<void>}
   */
  saveVideoSearchName = async (videoSearchName: string) => {
    this.dispatch('modal: videoSearchName', videoSearchName);
  };

  /**
   * 点击图片
   * @param {any} check
   * @param {any} img
   */
  chooseImg = ({ check, img, chooseCount }) => {
    this.dispatch('modal: chooseImg', { check, img, chooseCount });
  };

  /**
   * 确定选择以上图片
   */
  beSureImages = () => {
    const chooseImgs = this.state().get('chooseImgs');
    const imgType = this.state().get('imgType');
    if (imgType === 0) {
      let images = this.state().get('images');
      images = images.concat(chooseImgs);
      this.dispatch('imageActor: editImages', images);
    } else if (imgType === 1) {
      const skuId = this.state().get('skuId');
      this.dispatch('goodsSpecActor: editGoodsItem', {
        id: skuId,
        key: 'images',
        value: chooseImgs
      });
    } else if (imgType === -1000) {
      const skuId = this.state().get('skuId');
      this.dispatch('goodsSpecActor: editGoodsItem', {
        id: skuId,
        key: 'qrcodeImages',
        value: chooseImgs
      });
    } else {
      if (this.state().get('editor') === 'detail') {
        this.state()
          .get('detailEditor')
          .execCommand('insertimage', (chooseImgs || fromJS([])).toJS());
      } else {
        const name = this.state().get('editor');
        this.state()
          .get(name)
          .val.execCommand('insertimage', (chooseImgs || fromJS([])).toJS());
      }
    }
  };

  editEditor = (editor) => {
    this.dispatch('goodsActor: editor', editor);
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
   * 移除二维码
   * @param id
   */
  removeQrImg = ({ id }) => {
    this.dispatch('goodsQrSpecActor: removeQrImg', id);
  };

  /**
   * 清除选中的图片集合
   */
  cleanChooseImgs = () => {
    this.dispatch('modal: cleanChooseImg');
  };

  /**
   * 切换 基础信息 与 价格及订货量 tab
   * @param activeKey
   * @param executeValid 是否执行基本信息校验
   */
  onMainTabChange = (activeKey, executeValid: boolean = true) => {
    if (executeValid) {
      // 基本信息校验不通过，不允许进行切换
      if ('price' === activeKey && !this._validMainForms()) {
        return;
      }
    }
    this.dispatch('goodsActor: tabChange', activeKey);
  };

  /**
   * 对应类目、商品下的所有属性信息
   */
  showGoodsPropDetail = async (cateId, goodsPropList) => {
    if (!cateId) {
      this.dispatch('propActor: clear');
    } else {
      const result: any = await getCateIdsPropDetail(cateId);
      if (result.res.code === Const.SUCCESS_CODE) {
        let catePropDetail = fromJS(result.res.context);
        //类目属性中的属性值没有其他，拼接一个其他选项
        catePropDetail = catePropDetail.map((prop) => {
          let goodsPropDetails = prop.get('goodsPropDetails').push(
            fromJS({
              detailId: '0',
              detailName: '其他',
              select: 'select'
            })
          );
          return prop.set('goodsPropDetails', goodsPropDetails);
        });
        //将商品中的属性与属性值信息映射到类目属性里
        if (
          goodsPropList &&
          catePropDetail.size > 0 &&
          goodsPropList.size > 0
        ) {
          goodsPropList.forEach((item) => {
            const { detailId, propId } = item.toJS();
            const index = catePropDetail.findIndex(
              (p) => p.get('propId') === propId
            );
            if (index > -1) {
              let detailList = catePropDetail
                .getIn([index, 'goodsPropDetails'])
                .map((d) => {
                  if (d.get('detailId') == detailId) {
                    return d.set('select', 'select');
                  }
                  return d.set('select', '');
                });
              catePropDetail = catePropDetail.setIn(
                [index, 'goodsPropDetails'],
                detailList
              );
            }
          });
        }
        this.dispatch(
          'propActor: setPropList',
          this._changeList(catePropDetail)
        );
        this.dispatch('propActor: goodsPropDetails', catePropDetail);
      }
    }
  };

  /**
   * 将数组切为每两个元素为一个对象的新数组
   * @param propDetail
   * @private
   */
  _changeList(propDetail) {
    const newGoodsProps = new Array();
    let propArr = new Array();
    for (let i = 0; i < propDetail.size; i++) {
      if (i % 2 == 0) {
        propArr = new Array();
        newGoodsProps.push(propArr);
      }
      propArr.push(propDetail.get(i));
    }
    return fromJS(newGoodsProps);
  }

  changePropVal = (val) => {
    this.dispatch('propActor: change', val);
  };
  /**
   * 所有运费模板
   */
  setFreightList = async () => {
    const { res, err } = await freightList();
    if (!err && res.code === Const.SUCCESS_CODE) {
      this.dispatch('freight:freightList', fromJS(res.context));
    } else {
      message.error(res.message);
    }
  };
  /**
   * 运费模板首重，续重信息
   */
  setGoodsFreight = async (freightTempId: number, isSelect: boolean,isGoodsWeight=true) => {
    const { res, err } = await goodsFreight(freightTempId);
    if (!err && res.code === Const.SUCCESS_CODE) {
      if (isSelect) {
        this.dispatch('freight:selectTemp', fromJS(res.context));
        const result = (await goodsFreightExpress(freightTempId)) as any;
        if (result.res.code === Const.SUCCESS_CODE) {
          this.dispatch(
            'freight:selectTempExpress',
            fromJS(result.res.context)
          );
          // if(isGoodsWeight) this.goodsWeightBut();  
        } else {
          message.error(result.res.message);
        }
      } else {
        this.dispatch('freight:freightTemp', fromJS(res.context));
      }
    } else {
      message.error(res.message);
    }
  };

  // goodsWeightBut=()=>{
  //   const {
  //     selectTempExpress,goods
  //   } = this.state().toJS();
  //   let freightStartPrice=Number(selectTempExpress?.freightStartPrice)||0;
  //   let addStep=Number(goods?.addStep)||0;
  //   this.editGoods(Map({
  //     ['goodsWeight']: fromJS((freightStartPrice*addStep).toFixed(3))
  //   }))
  // }

  /**
   * 切换独立设价
   */
  toggleSetAlonePrice = (result) => {
    this.dispatch('priceActor:setAlonePrice', result);
  };

  /**
   * 根据分类id,找寻自己+所有子类List
   */
  _getCateIdsList = (cateListIm, cateId) => {
    let cateIdList = new Array();
    if (cateId) {
      cateIdList.push(cateId);
      const secondCateList = cateListIm.filter(
        (item) => item.get('cateParentId') == cateId
      ); //找第二层子节点
      if (secondCateList && secondCateList.size > 0) {
        cateIdList = cateIdList.concat(
          secondCateList.map((item) => item.get('cateId')).toJS()
        );
        const thirdCateList = cateListIm.filter(
          (item) =>
            secondCateList.filter(
              (sec) => item.get('cateParentId') == sec.get('cateId')
            ).size > 0
        ); //找第三层子节点
        if (thirdCateList && thirdCateList.size > 0) {
          cateIdList = cateIdList.concat(
            thirdCateList.map((item) => item.get('cateId')).toJS()
          );
        }
      }
    }
    return cateIdList;
  };

  // /**
  //  * 设置上传二维码的标识
  //  * @param flag
  //  */
  // setQruploadFlag = (flag: boolean) => {
  //   this.dispatch('imageActor: setQrUploadFlag', flag);
  // };
}
