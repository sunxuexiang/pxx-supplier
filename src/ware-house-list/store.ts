import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS, List } from 'immutable';
import { Const, util, FindArea } from 'qmkit';
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
  };

  /**
   * 查询分页数据
   */
  queryPage = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    // 设置loading开始状态
    this.dispatch('info:setLoading', true);
    const param = this.state().get('searchData').toJS();
    param.pageNum = pageNum;
    param.pageSize = pageSize;
    param.defaultFlag = 0;
    const { res: pageRes } = await webApi.getPage(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      //.log(pageRes.context.wareHouseVOPage.content);
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('info:setLoading', false);
        // 设置分页数据
        this.dispatch('info:setPageData', pageRes.context.wareHouseVOPage);
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
    const { res: delRes } = await webApi.deleteById({ wareId: id });
    if (delRes.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      await this.queryPage();
    } else {
      message.error(delRes.message);
    }
  };

  /**
   * 设为默认
   */
  onDefault = async (id) => {
    const { res: delRes } = await webApi.onDefault({ wareId: id });
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
   * 打开添加弹窗
   */
  onAdd = async (id) => {
    // const { res } = (await webApi.fetchSelectedAreaIds()) as any;
    // if (res.code == Const.SUCCESS_CODE) {
    //   this.dispatch('info:editFormData', {
    //     key: 'selectedAreas',
    //     value: fromJS(res.context)
    //   });
    // }
    // this.dispatch('info:setVisible', true);
  };

  /**
   * 根据仓库类型 返回被选中的仓库
   */
  onSelectd = async (type) => {
    const { res } = (await webApi.fetchSelectedAreaIds({
      wareHouseType: type
    })) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('info:editFormData', {
        key: 'selectedAreas',
        value: fromJS(res.context)
      });
    }
    // this.dispatch('info:setVisible', true);
  };

  /**
   * 打开编辑弹框
   */
  onEdit = async (id, wareHouseType) => {
    const { res } = await webApi.getById(id);
    // 在请求参数得时候已经有参数无需重复覆盖
    // await this.onSelectd(wareHouseType)
    this.transaction(() => {
      this.dispatch('info:setFormData', fromJS(res.context.wareHouseVO));
      this.dispatch('info:editFormData', {
        key: 'area',
        value: fromJS([
          res.context.wareHouseVO.provinceId,
          res.context.wareHouseVO.cityId,
          res.context.wareHouseVO.areaId
        ])
      });
      this.dispatch('info:editFormData', {
        key: 'destinationArea',
        value: fromJS(res.context.wareHouseVO.destinationArea.split(','))
      });
      this.dispatch('info:editFormData', {
        key: 'destinationAreaName',
        value: fromJS(res.context.wareHouseVO.destinationAreaName.split(','))
      });

      this.dispatch('info:setVisible', true);
    });
  };

  /**
   * 修改新增/编辑的表单信息
   */
  editFormData = (data) => {
    if (data.key === 'area') {
      this.dispatch('info:editFormData', {
        key: 'provinceId',
        value: data.value[0] || ''
      });
      this.dispatch('info:editFormData', {
        key: 'cityId',
        value: data.value[1] || ''
      });
      this.dispatch('info:editFormData', {
        key: 'areaId',
        value: data.value[2] || ''
      });
    } else {
      this.dispatch('info:editFormData', data);
    }
  };

  /**
   * 修改新增/编辑的表单信息
   */
  editFormDataWareHouseType = (data) => {
    this.dispatch('info:editFormData', {
      key: 'pickUpFlag',
      value: data
    });
    // const formData = this.state().get('formData');
    // console.log(JSON.stringify(formData))
  };

  /**
   * 关闭弹窗
   */
  closeModal = () => {
    this.dispatch('info:setFormData', fromJS({}));
    this.dispatch('info:setVisible', false);
  };

  /**
   * 保存新增/编辑弹框的内容
   */
  onSave = async () => {
    const formData = this.state().get('formData');
    // let arrArea = formData.get('destinationArea');
    // let arrcity =  FindArea.provinceCodeVOCityCode(arrArea);
    // // formData.set('destinationArea',fromJS(arrcity));
    // formData.set('destinationArea', arrcity)
    // this.dispatch('info:editFormData',{
    //   key: 'destinationArea',
    //   value: arrcity
    // })
    // const formData2 = this.state().get('formData');
    // console.log(JSON.stringify(arrcity))
    // // debugger
    // console.log(JSON.stringify(formData))
    // console.log(JSON.stringify(formData2))
    let result;
    if (formData.get('wareId')) {
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
    const checkedIds = this.state().get('checkedIds').toJS();

    if (checkedIds.length === 0) {
      message.warning('请勾选需要操作的信息');
      return new Promise((resolve) => setTimeout(resolve, 500));
    }

    return this._onExport({ wareIdList: checkedIds });
  };

  /**
   * 按搜索条件进行导出
   */
  onExportByParams = () => {
    // 搜索条件
    const searchParams = this.state().get('searchData').toJS();
    return this._onExport(searchParams);
  };

  /**
   * 导出具体实现(私有的公共方法)
   */
  _onExport = (params: {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const base64 = new util.Base64();
        const token = window.token;
        if (token) {
          // 参数加密
          let result = JSON.stringify({ ...params, token: token });
          let encrypted = base64.urlEncode(result);
          const exportHref = Const.HOST + `/warehouse/export/${encrypted}`;
          // 新窗口下载
          window.open(exportHref);
        } else {
          message.error('请登录后重试');
        }
        resolve();
      }, 500);
    });
  };

  onBatchDelete = () => {};
}
