import React from 'react';
import { Modal, Form } from 'antd';
import { noop } from 'qmkit';
import { Relax } from 'plume2';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import EditForm from './edit-form';

const WrapperForm = Form.create({})(EditForm);
@Relax
export default class AccountModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      visible: boolean;
      onHide: Function;
      uuid: '';
      phone: '';
      enterValue: '';
      enableSend: boolean;
      onSavePhone: Function;
    };
  };

  static relaxProps = {
    visible: 'visible',
    onHide: noop,
    uuid: 'uuid',
    phone: 'phone',
    enterValue: 'enterValue',
    enableSend: 'enableSend',
    onSavePhone: noop
  };

  render() {
    const { visible, onHide } = this.props.relaxProps;
    if (!visible) {
      return null;
    }

    return (
      <Modal  maskClosable={false}
        title="修改绑定手机"
        visible={visible}
        onOk={() => this._handleOk()}
        onCancel={() => onHide()}
      >
        <WrapperForm
          ref={form => (this['_form'] = form)}
          {...this.props.relaxProps}
        />
      </Modal>
    );
  }

  _handleOk() {
    const { onSavePhone } = this.props.relaxProps;
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        onSavePhone(values);
      }
    });
  }
}
