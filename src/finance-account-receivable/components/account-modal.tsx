import * as React from 'react';
import { Relax } from 'plume2';
import { Modal, Form } from 'antd';
import { noop } from 'qmkit';
import EditForm from './edit-form';

const WrapperForm = Form.create({})(EditForm);

@Relax
export default class AccountModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      visible: boolean;
      edit: boolean;
      onSave: Function;
      onCancel: Function;
    };
  };

  static relaxProps = {
    visible: 'visible',
    edit: 'edit',
    onSave: noop,
    onCancel: noop
  };

  render() {
    const { visible, edit, onCancel } = this.props.relaxProps;

    if (!visible) {
      return null;
    }

    return (
      <Modal  maskClosable={false}
        title={edit ? '编辑账户' : '新增账户'}
        visible={visible}
        onOk={() => this._handleOk()}
        onCancel={() => onCancel()}
      >
        <WrapperForm ref={form => (this['_form'] = form)} />
      </Modal>
    );
  }

  _handleOk() {
    const form = this._form;
    const { onSave } = this.props.relaxProps;
    form.validateFields(null, (errs, value) => {
      if (!errs) {
        onSave(value);
      }
    });
  }
}
