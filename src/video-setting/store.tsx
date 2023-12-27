import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import { message } from 'antd';
import { Const, util, QMMethod } from 'qmkit';
import { fromJS } from 'immutable';
import VideoSettingActor from './actor/video-setting';

export default class AppStore extends Store {
  // 搜索条件缓存
  searchCache = {} as any;

  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new VideoSettingActor()];
  }

  onSearch = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const params = this.state().get('form').toJS();
    let state = params.state == 'all' ? null : params.state;
    const { res } = await webapi.getpage({
      ...params,
      pageSize,
      pageNum,
      state
    });
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('home:setting', res.context.videoManagementVOPage.content);
      this.dispatch(
        'company: init: supplier',
        res.context.videoManagementVOPage
      );
      this.dispatch('company: currentPage', pageNum && pageNum + 1);
    } else {
      message.error(res.message);
    }
  };

  delvideo = async (id) => {
    const { res } = await webapi.delvideo(id);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('删除成功');
      this.onSearch();
    } else {
      message.error(res.message);
    }
  };
  updateStateById = async (param) => {
    const pageNum = this.state().get('pageNum');
    const para = {
      pageNum: pageNum == 0 ? 0 : pageNum - 1,
      pageSize: 10
    };
    const { res } = await webapi.updateStateById(param);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('设置成功');
      this.onSearch(para);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 设置form参数
   */
  setField = ({ field, value }) => {
    this.dispatch('company: form: field', { field, value });
  };
}
