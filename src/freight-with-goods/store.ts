import { message } from 'antd';
import { Store, IOptions } from 'plume2';
import FreightActor from './actor/freight-actor';
import { fromJS } from 'immutable';
import * as webapi from './webapi';
import { Const } from 'qmkit';
export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [new FreightActor()];
  }

  setPageType = (pageType) => {
    this.dispatch('freight:setPageType', pageType);
  };

  /**
   * 初始化
   */
  init = async (params: any) => {
    const { res, err } = await webapi.goodsList(params);
    if (!err && res.code === Const.SUCCESS_CODE) {
      res.context.goodsPage.content.forEach((v, i) => {
        v.key = i;
      });
      this.dispatch('freight:freightWithGoods', fromJS(res.context));
      this.dispatch('freight:clearSelectedSpuKeys');
    } else {
      message.error(res.message);
    }
  };
  /**
   * 获取店铺所有运费模板
   */
  setFreightList = async () => {
    const pageType = this.state().get('pageType');
    const { res, err } = await webapi.freightList(pageType);
    if (!err && res.code === Const.SUCCESS_CODE) {
      this.dispatch('freight:freightList', fromJS(res.context));
    } else {
      message.error(res.message);
    }
  };
  /**
   * 获取选中的运费模板
   */
  setGoodsFreight = async (freightTempId: number, isSelect: boolean) => {
    const pageType = this.state().get('pageType');
    const { res, err } = await webapi.goodsFreight(freightTempId, pageType);
    if (!err && res.code === Const.SUCCESS_CODE) {
      if (isSelect) {
        this.dispatch('freight:selectTemp', fromJS(res.context));
        const result = (await webapi.goodsFreightExpress(
          freightTempId,
          pageType
        )) as any;
        if (result.res.code === Const.SUCCESS_CODE) {
          this.dispatch(
            'freight:selectTempExpress',
            fromJS(result.res.context)
          );
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
  /**
   * modal显示
   */
  setFeightVisible = (feightVisible: boolean) => {
    this.dispatch('freight:feightVisible', feightVisible);
  };
  /**
   * 获取选中的spuId
   */
  setSelectedRowKeys = (selectedRowKeys) => {
    this.dispatch('freight:selectedRowKeys', fromJS(selectedRowKeys));
  };
  /**
   * 获取运费模板ID
   */
  setFreightTempId = (freightTempId: number) => {
    this.dispatch('freight:freightTempId', freightTempId);
  };
  /**
   * 设置单个spuID
   */
  setGoodsId = (goodsId: string) => {
    this.dispatch('freight:goodsId', goodsId);
  };
  /**
   * 是否批量标志
   */
  setIsBatch = (isBatch: boolean) => {
    this.dispatch('freight:isBatch', isBatch);
  };
  /**
   * 批量编辑运费模板
   */
  submitBatchFreight = async (freightTempId: number) => {
    const goodsIds = this.state().get('selectedRowKeys');
    let param = {
      goodsIds: goodsIds.toJS(),
      freightTempId: freightTempId
    };
    const { res, err } = (await webapi.updateFreight(param)) as any;
    if (!err && res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      const params = {
        pageNum: 0,
        pageSize: 10,
        freightTempId: this.state()
          .get('freightTemp')
          .get('freightTempId')
      };
      this.init(params);
      this.setFreightList();
      this.setGoodsFreight(
        this.state()
          .get('freightTemp')
          .get('freightTempId'),
        false
      );
      this.setFeightVisible(false);
      this.setFreightTempId(null);
      this.dispatch('freight:clearSelectedSpuKeys');
    } else {
      message.error(res.message);
    }
  };
  /**
   * 单个编辑运费模板
   */
  submitFreight = async (freightTempId: number) => {
    const goodsId = this.state().get('goodsId');
    let goodsIds = [];
    goodsIds.push(goodsId);
    let param = {
      goodsIds: goodsIds,
      freightTempId: freightTempId
    };
    const { res, err } = (await webapi.updateFreight(param)) as any;
    if (!err && res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      const params = {
        pageNum: 0,
        pageSize: 10,
        freightTempId: this.state()
          .get('freightTemp')
          .get('freightTempId')
      };
      this.init(params);
      this.setFreightList();
      this.setGoodsFreight(
        this.state()
          .get('freightTemp')
          .get('freightTempId'),
        false
      );
      this.setFeightVisible(false);
      this.setFreightTempId(null);
    } else {
      message.error(res.message);
    }
  };
}
