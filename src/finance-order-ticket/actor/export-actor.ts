import { Actor, Action, IMap } from 'plume2';

export default class ExportActor extends Actor {
  defaultState() {
    return {
      exportModalData: {}
    };
  }

  @Action('ticket:hide-export')
  exportHide(state: IMap) {
    return state.setIn(['exportModalData', 'visible'], false);
  }

  @Action('ticket:export-modal:change')
  exportModalChange(state: IMap, modalStatus: IMap) {
    return state
      .setIn(['exportModalData', 'visible'], modalStatus.get('visible'))
      .setIn(
        ['exportModalData', 'exportByParams'],
        modalStatus.get('exportByParams')
      )
      .setIn(
        ['exportModalData', 'byParamsTitle'],
        modalStatus.get('byParamsTitle')
      )
      .setIn(['exportModalData', 'byIdsTitle'], modalStatus.get('byIdsTitle'))
      .setIn(
        ['exportModalData', 'exportByIds'],
        modalStatus.get('exportByIds')
      );
  }
}
