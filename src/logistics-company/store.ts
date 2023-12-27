import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS, List } from 'immutable';
import { Const, util, cache } from 'qmkit';
import * as webapi from './webapi';
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
  };

  setUrlTypeChange = (val) => {
    this.dispatch('setUrlType: change', val);
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
    const { res: pageRes } = await webapi.getPage(
      param,
      this.state().get('urlType')
    );
    if (pageRes.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('info:setLoading', false);
        // 设置分页数据
        this.dispatch(
          'info:setPageData',
          pageRes.context.logisticsCompanyVOPage
        );
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
    this.dispatch('info:setSearchData', fromJS(searchData));
    await this.queryPage();
  };

  /**
   * 单个删除
   */
  onDelete = async (id) => {
    const { res: delRes } = await webapi.deleteById(
      id,
      this.state().get('urlType')
    );
    if (delRes.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      await this.queryPage();
    } else {
      message.error(delRes.message);
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
    const { res: delRes } = await webapi.deleteByIdList(
      checkedIds.toJS(),
      this.state().get('urlType')
    );
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
      result = await webapi.modify(formData, this.state().get('urlType'));
    } else {
      result = await webapi.add(formData, this.state().get('urlType'));
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
   * 打开导出弹框
   */
  onExportModalShow = (exportModalData) => {
    this.dispatch(
      'info:exportModalShow',
      fromJS({
        ...exportModalData,
        visible: true,
        exportByParams: this.onExportByParams,
        exportByIds: this.onExportByIds
      })
    );
  };

  /**
   * 关闭导出弹框
   */
  onExportModalHide = () => {
    this.dispatch('info:exportModalHide');
  };

  /**
   * 按勾选的信息进行导出
   */
  onExportByIds = () => {
    const checkedIds = this.state()
      .get('checkedIds')
      .toJS();

    if (checkedIds.length === 0) {
      message.warning('请勾选需要操作的信息');
      return new Promise((resolve) => setTimeout(resolve, 500));
    }

    return this._onExport({ idList: checkedIds });
  };

  /**
   * 按搜索条件进行导出
   */
  onExportByParams = () => {
    // 搜索条件
    const searchParams = this.state()
      .get('searchData')
      .toJS();
    return this._onExport(searchParams);
  };

  /**
   * 导出具体实现(私有的公共方法)
   */
  _onExport = (params: {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const base64 = new util.Base64();
        // @ts-ignore
        const token = window.token;
        if (token) {
          // 参数加密
          let result = JSON.stringify({ ...params, token: token });
          let encrypted = base64.urlEncode(result);
          const exportHref =
            Const.HOST + `/logisticscompany/export/${encrypted}`;
          // 新窗口下载
          window.open(exportHref);
        } else {
          message.error('请登录后重试');
        }
        // @ts-ignore
        resolve();
      }, 500);
    });
  };

  // 规则配置信息初始化
  ruleInit = async () => {
    const { res } = await webapi.fetchRuleInfo(this.state().get('urlType'));
    if (res && res.code === Const.SUCCESS_CODE) {
      const warePage = JSON.parse(localStorage.getItem('warePage'));
      let tabList = [];
      warePage.forEach((item) => {
        res.context.forEach((cd) => {
          if (item.wareId === cd.wareId) {
            tabList.push(cd);
          }
        });
      });
      if (tabList.length > 0) {
        const currentRultTab = tabList[0].wareId;
        this.transaction(() => {
          this.dispatch('currentRultTab: change', currentRultTab);
          this.dispatch('ruleTabList: change', fromJS(tabList));
        });
      }
    } else {
      message.error(res.message || '');
    }
  };

  //规则tab切换
  currentTabChange = (key) => {
    this.dispatch('currentRultTab: change', Number(key));
  };

  //规则信息保存
  saveRule = async (params) => {
    const { res } = await webapi.saveRuleInfo(params);
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('保存成功');
    } else {
      message.error(res.message || '');
    }
  };

  // 打开同步弹窗 (同步规则配置)
  openSyncRule = () => {
    this.transaction(() => {
      this.dispatch('info:update', { key: 'syncType', value: 1 });
      this.dispatch('info:update', { key: 'syncVisible', value: true });
    });
  };

  // 打开同步弹窗 (同步规则物流公司)
  openSyncCompany = () => {
    this.transaction(() => {
      this.dispatch('info:update', { key: 'syncType', value: 2 });
      this.dispatch('info:update', { key: 'syncVisible', value: true });
    });
  };

  // 关闭同步弹窗
  closeSyncModal = () => {
    this.dispatch('info:update', { key: 'syncVisible', value: false });
  };

  // 获取自营商家数据
  getSelfManage = async () => {
    const { res } = await webapi.fetchSelfManage();
    if (res && res.code === Const.SUCCESS_CODE) {
      let list = res.context || [];
      // 排除 喜吖吖自营 商家自己
      list = list.filter((item) => item.storeId !== 123457929);
      this.dispatch('info:setStoreList', fromJS(list));
    } else {
      message.error(res.message || '');
    }
  };

  // 同步设置保存
  onSyncSave = async (values) => {
    const syncType = this.state().get('syncType');
    const currentRultTab = this.state().get('currentRultTab');
    const sourceStoreId = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA))
      .storeId;
    if (syncType === 1) {
      const params = {
        sourceStoreId,
        targetStoreIdList: values.storeIds || [],
        destinationType: 2,
        wareId: currentRultTab
      };
      const { res } = await webapi.syncRuleInfo(params);
      if (res && res.code === Const.SUCCESS_CODE) {
        message.success('同步成功');
        this.closeSyncModal();
      } else {
        message.error(res.message || '');
      }
    } else {
      const checkedIds = this.state()
        .get('checkedIds')
        .toJS();
      if (values.exportType !== '1' && checkedIds.length === 0) {
        message.error('请至少选中一个物流公司');
        return;
      }
      const params = {
        sourceStoreId,
        targetStoreIdList: values.storeIds || [],
        delFlag: values.exportType === '3' ? 1 : 0
      } as any;
      if (values.exportType !== '1') {
        params.idList = checkedIds;
      }
      this.dispatch('info:setLoading', true);
      const { res } = await webapi.syncCompanyInfo(
        params,
        this.state().get('urlType')
      );
      this.dispatch('info:setLoading', false);
      if (res && res.code === Const.SUCCESS_CODE) {
        message.success('同步成功');
        this.closeSyncModal();
        // 同步删除选中的物流公司后 刷新列表
        if (values.exportType === '3') {
          this.queryPage();
        }
      } else {
        message.error(res.message || '');
      }
    }
  };
}
