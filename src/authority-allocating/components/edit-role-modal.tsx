import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form } from 'antd';
import { noop } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import EditForm from './edit-form';

const WrapperForm = Form.create()(EditForm as any);

@Relax
export default class EditRoleModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      visible: boolean;
      onCancel: Function;
      onSaveRole: Function;
      edit: boolean;
    };
  };

  static relaxProps = {
    visible: 'visible',
    customerLevel: 'customerLevel',
    onCancel: noop,
    onSaveRole: noop,
    edit: 'edit'
  };

  render() {
    const { onCancel, visible, edit } = this.props.relaxProps;

    if (!visible) {
      return null;
    }

    const title = edit ? '编辑角色' : '新增角色';

    return (
      <Modal
        maskClosable={false}
        title={title}
        visible={visible}
        onOk={() => this._handleOK()}
        onCancel={() => onCancel()}
      >
        <WrapperForm ref={(form) => (this._form = form)} />
      </Modal>
    );
  }

  _handleOK = () => {
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      //如果校验通过
      if (!errs) {
        this.props.relaxProps.onSaveRole(values);
      }
    });
  };
}
