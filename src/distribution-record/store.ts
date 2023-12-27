import { Store, IOptions } from 'plume2';
import { message } from 'antd';
import LoadingActor from './actor/loading-actor';
import ListActor from './actor/list-actor';
import FormActor from './actor/form-actor';
import TabActor from './actor/tab-actor';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import { util, Const, QMMethod } from 'qmkit';
import ExportActor from './actor/export-actor';

export default class AppStore extends Store {
  //btn加载
  btnLoading = false;
  // 搜索条件缓存
  searchCache = {} as any;

  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [
      new LoadingActor(),
      new ListActor(),
      new FormActor(),
      new TabActor(),
      new ExportActor()
    ];
  }

  /**
   * 页面初始化
   * @param pageNum
   * @param pageSize
   */
  init = ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    this.dispatch('loading:start');
    //获取form数据
    let form = this.state()
      .get('form')
      .toJS();
    this.searchCache = form;
    const key = this.state().getIn(['tab', 'key']);

    if (key === '1') {
      form.commissionState = '1';
      form.deleteFlag = '0';
    } else if (key === '0') {
      form.commissionState = '0';
      form.deleteFlag = '0';
    } else {
      form.commissionState = '0';
      form.deleteFlag = '1';
    }

    webapi
      .fetchDistributionRecordList({ ...form, pageNum, pageSize })
      .then(({ res }) => {
        if (res.code == Const.SUCCESS_CODE) {
          this.transaction(() => {
            this.dispatch('loading:end');
            this.dispatch('list:init', res.context.distributionRecordVOPage);
            this.dispatch('list:page', fromJS({ currentPage: pageNum + 1 }));
            this.btnLoading = false;
          });
        } else {
          message.error(res.message);
          if (res.code === 'K-110001') {
            this.dispatch('loading:end');
          }
        }
      });
  };

  onTabChange = (key) => {
    this.dispatch('tab:init', key);
    this.init({ pageNum: 0, pageSize: 10 });
  };

  /**
   * 搜索
   */
  onSearch = () => {
    this.init({ pageNum: 0, pageSize: 10 });
  };

  /**
   * 选中
   */
  onSelect = (list) => {
    this.dispatch('select:init', list);
  };

  /**
   * 全选
   * @param checked
   */
  onCheckedAll = (checked: boolean) => {
    this.dispatch('list:checkedAll', checked);
  };

  /**
   * 单选
   * @param index
   * @param checked
   */
  onChecked = (index: number, checked: boolean) => {
    this.dispatch('list:check', {
      index,
      checked
    });
  };

  /**
   * 隐藏导出modal
   */
  onExportModalHide = () => {
    this.dispatch('list:export-modal:hide');
  };

  /**
   * 线上导出modal
   * @param status
   */
  onExportModalChange = (status) => {
    this.dispatch('list:export-modal:change', fromJS(status));
  };

  /**
   * 按选中的编号导出
   * @returns {Promise<T>}
   */
  onExportByIds = () => {
    const selected = this.state().get('selected');
    if (selected.isEmpty()) {
      message.error('请选择要导出的分销记录');
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
    return this._onExport({ recordIdList: selected.toJS() });
  };

  /**
   * 按搜索条件导出
   * @returns {Promise<T>}
   */
  onExportByParams = () => {
    // 搜索条件
    let params = this.searchCache;
    // tab
    // 入账状态
    const key = this.state().getIn(['tab', 'key']);
    if (key === '1') {
      params.commissionState = 'RECEIVED';
      params.deleteFlag = 'NO';
    } else if (key === '0') {
      params.commissionState = 'UNRECEIVE';
      params.deleteFlag = 'NO';
    } else {
      params.commissionState = '';
      params.deleteFlag = 'YES';
    }

    params = QMMethod.trimValueDeep(params);
    return this._onExport(params);
  };

  _onExport = (params: {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 参数加密
        let base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          let result = JSON.stringify({ ...params, token: token });
          let encrypted = base64.urlEncode(result);

          // 新窗口下载
          const exportHref = Const.HOST + `/distribution/record/export/params/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }

        resolve();
      }, 500);
    });
  };

  /**
   * 检索种类
   */
  setSearchKind = ({ kind, value }) => {
    //搜索框内容清空
    this.dispatch('distribution:record:distributionFilterValue', '');
    this.dispatch('distribution:record:searchKind', { kind, value });
  };

  /**
   * 根据分销员名称或账号联想查询
   */
  searchDistributionCustomers = async (value) => {
    if (value != undefined) {
      //根据分销员账号联想
      if (
        this.state()
          .get('distributionSearchSelect')
          .get('checked') == '0'
      ) {
        const { res } = await webapi.filterDistributionCustomer({
          customerAccount: value,
          pageNum: 0,
          pageSize: 5
        });
        if (res.code == Const.SUCCESS_CODE) {
          this.dispatch(
            'distribution:record:filterDistributionCustomer',
            res.context.distributionCustomerVOPage.content
          );
        }
      } else {
        //根据分销员名称联想
        const { res } = await webapi.filterDistributionCustomer({
          customerName: value,
          pageNum: 0,
          pageSize: 5
        });
        if (res.code == Const.SUCCESS_CODE) {
          this.dispatch(
            'distribution:record:filterDistributionCustomer',
            res.context.distributionCustomerVOPage.content
          );
        }
      }
    } else {
      this.dispatch('form:field', {
        field: 'distributorId',
        value: value
      });
    }
  };

  /**
   * 根据货品的名称和编号查询
   */
  searchGoodsInfos = async (value) => {
    if (value != undefined) {
      //根据货品编号
      if (
        this.state()
          .get('goodsInfoSearchSelect')
          .get('checked') == '0'
      ) {
        const { res } = await webapi.filterGoodsInfoData({
          likeGoodsInfoNo: value,
          pageNum: 0,
          pageSize: 5
        });
        if (res.code == Const.SUCCESS_CODE) {
          this.dispatch(
            'distribution:record:filterGoodsInfo',
            res.context.goodsInfoPage.content
          );
        }
      } else {
        //根据货品的名称
        const { res } = await webapi.filterGoodsInfoData({
          likeGoodsName: value,
          pageNum: 0,
          pageSize: 5
        });
        if (res.code == Const.SUCCESS_CODE) {
          this.dispatch(
            'distribution:record:filterGoodsInfo',
            res.context.goodsInfoPage.content
          );
        }
      }
    } else {
      this.dispatch('form:field', {
        field: 'goodsInfoId',
        value: value
      });
    }
  };

  /**
   * 根据会员的名称和账号查询
   */
  searchCustomerInfos = async (value) => {
    if (value != undefined) {
      //根据会员的账号
      if (
        this.state()
          .get('customerSearchSelect')
          .get('checked') == '0'
      ) {
        const { res } = await webapi.filterCustomerData({
          customerAccount: value,
          pageNum: 0,
          pageSize: 5
        });
        if (res.code == Const.SUCCESS_CODE) {
          this.dispatch(
            'distribution:record:filterCustomer',
            res.context.detailResponseList
          );
        }
      } else {
        //根据会员的名称
        const { res } = await webapi.filterCustomerData({
          customerName: value,
          pageNum: 0,
          pageSize: 5
        });
        if (res.code == Const.SUCCESS_CODE) {
          this.dispatch(
            'distribution:record:filterCustomer',
            res.context.detailResponseList
          );
        }
      }
    } else {
      this.dispatch('form:field', {
        field: 'customerId',
        value: value
      });
    }
  };

  /**
   * 根据选中的受邀人信息过滤出其customerId,并存放
   */
  saveCustomerInfosFilter = (value) => {
    const filterCustomerData = this.state().get('filterCustomerData');
    const customerId = filterCustomerData
      .filter((v) => v.get('value') == value)
      .get(0)
      .get('key');
    //存放最终检错所需的参数
    this.dispatch('form:field', {
      field: 'customerId',
      value: customerId
    });
  };

  /**
   * 根据选中的分销员信息过滤出其distributionId,并存放
   */
  saveDistributionCustomerFilter = (value) => {
    const filterCustomerData = this.state().get(
      'filterDistributionCustomerData'
    );
    const distributionId = filterCustomerData
      .filter((v) => v.get('value') == value)
      .get(0)
      .get('key');
    //存放最终检错所需的参数
    this.dispatch('form:field', {
      field: 'distributorId',
      value: distributionId
    });
  };

  /**
   * 根据选中的分销员信息过滤出其distributionId,并存放
   */
  saveGoodsInfoFilter = (value) => {
    const filterGoodsInfoData = this.state().get('filterGoodsInfoData');
    const goodsInfoId = filterGoodsInfoData
      .filter((v) => v.get('value') == value)
      .get(0)
      .get('key');
    //存放最终检错所需的参数
    this.dispatch('form:field', {
      field: 'goodsInfoId',
      value: goodsInfoId
    });
  };

  /**
   * 保存检索需要的参数
   */
  saveSearchParams = ({ field, value }) => {
    this.dispatch('form:field', {
      field: field,
      value: value
    });
  };
}
