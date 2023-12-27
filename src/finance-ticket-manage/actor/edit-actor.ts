import { Actor, Action, IMap } from 'plume2';

export default class EditActor extends Actor {
  defaultState() {
    return {
      projectForm: {
        projectName: ''
      },
      edit: false
    };
  }

  @Action('edit:init')
  init(state: IMap, project) {
    return state.mergeIn(['projectForm'], project);
  }

  @Action('edit')
  edit(state: IMap, isEdit) {
    return state.set('edit', isEdit);
  }
}
