import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS, List } from 'immutable';
import { Const, util, history } from 'qmkit';
import * as webApi from './webapi';
import AddGoodsActor from './actor/add-goods-actor';

export default class AppStore extends Store {
  bindActor() {
    return [new AddGoodsActor()];
  }

  /**
   * 初始化方法
   */
  init = async () => {
    await this.getAllGoodsList();
  };

  /**
   * 查询已添加商品数据
   */
  getAllGoodsList = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }
  ) => {
    // 设置loading开始状态
    this.dispatch('info:setLoading', true);
    const param = {};
    const { res: pageRes } = await webApi.getAllGoodsList(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      this.dispatch('info:setAllGoodsList', pageRes.context.liveGoodsVOList);
    } else {
      message.error(pageRes.message);
      this.dispatch('info:setLoading', false);
    }
  };

  /**
   * 设置搜索项信息并查询分页数据
   */
  onSearch = async (searchData) => {
    this.dispatch('info:setSearchData', fromJS(searchData));
    await this.queryPage();
  };

  /**
   * 单个删除
   */
  onDelete = async (id) => {
    const { res: delRes } = await webApi.deleteById(id);
    if (delRes.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      await this.queryPage();
    }
  };

  /**
   * 设置勾选的多个id
   */
  onSelect = (checkedIds) => {
    this.dispatch('info:setCheckedData', fromJS(checkedIds));
  };

  /**
   * 批量删除
   */
  onBatchDelete = async () => {
    const checkedIds = this.state().get('checkedIds');
    const { res: delRes } = await webApi.deleteByIdList(checkedIds.toJS());
    if (delRes.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      await this.queryPage();
    } else {
      message.error(delRes.message);
    }
  };

  /**
   * 打开添加弹窗
   */
  onAdd = () => {
    this.transaction(() => {
      this.dispatch('info:setVisible', true);
      this.dispatch('info:setFormData', fromJS({}));
    });
  };

  /**
   * 打开编辑弹框
   */
  onEdit = async (id) => {
    const editData = this.state()
      .get('dataList')
      .find((v) => v.get('id') == id);
    this.transaction(() => {
      this.dispatch('info:setFormData', editData);
      this.dispatch('info:setVisible', true);
    });
  };

  /**
   * 修改新增/编辑的表单信息
   */
  editFormData = (data) => {
    this.dispatch('info:editFormData', data);
  };

  /**
   * 关闭弹窗
   */
  closeModal = () => {
    this.dispatch('info:setVisible', false);
  };

  /**
   * 保存新增/编辑弹框的内容
   */
  onSave = async () => {
    const formData = this.state().get('formData');
    let result;
    if (formData.get('id')) {
      result = await webApi.modify(formData);
    } else {
      result = await webApi.add(formData);
    }
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.closeModal();
      this.dispatch('info:setFormData', fromJS({}));
      await this.init();
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 关闭导出弹框
   */
  onExportModalHide = () => {
    this.dispatch('info:exportModalHide');
  };

  /**
   * 点击完成，保存用户选择的商品信息
   * @param skuIds
   * @param rows
   */
  onOkBackFun = (skuIds, rows) => {
    //编辑价格信息
    let params = [];
    rows.map((item) => {
      const param = {
        priceType: 1,
        price: item.toJS().marketPrice,
        price2: null
      };
      params.push(param);
    });
    this.dispatch('change:goodsRowsPrice', params);

    //保存商品信息
    this.dispatch('info: field: value', {
      field: 'chooseSkuIds',
      value: skuIds
    });
    this.dispatch('info: field: value', {
      field: 'goodsRows',
      value: rows
    });
    //关闭弹窗
    this.dispatch('info: field: value', {
      field: 'goodsModalVisible',
      value: false
    });
  };

  /**
   * 选择商品弹框的关闭按钮
   */
  onCancelBackFun = () => {
    this.dispatch('info: field: value', {
      field: 'goodsModalVisible',
      value: false
    });
  };

  /**
   * 存储键值
   */
  fieldsValue = ({ field, value }) => {
    this.dispatch('info: field: value', {
      field,
      value
    });
  };

  /**
   * 删除选中的商品
   */
  deleteSelectedSku = (id) => {
    this.dispatch('delete: selected: sku', id);
  };

  /**
   * 提交审核
   */
  submit = async (values) => {
    const goodsRows = this.state()
      .get('goodsRows')
      .toJS();
    const goodsRowsPrice = this.state().get('goodsRowsPrice');
    let params = [];
    goodsRows.map((item, key) => {
      const param = {
        name: item.goodsInfoName,
        coverImgUrl: item.goodsInfoImg,
        priceType: goodsRowsPrice[key].priceType,
        price: goodsRowsPrice[key].price,
        price2: goodsRowsPrice[key].price2,
        goodsInfoId: item.goodsInfoId,
        storeId: item.storeId,
        url:
          'pages/package-B/goods/goods-details/index?skuId=' + item.goodsInfoId
      };
      params.push(param);
    });
    const { res: pageRes } = await webApi.submit(params);
    if (pageRes.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      history.push(`/live-room/${1}`);
    } else {
      message.error(pageRes.message);
    }
  };

  /**
   * 编辑商品价格
   */
  changePrice = (param, key) => {
    let params = this.state().get('goodsRowsPrice');
    params[key] = param;
    this.dispatch('change:goodsRowsPrice', params);
  };
}
