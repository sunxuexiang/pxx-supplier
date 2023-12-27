import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class DownloadReportActor extends Actor {
  //数据源
  defaultState() {
    return {
      reportPage: {}
    };
  }

  constructor() {
    super();
  }

  @Action('downloadReport:getReportList')
  init(state: IMap, content) {
    return state.set('reportPage', fromJS(content));
  }
}
