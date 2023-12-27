import React from 'react';
import { Relax } from 'plume2';
import { Form } from 'antd';
import { noop } from 'qmkit';

// import { List } from 'immutable';
// import EditRoleModal from './edit-role-modal';

// const Option = Select.Option;

const FormItem = Form.Item;

@Relax
export default class RoleInfo extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      roleName: string;
      onSelectRole: Function;
      onCreate: Function;
      onEditRole: Function;
      selectedRoleId: string;
      roleCount: number;
    };
  };

  static relaxProps = {
    roleName: 'roleName',
    onSelectRole: noop,
    onCreate: noop,
    onEditRole: noop,
    selectedRoleId: 'selectedRoleId',
    roleCount: 'roleCount'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      // onSelectRole,
      // onCreate,
      // onEditRole,
      // selectedRoleId,
      roleName
    } = this.props.relaxProps;
    // const selectedRole = roles.find(
    //   (role) => role.get('roleInfoId') == selectedRoleId
    // );
    // const flag = roleCount >= 20;
    return <div>角色：{roleName}</div>;
  }
}
