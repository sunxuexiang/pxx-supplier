import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS, List } from 'immutable';
import { Const, util, cache } from 'qmkit';
import * as webApi from './webapi';
import InfoActor from './actor/info-actor';

export default class AppStore extends Store {
  bindActor() {
    return [new InfoActor()];
  }

  /**
   * 初始化方法
   */
  init = async (currentTab) => {
    this.dispatch('liveTab:change', currentTab);
    await Promise.all([
      this.getlivecompanyById(), //查直播是否开通
      this.queryPage(), //分页查直播列表
      this.queryLiveGoodsPage() //分页查直播商品库
    ]);
  };

  /**
   * 查直播是否开通
   */
  getlivecompanyById = async () => {
    //查缓存
    const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    const { res: pageRes } = await webApi.getlivecompanyById(loginInfo.storeId);
    if (pageRes.code === Const.SUCCESS_CODE) {
      let status = '未开通';
      switch (pageRes.context.liveCompanyVO.liveBroadcastStatus) {
        case 1:
          status = '待审核';
          break;
        case 2:
          status = '已开通';
          break;
        case 3:
          status = '审核未通过';
          break;
        case 4:
          status = '禁用中';
          break;
        default:
          status = '未开通';
          break;
      }
      this.dispatch('change:openStatus', status); //修改状态

      //修改原因
      if (pageRes.context.liveCompanyVO.auditReason) {
        this.dispatch(
          'change:cause',
          pageRes.context.liveCompanyVO.auditReason
        );
      }
    } else {
      message.error(pageRes.message);
    }
  };

  /**
   * 申请开通
   */
  addliveCompany = async () => {
    //查缓存
    const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    const param = {
      storeId: loginInfo.storeId,
      companyInfoId: loginInfo.companyInfoId
    };
    const { res: pageRes } = await webApi.livecompanyAdd(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      message.success('申请成功');

      //申请成功重新查一遍状态应改为待审核状态
      this.getlivecompanyById();
    } else {
      message.error(pageRes.message);
    }
  };

  /**
   * 查询直播列表分页数据
   */
  queryPage = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    // 设置loading开始状态
    this.dispatch('info:setLoading', true);
    const liveListStatus = this.state().get('currentLiveListTab'); //根据状态查tab
    const param = this.state()
      .get('searchData')
      .toJS();
    param.pageNum = pageNum;
    param.pageSize = pageSize;

    //全部时不传
    if (liveListStatus != -1) {
      param.liveStatus = liveListStatus;
    }

    const { res: pageRes } = await webApi.getPage(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('info:setLoading', false);
        // 设置分页数据
        this.dispatch('info:setPageData', pageRes.context.liveRoomVOPage);
        // 设置当前页码
        this.dispatch('info:setCurrent', pageNum + 1);
        // 清空勾选信息
        this.dispatch('info:setCheckedData', List());
        // 设置直播间商品数据
        this.dispatch(
          'info:setliveListGoodsDataList',
          pageRes.context.liveGoodsList
        );
      });
    } else {
      message.error(pageRes.message);
      this.dispatch('info:setLoading', false);
    }
  };

  /**
   * 查询直播商品分页数据
   */
  queryLiveGoodsPage = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }
  ) => {
    // 设置loading开始状态
    this.dispatch('info:setLiveGoodsLoading', true);
    const liveGoodsStatus = this.state().get('currentLiveGoodsTab'); //根据状态查tab
    const param = this.state()
      .get('liveGoodsSearchData')
      .toJS();
    param.pageNum = pageNum;
    param.pageSize = pageSize;
    param.auditStatus = liveGoodsStatus;
    const { res: pageRes } = await webApi.getLiveGoodsPage(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('info:setLiveGoodsLoading', false);
        // 设置分页数据
        this.dispatch(
          'info:setLiveGoodsPageData',
          pageRes.context.liveGoodsVOPage
        );
        this.dispatch('info:setGoodsInfoList', pageRes.context.goodsInfoList);
        // 设置当前页码
        this.dispatch('info:setLiveGoodsCurrent', pageNum + 1);
      });
    } else {
      message.error(pageRes.message);
      this.dispatch('info:setLiveGoodsLoading', false);
    }
  };

  /**
   * 设置搜索项信息并查询分页数据
   */
  onSearchLiveGoods = async (searchData) => {
    this.dispatch('info:setLiveGoodsSearchData', fromJS(searchData));
    await this.queryLiveGoodsPage();
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
   * 切换直播列表tab
   */
  onLiveListTabChange = (index) => {
    this.dispatch('liveListTab:change', index);
    this.queryPage();
  };
  onLiveGoodsTabChange = (index) => {
    this.dispatch('liveGoodsTab:change', index);
    this.queryLiveGoodsPage();
  };
  changeCurrentTab = (index) => {
    this.dispatch('liveTab:change', index);
    if (index == '1') {
      this.queryLiveGoodsPage();
    } else {
      this.queryPage();
    }
  };

  /**
   * 点击完成，保存用户选择的商品信息
   * @param skuIds
   * @param rows
   */
  onOkBackFun = async (skuIds, rows) => {
    if(skuIds.length<1){
      message.error('请勾选商品!');
      return;
    }
    const roomId = this.state().get('roomId'); //取要添加商品的房间号
    const disabledSkuIds = this.state()
      .get('disabledSkuIds')
      .toJS(); //取已经选择过的商品

    //只添加新选中的商品
    for (let i = 0; i < skuIds.length; i++) {
      if (disabledSkuIds.find((id) => id == skuIds[i])) {
        skuIds.splice(i, 1);
        i--;
      }
    }
    if(skuIds.length<1){
      this.fieldsValue({
        field: 'goodsModalVisible',
        value: false
      });
      return;
    }

    const params = {
      roomId: roomId,
      goodsIdList: skuIds
    };
    console.log('0000')
    const { res: pageRes } = await webApi.liveListGoodsAdd(params);
    if (pageRes.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.fieldsValue({
        field: 'goodsModalVisible',
        value: false
      });
      this.queryPage();
    } else {
      message.error(pageRes.message);
    }
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
   * 选择商品弹框的关闭按钮
   */
  onCancelBackFun = () => {
    this.dispatch('info: field: value', {
      field: 'goodsModalVisible',
      value: false
    });
  };

  /**
   * 删除
   */
  onDelete = async (goodsId, id) => {
    const params = {
      goodsId: goodsId,
      id: id
    };
    const { res } = await webApi.deleteLiveGoods(params);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功!');
      this.queryLiveGoodsPage();
    } else {
      message.error(res.message);
    }
  };

  onFormFieldChange = (key, value) => {
    this.dispatch('form: field', { key, value });
  };
}
