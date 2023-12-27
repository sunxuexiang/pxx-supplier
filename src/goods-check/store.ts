import { Store, IOptions } from 'plume2';
import { fromJS } from 'immutable';
import CateActor from './actor/cate-actor';
import BrandActor from './actor/brand-actor';
import GoodsActor from './actor/goods-actor';
import FormActor from './actor/form-actor';
import { message } from 'antd';
import { Const } from 'qmkit';
import { goodsList, spuDelete, getCateList, getBrandList } from './webapi';

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
    { pageNum, pageSize, flushSelected } = {
      pageNum: 0,
      pageSize: 10,
      flushSelected: true
    }
  ) => {
    const { res, err } = (await goodsList({
      pageNum,
      pageSize,
      auditStatusList: this.state()
        .get('auditStatusList')
        .toJS()
    })) as any;
    if (!err && res.code === Const.SUCCESS_CODE) {
      res.context.goodsPage.content.forEach((v, i) => {
        v.key = i;
      });
      this.dispatch('goodsActor: init', fromJS(res.context));
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

  /**
   * 条件搜索,回到第一页
   */
  onSearch = async () => {
    this.dispatch('form:field', { key: 'pageNum', value: 0 });
    this.onPageSearch();
  };

  /**
   * 带着搜索条件的分页点击查询
   */
  onPageSearch = async () => {
    let request: any = {
      likeGoodsName: this.state().get('likeGoodsName'),
      likeGoodsInfoNo: this.state().get('likeGoodsInfoNo'),
      likeGoodsNo: this.state().get('likeGoodsNo'),
      pageNum: this.state().get('pageNum'),
      pageSize: this.state().get('pageSize'),
      auditStatusList: this.state()
        .get('auditStatusList')
        .toJS()
    };

    if (this.state().get('storeCateId') != '-1') {
      request.storeCateId = this.state().get('storeCateId');
    }
    if (this.state().get('brandId') != '-1') {
      request.brandId = this.state().get('brandId');
    }
    if (this.state().get('saleType') != '-1') {
      request.saleType = this.state().get('saleType');
    }

    const { res, err } = (await goodsList(request)) as any;
    if (!err) {
      res.context.goodsPage.content.forEach((v, i) => {
        v.key = i;
      });
      this.dispatch('goodsActor: init', fromJS(res.context));
      this.dispatch('goodsActor:clearSelectedSpuKeys');
    }
  };

  /**
   * 审核状态tab页切换
   */
  onStateTabChange = (tabIndex) => {
    this.dispatch('form:field', { key: 'tabIndex', value: tabIndex });
    this.dispatch('form:field', {
      key: 'auditStatusList',
      value: fromJS(this.getAuditStatusList(tabIndex))
    });
    this.onSearch();
  };

  getAuditStatusList = (tabIndex) => {
    if (tabIndex == '1') {
      return [0, 2, 3]; //待审核,审核未通过,禁售中
    } else if (tabIndex == '2') {
      return [0]; //待审核
    } else if (tabIndex == '3') {
      return [2]; //审核未通过
    } else if (tabIndex == '4') {
      return [3]; //禁售中
    }
  };

  /**
   * 搜索条件表单的变更
   */
  onFormFieldChange = ({ key, value }) => {
    this.dispatch('form:field', { key, value });
  };

  /**
   * 搜索skuNo,利用此进行标记展开哪些spuList
   */
  onEditSkuNo = (value) => {
    this.dispatch('goodsActor:editLikeGoodsInfoNo1', value);
  };

  /**
   * 修改展开显示的spuIdList
   */
  onShowSku = (value) => {
    this.dispatch('goodsActor:editExpandedRowKeys', value);
  };

  /**
   * 修改勾选的spuIdList
   */
  onSelectChange = (selectedRowKeys: number[]) => {
    this.dispatch('goodsActor: onSelectChange', fromJS(selectedRowKeys));
  };

  /**
   * 商品批量删除
   */
  onSpuDelete = async (ids: string[]) => {
    if (!ids) {
      ids = this.state()
        .get('selectedSpuKeys')
        .toJS();
    }
    await spuDelete({ goodsIds: ids });
    this.onSearch();
  };

  /**
   * 提示信息
   */
  message = (data: any) => {
    if (data.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      message.error(data.res.message);
    }
  };
}
