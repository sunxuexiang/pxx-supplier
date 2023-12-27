import { Store, Action, IMap } from 'plume2';
import { message } from 'antd';
import { fromJS, List } from 'immutable';
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
  init = async () => {
    await this.queryPage();
    // 加载分类数据
    await webApi.getCateList().then((res) => {
      this.dispatch(
        'goodsActor: initCateList',
        fromJS((res as any).res.context)
      );
    });
    await this.fetchCouponCate();
  };

  onDelete = async (biddingId) => {
    const { res: pageRes } = await webApi.deleteById(biddingId);
    if (pageRes.code === Const.SUCCESS_CODE) {
      this.queryPage();
    } else {
      message.error(pageRes.message);
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
    console.log(param);
    param.pageNum = pageNum;
    param.pageSize = pageSize;
    const { res: pageRes } = await webApi.getPage(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('info:setLoading', false);
        // 设置分页数据
        this.dispatch('info:setPageData', pageRes.context.goodsCompanyPage);
        // 设置当前页码
        this.dispatch('info:setCurrent', pageNum + 1);
        // 清空勾选信息
        this.dispatch('info:setCheckedData', List());
      });
    } else {
      message.error(pageRes.message);
      this.dispatch('info:setLoading', false);
    }
  };
  /**
   * 查询品牌分类
   */
  fetchCouponCate = async () => {
    const res = await webApi.goodsBrands();
    const { code, context } = res.res as any;
    if (code === Const.SUCCESS_CODE) {
      this.dispatch('coupon: info: field: value', {
        field: 'couponCates',
        value: context
      });
    }
  };

  /**
   * 设置搜索项信息并查询分页数据
   */
  onSearch = async (searchData) => {
    let searchDataParamTm = this.state().get('searchData');
    await this.queryPage();
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
  onEdit = async (rowInfo) => {
    console.log(rowInfo);
    this.transaction(() => {
      // fromJS({...editData.toJS(),couponCateIds : editData.toJS().brandIds.split(',')})
      rowInfo.couponCateIds = (rowInfo.brandIds
        ? rowInfo.brandIds.split(',')
        : []
      ).map((item) => Number(item));
      this.dispatch('info:setFormData', fromJS(rowInfo));
      this.dispatch('info:setVisible', true);
    });
  };
  /**
   * 关闭弹窗
   */
  closeModal = () => {
    this.dispatch('info:setVisible', false);
  };
  onFormFieldChange = (key, value) => {
    this.dispatch('form: field', { key, value });
  };

  onFormBut = (keys, value) => {
    this.dispatch('form-set', { keys, value });
  };
  /**
   * 存储键值
   */
  fieldsValue = ({ field, value }) => {
    this.dispatch('coupon: info: field: value', {
      field,
      value
    });
  };

  // 启用/禁用
  onVisible = async (companyId, status) => {
    const { res: pageRes } = await webApi.setGoodsCompany({
      status: status == 0 ? 1 : 0,
      companyId
    });
    if (pageRes.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.queryPage();
    } else {
      message.error(pageRes.message);
    }
  };

  /**
   * 保存新增/编辑弹框的内容
   */
  onSave = async () => {
    const formData = this.state()
      .get('formData')
      .toJS();
    console.log(formData.couponCateNames);
    let result;
    if (formData.companyId) {
      let oData = {
        companyName: formData.companyName,
        contactAddress: formData.contactAddress,
        contactPhone: formData.contactPhone,
        brandIds: formData.couponCateIds
          ? formData.couponCateIds.join(',')
          : '',
        brandNames: formData.couponCateNames
          ? formData.couponCateNames.join(',')
          : '',
        companyId: formData.companyId
      };
      result = await webApi.editGoodsCompany(oData);
    } else {
      let oData = {
        companyName: formData.companyName,
        contactAddress: formData.contactAddress,
        contactPhone: formData.contactPhone,
        brandIds: formData.couponCateIds
          ? formData.couponCateIds.join(',')
          : '',
        brandNames: formData.couponCateNames
          ? formData.couponCateNames.join(',')
          : ''
      };
      result = await webApi.addGoodsCompany(oData);
    }
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.closeModal();
      this.dispatch('info:setFormData', fromJS({}));
      await this.queryPage();
    } else {
      message.error(result.res.message);
    }
  };
}
