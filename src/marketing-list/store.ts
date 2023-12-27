import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import { message } from 'antd';
import ListActor from './actor/list-actor';
import LoadingActor from './actor/loading-actor';
import FormActor from './actor/form-actor';
import CustomerLevelActor from './actor/customer-level-actor';
import { Const, util } from 'qmkit';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [
      new ListActor(),
      new LoadingActor(),
      new FormActor(),
      new CustomerLevelActor()
    ];
  }

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: this.state().get('pageSize')||10 }) => {
    console.log(pageNum, 'pageNumpageNumpageNumpageNumpageNum');

    this.dispatch('loading:start');
    const query = this.state().get('form').toJS();
    if (query.marketingSubType === '-1') {
      query.marketingSubType = null;
    }

    const { res } = await webapi.fetchList({ ...query, pageNum, pageSize });
    let levelList = [];
    if (util.isThirdStore()) {
      const levRes = await webapi.getUserLevelList();
      if (levRes.res.code != Const.SUCCESS_CODE) {
        message.error(levRes.res.message);
        return;
      }
      levelList = levRes.res.context.storeLevelVOList;
      // 店铺等级转成平台等级格式,方便后面的业务逻辑公用
      levelList.forEach((level) => {
        level.customerLevelId = level.storeLevelId;
        level.customerLevelName = level.levelName;
      });
    }

    if (res.code === Const.SUCCESS_CODE) {
      const wareHouseVOPage =
        JSON.parse(localStorage.getItem('wareHouseVOPage')) || [];
      res.context.content.forEach((el) => {
        wareHouseVOPage.forEach((ware) => {
          if (el.wareId == ware.wareId) {
            el.wareName = ware.wareName;
          } else {
            return;
          }
        });
      });

      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('listActor:init', res.context);
        this.dispatch('list:currentPage', {pageNum:pageNum && pageNum + 1,pageSize:pageSize});
        this.dispatch('customerLevel:init', fromJS(levelList));
        this.dispatch('select:init', []);
      });
    } else {
      this.dispatch('loading:end');
      message.error(res.message);
    }
  };

  //tab-list 切换
  onTabChange = (index: number) => {
    this.dispatch('form:field', { field: 'queryTab', value: index });
    const pageNum = sessionStorage.getItem('pageNum');
    let pageSize=this.state().get('pageSize');
    this.init({ pageNum: pageNum ? Number(pageNum) : 0, pageSize });
    sessionStorage.removeItem('pageNum');
  };

  onFormChange = ({ field, value }) => {
    //如果是省市区级联
    if (field == 'area') {
      this.transaction(() => {
        ['provinceId', 'cityId', 'areaId'].forEach((v, index) => {
          this.dispatch('form:field', {
            field: v,
            value: value[index]
          });
        });
      });
      return;
    }
    this.dispatch('form:field', { field, value });
  };

  onSearch = () => {
    this.init();
  };

  onDelete = async (marketingId) => {
    const { res } = await webapi.deleteMarketing(marketingId);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
    this.init();
  };

  onPause = async (marketingId) => {
    const { res } = await webapi.pause(marketingId);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
    this.init();
  };

  onStart = async (marketingId) => {
    const { res } = await webapi.start(marketingId);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
    this.init();
  };

  onTermination = async (marketingId) => {
    const { res } = await webapi.onTermination(marketingId);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
    this.init();
  };


   /**
   * 设置勾选的多个id
   */
    onSelect = (checkedIds) => {
      this.dispatch('info:setCheckedData', fromJS(checkedIds));
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

    return this._onExport({ marketingIds: checkedIds });
  };

  /**
   * 按搜索条件进行导出
   */
  onExportByParams = () => {
    // 搜索条件
    const searchParams = this.state()
      .get('form')
      .toJS();
      if (searchParams.marketingSubType === '-1') {
        searchParams.marketingSubType = null;
      }
    return this._onExport(searchParams);
  };

  /**
   * 导出具体实现(私有的公共方法)
   */
  _onExport = (params: {}) => {
    return new Promise(async(resolve) => {
      let res=await webapi.exportMarketing(params);
        if(res.size){
          let blob = new Blob([res], {type: res.type});
          const link = document.createElement('a');
            link.style.display = 'none';
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', `促销活动明细.xlsx`);
            document.body.appendChild(link);
            link.click(); // 点击
            resolve();
            // setTimeout(() => {
              
            // }, 500);
        }else{
          resolve();
        }
      // setTimeout(() => {
        // const base64 = new util.Base64();
        // const token = window.token;
        // if (token) {
        //   // 参数加密
        //   let result = JSON.stringify({ ...params, token: token });
        //   let encrypted = base64.urlEncode(result);
        //   const exportHref = Const.HOST + `/stockoutmanage/export/${encrypted}`;
        //   // 新窗口下载
        //   window.open(exportHref);
        // } else {
        //   message.error('请登录后重试');
        // }
        // resolve();
      // }, 500);
    });
  };

}
