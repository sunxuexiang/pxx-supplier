import { Actor, Action, IMap } from 'plume2';

export default class EditActor extends Actor {
  defaultState() {
    return {
      edit: false,
      editForm: {}
    };
  }

  @Action('authority:edit')
  edit(state: IMap, edit) {
    return state.set('edit', edit);
  }

  @Action('authority:editForm')
  editForm(state: IMap, editForm) {
    return state.set('editForm', editForm);
  }
}
