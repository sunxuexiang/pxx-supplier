import { IOptions, Store } from 'plume2';
import { message } from 'antd';
import { Const } from 'qmkit';
import * as webapi from './webapi';
import DownloadReportActor from './actor/download-report';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new DownloadReportActor()];
  }

  init = async () => {
    this.getDownloadReportByPage(1, 10);
  };

  /**
   * 获取导出报表分页列表
   *
   * @param pageNum
   * @param pageSize
   * @returns {Promise<void>}
   */
  getDownloadReportByPage = async (pageNum, pageSize) => {
    const { res } = await webapi.getDownloadReportByPage(pageNum, pageSize);
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('downloadReport:getReportList', res.context);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 删除报表
   * @param reportId
   * @returns {Promise<void>}
   */
  deleteDownloadReport = async (reportId) => {
    const { res } = await webapi.deleteDownloadReport(reportId);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功！');
      this.init();
    } else {
      message.error(res.message);
    }
  };
}
