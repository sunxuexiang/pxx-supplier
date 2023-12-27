import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS } from 'immutable';
import { Const } from 'qmkit';
import * as webApi from './webapi';
import InfoActor from './actor/info-actor';

export default class AppStore extends Store {
  bindActor() {
    return [new InfoActor()];
  }

  /**
   * 初始化方法
   */
  init = async ({ activityDate, activityTime }) => {
    this.dispatch('info: setActivityDate', activityDate);
    this.dispatch('info: setActivityTime', activityTime);
    await this.queryPage();
    // 秒杀商品分类查询
    const { res } = (await webApi.getCateList()) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('cate: init', fromJS(res.context.flashSaleCateVOList));
    } else {
      message.error(message);
    }
  };

  /**
   * 查询分页数据
   */
  queryPage = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    // 设置loading开始状态
    this.dispatch('info:setLoading', true);
    const param = this.state()
      .get('searchData')
      .toJS();
    const activityDate = this.state().get('activityDate');
    const activityTime = this.state().get('activityTime');
    param.pageNum = pageNum;
    param.pageSize = pageSize;
    param.activityDate = activityDate;
    param.activityTime = activityTime;
    const { res: pageRes } = await webApi.getPage(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('info:setLoading', false);
        // 设置分页数据
        this.dispatch('info:setPageData', pageRes.context.flashSaleGoodsVOPage);
        // 设置当前页码
        this.dispatch('info:setCurrent', pageNum + 1);
      });
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
    } else {
      message.error(delRes.message);
    }
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
   * 编辑弹框的内容
   */
  onSave = async () => {
    const formData = this.state().get('formData');
    const activityDate = this.state().get('activityDate');
    const activityTime = this.state().get('activityTime');
    let result;
    result = await webApi.modify(formData);
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.closeModal();
      this.dispatch('info:setFormData', fromJS({}));
      await this.init({ activityDate, activityTime });
    } else {
      message.error(result.res.message);
    }
  };
}
