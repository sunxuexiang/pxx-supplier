import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import { message } from 'antd';
import moment from 'moment';
import ListActor from './actor/list-actor';
import LoadingActor from './actor/loading-actor';
import FormActor from './actor/form-actor';
import { Const } from 'qmkit';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new ListActor(), new LoadingActor(), new FormActor()];
  }

  init = async (
    { pageNum, pageSize } = {
      pageNum: 0,
      pageSize: this.state().get('pageSize') || 10
    }
  ) => {
    this.dispatch('loading:start');
    const query = this.state()
      .get('form')
      .toJS();
    const { res } = await webapi.fetchList({ ...query, pageNum, pageSize });

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
        //设置活动状态
        let pauseFlag;
        const startTime = moment(el.startTime);
        const endTime = moment(el.endTime);
        const now = moment();
        if (el.terminationFlag === 1) {
          pauseFlag = 4;
        } else if (endTime.isBefore(now)) {
          pauseFlag = 3;
        } else if (startTime.isAfter(now)) {
          pauseFlag = 1;
        } else if (now.isBetween(startTime, endTime)) {
          pauseFlag = 2;
        }
        el.pauseFlag = pauseFlag;
      });

      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('listActor:init', res.context);
        this.dispatch('list:currentPage', {
          pageNum: pageNum && pageNum + 1,
          pageSize: pageSize
        });
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
    let pageSize = this.state().get('pageSize');
    this.init({ pageNum: pageNum ? Number(pageNum) : 0, pageSize });
    sessionStorage.removeItem('pageNum');
  };

  onFormChange = ({ field, value }) => {
    this.dispatch('form:field', { field, value });
  };

  onSearch = () => {
    this.init();
  };

  onDelete = async (activityId) => {
    const { res } = await webapi.deleteMarketing(activityId);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
    this.init();
  };

  onTermination = async (activityId) => {
    const { res } = await webapi.onTermination(activityId);
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

    const searchParams = this.state()
      .get('form')
      .toJS();

    return this._onExport({
      activityIds: checkedIds,
      queryTab: searchParams.queryTab
    });
  };

  /**
   * 按搜索条件进行导出
   */
  onExportByParams = () => {
    // 搜索条件
    const searchParams = this.state()
      .get('form')
      .toJS();
    return this._onExport(searchParams);
  };

  /**
   * 导出具体实现(私有的公共方法)
   */
  _onExport = (params: {}) => {
    return new Promise<void>(async (resolve) => {
      let res = await webapi.exportDetail(params);
      if (res.size) {
        let blob = new Blob([res], { type: res.type });
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', '返鲸币活动明细.xlsx');
        document.body.appendChild(link);
        link.click(); // 点击
        resolve();
      } else {
        resolve();
      }
    });
  };
}
