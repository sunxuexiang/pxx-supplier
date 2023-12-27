import { IOptions, Store } from 'plume2';
import { fromJS } from 'immutable';
import GoodsActor from './actor/goods-actor';
import FormActor from './actor/form-actor';
import { message } from 'antd';
import { Const } from 'qmkit';
import { IList } from 'typings/globalType';
import {
  getBrandList,
  getCateList,
  goodsList,
  importToGoodsLibrary
} from './webapi';
import BrandActor from './actor/brand-actor';
import CateActor from './actor/cate-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [
      new CateActor(),
      new BrandActor(),
      new GoodsActor(),
      new FormActor()
    ];
  }

  /**
   * 初始化
   */
  init = async (
    { pageNum, pageSize, flushSelected, goodsSource } = {
      pageNum: 0,
      pageSize: 10,
      //商品来源，0供应商，1商家
      goodsSource: 0,
      flushSelected: true
    }
  ) => {
    const { res, err } = (await goodsList({
      pageNum,
      pageSize,
      goodsSource
    })) as any;

    if (!err && res.code === Const.SUCCESS_CODE) {
      res.context.standardGoodsPage.content.forEach((v, i) => {
        v.key = i;
      });
      this.changeData(fromJS(res.context.usedStandard), fromJS(res.context));
      this.dispatch('form:field', { key: 'pageNum', value: pageNum });
    } else {
      message.error(res.message);
    }
    const cates: any = await getCateList();
    const brands: any = await getBrandList();

    this.transaction(() => {
      this.dispatch('cateActor: init', fromJS(cates.res.context));
      this.dispatch('brandActor: init', fromJS(brands.res.context));
    });

    if (flushSelected) {
      this.dispatch('goodsActor:clearSelectedSpuKeys');
    }
  };

  //根据已被导入的商品库ID，在列表数据里标记
  changeData = (goodsIds: IList, data) => {
    goodsIds = fromJS(goodsIds) || fromJS([]);
    let ids: IList = this.state().get('usedStandard');
    ids.forEach((value) => {
      goodsIds = goodsIds.push(value);
    });
    let goodsContent = data.getIn(['standardGoodsPage', 'content']);
    goodsContent = goodsContent.map((item) => {
      if (goodsIds && goodsIds.includes(item.get('goodsId'))) {
        return item.set('addGoodsLibraryFlag', true).set('addStatus', true);
      }
      return item.set('addGoodsLibraryFlag', false).set('addStatus', false);
    });
    this.dispatch(
      'goodsActor: init',
      data.setIn(['standardGoodsPage', 'content'], goodsContent)
    );
    this.dispatch('goodsActor:addUsedStandard', goodsIds);
  };

  /**
   * 条件搜索,回到第一页
   */
  onSearch = async () => {
    this.dispatch('form:field', { key: 'pageNum', value: 0 });
    this.onPageSearch(1, 10, 1);
  };

  /**
   * 带着搜索条件的分页点击查询
   */
  onPageSearch = async (pageNum, pageSize, goodsSource) => {
    let request: any = {
      likeGoodsName: this.state().get('likeGoodsName'),
      likeProviderName: this.state().get('likeProviderName'),
      //商品来源，0供应商，1商家
      goodsSource: 0,
      pageNum: pageNum - 1,
      pageSize: pageSize
    };
    if (this.state().get('cateId') != '-1') {
      request.cateId = this.state().get('cateId');
    }
    if (this.state().get('brandId') != '-1') {
      request.brandId = this.state().get('brandId');
    }

    const { res, err } = (await goodsList(request)) as any;
    if (!err) {
      res.context.standardGoodsPage.content.forEach((v, i) => {
        v.key = i;
      });
      this.changeData(fromJS(res.context.usedStandard), fromJS(res.context));
      this.dispatch('goodsActor:clearSelectedSpuKeys');
      this.onFormFieldChange({ key: 'pageNum', value: pageNum });
      this.onFormFieldChange({ key: 'pageSize', value: pageSize });
    }
    if (
      res.context.standardGoodsPage.content.length == 0 &&
      res.context.standardGoodsPage.content.totalElements &&
      res.context.standardGoodsPage.content.totalElements != 0
    ) {
      this.onSearch();
    }
  };

  //批量导入
  onImport = async (goodsIds) => {
    const { res } = (await importToGoodsLibrary({ goodsIds: goodsIds })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.changeData(goodsIds, this.state());
      this.onSelectChange([]);
      message.success('导入成功');
    } else {
      message.error(res.message);
    }
  };

  onFormFieldChange = ({ key, value }) => {
    this.dispatch('form:field', { key, value });
  };

  onShowSku = (value) => {
    this.dispatch('goodsActor:editExpandedRowKeys', value);
  };

  onSelectChange = (selectedRowKeys: number[]) => {
    this.dispatch('goodsActor: onSelectChange', fromJS(selectedRowKeys));
  };

  /**
   * tip
   */
  message = (data: any) => {
    if (data.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      message.error(data.res.code);
    }
  };
}
