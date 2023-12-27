import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS, List } from 'immutable';
import { Const } from 'qmkit';
import * as webApi from './webapi';
import InfoActor from './actor/info-actor';
import { IList } from 'typings/globalType';

export default class AppStore extends Store {
  bindActor() {
    return [new InfoActor()];
  }

  /**
   * 初始化方法
   */
  init = async (isThird) => {
    await this.queryPage();
    if (!isThird) {
      await this.goodsCompanyPage();
      await this.goodsBrands();
    }
  };

  onDelete = async (id) => {
    const { res: pageRes } = await webApi.modify({
      liveRoomId: id,
      delFlag: 1
    });
    if (pageRes.code === Const.SUCCESS_CODE) {
      await this.queryPage();
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
    param.pageNum = pageNum;
    param.pageSize = pageSize;
    const { res: pageRes } = await webApi.getPage(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('info:setLoading', false);
        // 设置分页数据
        this.dispatch('info:setPageData', pageRes.context);
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
   * 设置搜索项信息并查询分页数据
   */
  onSearch = async (searchData) => {
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
   * 关闭弹窗
   */
  closeModal = () => {
    this.dispatch('info:setVisible', false);
  };
  /**
   * 查询厂商列表
   */
  goodsCompanyPage = async () => {
    let params = {
      pageNum: 0,
      pageSize: 5000
    };
    const { res } = await webApi.goodsCompanyPages(params);
    if (res && res.code === Const.SUCCESS_CODE) {
      this.dispatch('coupon: info: field: value', {
        field: 'companyCates',
        value: res.context.goodsCompanyPage.content
      });
    }
  };
  /**
   * 查询品牌
   */
  goodsBrands = async () => {
    const { res } = await webApi.goodsBrands();
    if (res && res.code === Const.SUCCESS_CODE) {
      this.dispatch('coupon: info: field: value', {
        field: 'brandCates',
        value: res.context
      });
    }
  };

  // 选择厂商后刷新品牌列表
  onSelectCompany = (value) => {
    let companyList = this.state()
      .get('companyCates')
      .toJS();
    let selectCompanyList = [];
    companyList.map((item, index) => {
      if (item.companyId == value) {
        item.brandIds = item.brandIds.split(',');
        item.brandNames = item.brandNames.split(',');
        for (let i = 0; i < item.brandIds.length; i++) {
          selectCompanyList.push({
            brandId: Number(item.brandIds[i]),
            brandName: item.brandNames[i]
          });
          this.dispatch('coupon: info: field: value', {
            field: 'brandCates',
            value: selectCompanyList
          });
        }
      }
    });
  };
  onFormFieldChange = (key, value) => {
    this.dispatch('form: field', { key, value });
  };
  onFormBut = (keys, value) => {
    this.dispatch('form-set', { keys, value });
  };
  // 新增
  /**
   * 保存新增/编辑弹框的内容
   */
  onSave = async () => {
    let formData = this.state()
      .get('formData')
      .toJS();
    // 处理品牌
    let brandMap = {};
    if (formData.brandCateIds) {
      formData.brandCateIds.map((item, index) => {
        brandMap[item] = formData.brandCatesNames[index];
        // formData.brandCatesNames.map((item1, index1) => {

        // });
      });
    }

    let result;
    if (formData.liveRoomId) {
      // 编辑
      let oData = {
        liveRoomId: formData.liveRoomId,
        liveRoomName: formData.liveRoomName, //直播间名称
        companyId: formData.companyId, //厂商id
        brandMap: brandMap, //品牌账号
        livePhoneList: formData.livePhoneList, //直播账号
        delFlag: 0 //0为编辑，1为删除
      };
      result = await webApi.modify(oData);
    } else {
      // 新增
      let oData = {
        liveRoomName: formData.liveRoomName, //直播间名称
        companyId: formData.companyId, //厂商id
        brandMap: brandMap, //品牌账号
        livePhoneList: formData.livePhoneList //直播账号
      };
      result = await webApi.add(oData);
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
  // 编辑删除弹框
  onEdit = async (rowInfo) => {
    rowInfo.livePhoneList = [];
    rowInfo.brandCateIds = [];
    rowInfo.brandCatesNames = [];
    rowInfo.companyId = Number(rowInfo.companyId);
    this.onSelectCompany(rowInfo.companyId);
    this.transaction(() => {
      // 修改直播账号选中列表
      if (rowInfo.accountMap) {
        for (let key in rowInfo.accountMap) {
          if (rowInfo.accountMap[key]) {
            rowInfo.livePhoneList.push(rowInfo.accountMap[key]);
          }
        }
      }
      // 品牌
      if (rowInfo.brandMap) {
        for (let key in rowInfo.brandMap) {
          rowInfo.brandCateIds.push(Number(key));
          if (rowInfo.brandMap[key]) {
            rowInfo.brandCatesNames.push(rowInfo.brandMap[key]);
          } else {
            rowInfo.brandCatesNames.push('');
          }
        }
      }
      this.dispatch('info:setFormData', fromJS(rowInfo));
      this.dispatch('info:setVisible', true);
    });
  };
}
