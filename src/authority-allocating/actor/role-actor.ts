import { Actor, Action, IMap } from 'plume2';

export default class RoleActor extends Actor {
  defaultState() {
    return {
      roleName: '',
      roleCount: 0,
      selectedRoleId: null
    };
  }

  @Action('authority:roles')
  roles(state: IMap, roleName) {
    return state.set('roleName', roleName);
  }

  @Action('authority:selectedRole')
  selectedRole(state: IMap, id: number) {
    return state.set('selectedRoleId', id);
  }
}
